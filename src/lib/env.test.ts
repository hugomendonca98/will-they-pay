import { describe, expect, it } from "vitest";
import { MissingSecretError } from "@/lib/errors";
import { readAppEnv } from "@/lib/env";

function env(overrides: Partial<CloudflareEnv> = {}): CloudflareEnv {
  return {
    DB: {} as D1Database,
    APP_URL: "http://localhost:3000",
    MERCADOPAGO_ACCESS_TOKEN: "TEST-123",
    MERCADOPAGO_WEBHOOK_SECRET: "whsec-123",
    MERCADOPAGO_SANDBOX: "true",
    ...overrides,
  };
}

describe("readAppEnv", () => {
  it("reads sandbox as true by default", () => {
    expect(readAppEnv(env({ MERCADOPAGO_SANDBOX: undefined })).mercadoPagoSandbox).toBe(
      true,
    );
    expect(readAppEnv(env({ MERCADOPAGO_SANDBOX: "false" })).mercadoPagoSandbox).toBe(
      false,
    );
  });

  it("rejects placeholder Mercado Pago secrets", () => {
    expect(() =>
      readAppEnv(
        env({ MERCADOPAGO_ACCESS_TOKEN: "replace-with-your-test-access-token" }),
      ),
    ).toThrow(MissingSecretError);
  });
});
