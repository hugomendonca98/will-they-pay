import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { startCheckout } from "@/app/actions/checkout";
import { initialCheckoutFormState } from "@/app/actions/checkout-state";
import { getDb } from "@/lib/db/client";
import { createTestDb } from "@/test/helpers/db";
import { server } from "@/test/msw/server";

const workerEnv: CloudflareEnv = {
  DB: {} as D1Database,
  APP_URL: "https://example.com",
  MERCADOPAGO_ACCESS_TOKEN: "TEST-123456",
  MERCADOPAGO_WEBHOOK_SECRET: "whsec-test",
  MERCADOPAGO_SANDBOX: "true",
};

vi.mock("@/lib/env", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/env")>();
  return {
    ...actual,
    getWorkerEnv: vi.fn(async () => workerEnv),
  };
});

vi.mock("@/lib/db/client", () => ({
  getDb: vi.fn(),
}));

function checkoutFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  formData.set("name", overrides.name ?? "Ana Silva");
  formData.set("email", overrides.email ?? "ana@example.com");
  formData.set("plan", overrides.plan ?? "pro");
  return formData;
}

describe("startCheckout", () => {
  beforeEach(() => {
    vi.mocked(getDb).mockResolvedValue(createTestDb());
  });

  it("returns redirect with Mercado Pago checkout URL on success", async () => {
    const result = await startCheckout(initialCheckoutFormState, checkoutFormData());

    expect(result).toEqual({
      status: "redirect",
      checkoutUrl: expect.stringContaining("sandbox.mercadopago.com.br"),
    });
  });

  it("returns payment provider error when Mercado Pago responds with 500", async () => {
    server.use(
      http.post("https://api.mercadopago.com/checkout/preferences", () =>
        HttpResponse.json({ message: "upstream error" }, { status: 500 }),
      ),
    );

    const result = await startCheckout(initialCheckoutFormState, checkoutFormData());

    expect(result.status).toBe("error");
    if (result.status === "error") {
      expect(result.code).toBe("PAYMENT_PROVIDER_ERROR");
      expect(result.mpStatus).toBe(500);
    }
  });

  it("returns payment provider error when Mercado Pago responds with 400", async () => {
    server.use(
      http.post("https://api.mercadopago.com/checkout/preferences", () =>
        HttpResponse.json({ message: "auto_return invalid" }, { status: 400 }),
      ),
    );

    const result = await startCheckout(initialCheckoutFormState, checkoutFormData());

    expect(result.status).toBe("error");
    if (result.status === "error") {
      expect(result.code).toBe("PAYMENT_PROVIDER_ERROR");
      expect(result.mpStatus).toBe(400);
    }
  });

  it("returns DB error when D1 is unavailable", async () => {
    vi.mocked(getDb).mockRejectedValue(new Error("no such table: orders"));

    const result = await startCheckout(initialCheckoutFormState, checkoutFormData());

    expect(result).toEqual({ status: "error", code: "DB_ERROR" });
  });
});
