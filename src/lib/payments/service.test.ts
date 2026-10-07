import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { orders, payments } from "@/lib/db/schema";
import { InvalidWebhookSignatureError } from "@/lib/errors";
import { createFixedClock, createFixedIds, createTestDb } from "@/test/helpers/db";
import { server } from "@/test/msw/server";
import { createHttpMercadoPagoClient } from "./client";
import { createCheckoutPreference, processPaymentWebhook } from "./service";
import { computeWebhookSignature, buildWebhookManifest } from "./signature";
import { DEMO_PRODUCT } from "./types";

const SECRET = "whsec_test";
const ACCESS_TOKEN = "TEST-access-token";

function client() {
  return createHttpMercadoPagoClient({ accessToken: ACCESS_TOKEN });
}

describe("createCheckoutPreference", () => {
  it("creates an order and a Mercado Pago preference", async () => {
    const db = createTestDb();

    const result = await createCheckoutPreference(
      {
        customer: { name: "Hugo", email: "hugo@example.com" },
        item: { ...DEMO_PRODUCT },
        appUrl: "http://localhost:3000",
        sandbox: true,
      },
      {
        db,
        payments: client(),
        clock: createFixedClock(),
        ids: createFixedIds("order-1"),
      },
    );

    expect(result.preference.id).toBe("pref-test-1");
    expect(result.checkoutUrl).toContain("sandbox.mercadopago.com.br");
    expect(result.order.status).toBe("pending");
    expect(result.order.preferenceId).toBe("pref-test-1");
    expect(result.order.amountCents).toBe(1000);

    const stored = await db.select().from(orders);
    expect(stored).toHaveLength(1);
  });

  it("uses live init_point when sandbox is disabled", async () => {
    const db = createTestDb();

    const result = await createCheckoutPreference(
      {
        customer: { email: "hugo@example.com" },
        item: { ...DEMO_PRODUCT },
        appUrl: "https://example.com",
        sandbox: false,
      },
      { db, payments: client(), ids: createFixedIds("order-live") },
    );

    expect(result.checkoutUrl).toContain("www.mercadopago.com.br");
  });
});

describe("processPaymentWebhook", () => {
  it("rejects an invalid signature without touching the database", async () => {
    const db = createTestDb();

    await expect(
      processPaymentWebhook(
        {
          xSignature: "ts=1,v1=deadbeef",
          xRequestId: "req-1",
          dataIdFromQuery: "999",
          notification: { type: "payment", data: { id: "999" } },
          secret: SECRET,
        },
        { db, payments: client() },
      ),
    ).rejects.toBeInstanceOf(InvalidWebhookSignatureError);

    expect(await db.select().from(payments)).toEqual([]);
  });

  it("fetches the payment and updates order status after a valid signature", async () => {
    const db = createTestDb();
    const clock = createFixedClock();

    await db.insert(orders).values({
      id: "order-1",
      status: "pending",
      amountCents: 1000,
      currency: "BRL",
      title: "Plano Starter",
      payerEmail: "hugo@example.com",
      payerName: "Hugo",
      preferenceId: "pref-test-1",
      checkoutUrl: "https://sandbox.mercadopago.com.br/x",
      createdAt: clock.now(),
      updatedAt: clock.now(),
    });

    const dataId = "777";
    const requestId = "req-abc";
    const ts = "1742505638683";
    const v1 = computeWebhookSignature(
      SECRET,
      buildWebhookManifest({ dataId, requestId, ts }),
    );

    server.use(
      http.get("https://api.mercadopago.com/v1/payments/:id", () =>
        HttpResponse.json({
          id: 777,
          status: "approved",
          status_detail: "accredited",
          external_reference: "order-1",
          transaction_amount: 10,
          currency_id: "BRL",
        }),
      ),
    );

    const result = await processPaymentWebhook(
      {
        xSignature: `ts=${ts},v1=${v1}`,
        xRequestId: requestId,
        dataIdFromQuery: dataId,
        notification: { type: "payment", data: { id: dataId } },
        secret: SECRET,
      },
      { db, payments: client(), clock, ids: createFixedIds("pay-1") },
    );

    expect(result).toEqual({
      outcome: "updated",
      orderId: "order-1",
      status: "approved",
      paymentId: "777",
    });

    const [order] = await db.select().from(orders);
    expect(order?.status).toBe("approved");

    const [payment] = await db.select().from(payments);
    expect(payment?.mercadoPagoPaymentId).toBe("777");
    expect(payment?.status).toBe("approved");
  });
});
