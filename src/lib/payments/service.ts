import { eq } from "drizzle-orm";
import { orders, payments, type Order } from "@/lib/db/schema";
import type { AppDatabase } from "@/lib/db/types";
import { cryptoIdGenerator, systemClock, type Clock, type IdGenerator } from "@/lib/env";
import { InvalidWebhookSignatureError, PaymentProviderError } from "@/lib/errors";
import { verifyMercadoPagoSignature } from "./signature";
import { mapMercadoPagoStatus } from "./status";
import type {
  CreatePreferenceItem,
  MercadoPagoClient,
  MercadoPagoPayment,
  PreferenceResult,
  WebhookNotification,
} from "./types";

export type CheckoutCustomer = {
  name?: string;
  email?: string;
};

export type CreateCheckoutPreferenceInput = {
  customer: CheckoutCustomer;
  item: CreatePreferenceItem;
  appUrl: string;
  sandbox: boolean;
};

export type CreateCheckoutPreferenceResult = {
  order: Order;
  preference: PreferenceResult;
  checkoutUrl: string;
};

export async function createCheckoutPreference(
  input: CreateCheckoutPreferenceInput,
  deps: {
    db: AppDatabase;
    payments: MercadoPagoClient;
    clock?: Clock;
    ids?: IdGenerator;
  },
): Promise<CreateCheckoutPreferenceResult> {
  const clock = deps.clock ?? systemClock;
  const ids = deps.ids ?? cryptoIdGenerator;
  const now = clock.now();
  const orderId = ids.id();
  const origin = input.appUrl.replace(/\/$/, "");
  const amountCents = Math.round(input.item.unitPrice * 100);

  await deps.db.insert(orders).values({
    id: orderId,
    status: "pending",
    amountCents,
    currency: input.item.currencyId,
    title: input.item.title,
    payerEmail: input.customer.email ?? null,
    payerName: input.customer.name ?? null,
    preferenceId: null,
    checkoutUrl: null,
    createdAt: now,
    updatedAt: now,
  });

  const preference = await deps.payments.createPreference({
    items: [input.item],
    payer: {
      email: input.customer.email,
      name: input.customer.name,
    },
    backUrls: {
      success: `${origin}/checkout/success`,
      failure: `${origin}/checkout/failure`,
      pending: `${origin}/checkout/pending`,
    },
    notificationUrl: `${origin}/api/webhooks/mercadopago`,
    externalReference: orderId,
    autoReturn: origin.startsWith("https://") ? "approved" : undefined,
  });

  const checkoutUrl = input.sandbox
    ? (preference.sandboxInitPoint ?? preference.initPoint)
    : preference.initPoint;

  await deps.db
    .update(orders)
    .set({
      preferenceId: preference.id,
      checkoutUrl,
      updatedAt: clock.now(),
    })
    .where(eq(orders.id, orderId));

  const [order] = await deps.db.select().from(orders).where(eq(orders.id, orderId));

  if (!order) {
    throw new PaymentProviderError("Order was not persisted");
  }

  return { order, preference, checkoutUrl };
}

export type ProcessWebhookInput = {
  xSignature: string;
  xRequestId?: string;
  dataIdFromQuery?: string;
  notification: WebhookNotification;
  secret: string;
};

export type ProcessWebhookResult =
  | { outcome: "ignored"; reason: string }
  | { outcome: "updated"; orderId: string; status: string; paymentId: string };

export async function processPaymentWebhook(
  input: ProcessWebhookInput,
  deps: {
    db: AppDatabase;
    payments: MercadoPagoClient;
    clock?: Clock;
    ids?: IdGenerator;
  },
): Promise<ProcessWebhookResult> {
  const dataId = input.dataIdFromQuery ?? input.notification.data?.id;

  const valid = verifyMercadoPagoSignature({
    xSignature: input.xSignature,
    xRequestId: input.xRequestId,
    dataId,
    secret: input.secret,
  });

  if (!valid) {
    throw new InvalidWebhookSignatureError();
  }

  if (input.notification.type && input.notification.type !== "payment") {
    return { outcome: "ignored", reason: `Unhandled topic: ${input.notification.type}` };
  }

  if (!dataId) {
    return { outcome: "ignored", reason: "Notification has no payment id" };
  }

  const payment = await deps.payments.getPayment(dataId);
  return persistPaymentUpdate(payment, deps);
}

async function persistPaymentUpdate(
  payment: MercadoPagoPayment,
  deps: {
    db: AppDatabase;
    clock?: Clock;
    ids?: IdGenerator;
  },
): Promise<ProcessWebhookResult> {
  const clock = deps.clock ?? systemClock;
  const ids = deps.ids ?? cryptoIdGenerator;
  const now = clock.now();
  const mpId = String(payment.id);
  const orderId = payment.externalReference?.trim();

  if (!orderId) {
    return { outcome: "ignored", reason: "Payment has no external_reference" };
  }

  const [order] = await deps.db.select().from(orders).where(eq(orders.id, orderId));
  if (!order) {
    return { outcome: "ignored", reason: `Unknown order ${orderId}` };
  }

  const mappedStatus = mapMercadoPagoStatus(payment.status);
  const payloadJson = JSON.stringify(payment);

  const [existing] = await deps.db
    .select()
    .from(payments)
    .where(eq(payments.mercadoPagoPaymentId, mpId));

  if (existing) {
    await deps.db
      .update(payments)
      .set({
        status: payment.status,
        statusDetail: payment.statusDetail ?? null,
        payloadJson,
        updatedAt: now,
      })
      .where(eq(payments.id, existing.id));
  } else {
    await deps.db.insert(payments).values({
      id: ids.id(),
      orderId,
      mercadoPagoPaymentId: mpId,
      status: payment.status,
      statusDetail: payment.statusDetail ?? null,
      payloadJson,
      createdAt: now,
      updatedAt: now,
    });
  }

  await deps.db
    .update(orders)
    .set({ status: mappedStatus, updatedAt: now })
    .where(eq(orders.id, orderId));

  return {
    outcome: "updated",
    orderId,
    status: mappedStatus,
    paymentId: mpId,
  };
}
