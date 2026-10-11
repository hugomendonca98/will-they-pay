"use server";

import { getDb } from "@/lib/db/client";
import { getWorkerEnv, readAppEnv } from "@/lib/env";
import type { CheckoutFormState } from "@/app/actions/checkout-state";
import { parseCheckoutInput } from "@/lib/payments/checkout-schema";
import { classifyCheckoutError } from "@/lib/payments/classify-checkout-error";
import { createHttpMercadoPagoClient } from "@/lib/payments/client";
import { createCheckoutPreference } from "@/lib/payments/service";
import { resolveCheckoutItem } from "@/lib/payments/types";

export async function startCheckout(
  _prev: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  try {
    const customer = parseCheckoutInput({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
    });

    const env = readAppEnv(await getWorkerEnv());
    const db = await getDb();
    const payments = createHttpMercadoPagoClient({
      accessToken: env.mercadoPagoAccessToken,
    });

    const planId = String(formData.get("plan") ?? "").trim() || undefined;
    const item = resolveCheckoutItem(planId);

    const { checkoutUrl } = await createCheckoutPreference(
      {
        customer,
        item,
        appUrl: env.appUrl,
        sandbox: env.mercadoPagoSandbox,
      },
      { db, payments },
    );

    if (!checkoutUrl?.trim()) {
      return { status: "error", code: "PAYMENT_PROVIDER_ERROR" };
    }

    return { status: "redirect", checkoutUrl };
  } catch (error) {
    const classified = classifyCheckoutError(error);
    return {
      status: "error",
      code: classified.code,
      message: classified.message,
      fields: classified.fields,
      mpStatus: classified.mpStatus,
    };
  }
}
