import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { getWorkerEnv, readAppEnv } from "@/lib/env";
import { InvalidWebhookSignatureError } from "@/lib/errors";
import { createHttpMercadoPagoClient } from "@/lib/payments/client";
import { processPaymentWebhook } from "@/lib/payments/service";
import type { WebhookNotification } from "@/lib/payments/types";

export async function POST(request: Request) {
  const xSignature = request.headers.get("x-signature") ?? "";
  const xRequestId = request.headers.get("x-request-id") ?? undefined;
  const dataIdFromQuery = new URL(request.url).searchParams.get("data.id") ?? undefined;

  let notification: WebhookNotification = {};
  try {
    notification = (await request.json()) as WebhookNotification;
  } catch {
    notification = {};
  }

  try {
    const env = readAppEnv(await getWorkerEnv());
    const db = await getDb();
    const payments = createHttpMercadoPagoClient({
      accessToken: env.mercadoPagoAccessToken,
    });

    const result = await processPaymentWebhook(
      {
        xSignature,
        xRequestId,
        dataIdFromQuery,
        notification,
        secret: env.mercadoPagoWebhookSecret,
      },
      { db, payments },
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof InvalidWebhookSignatureError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Mercado Pago webhook failed", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
