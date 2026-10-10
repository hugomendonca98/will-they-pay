"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/lib/db/client";
import { getWorkerEnv, readAppEnv } from "@/lib/env";
import { MissingSecretError, ValidationError } from "@/lib/errors";
import { parseCheckoutInput } from "@/lib/payments/checkout-schema";
import { createHttpMercadoPagoClient } from "@/lib/payments/client";
import { createCheckoutPreference } from "@/lib/payments/service";
import { resolveCheckoutItem } from "@/lib/payments/types";

export type CheckoutFormState = {
  status: "idle" | "error";
  message?: string;
  fields?: Record<string, string>;
};

export const initialCheckoutFormState: CheckoutFormState = { status: "idle" };

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

    redirect(checkoutUrl);
  } catch (error) {
    if (isNextRedirect(error)) throw error;

    if (error instanceof ValidationError) {
      return {
        status: "error",
        message: "Revise os campos destacados e tente novamente.",
        fields: error.fields,
      };
    }

    if (error instanceof MissingSecretError || isMissingEnvError(error)) {
      return {
        status: "error",
        message:
          "Pagamentos ainda não estão configurados. Defina as credenciais do gateway em .dev.vars ou como secrets do Worker.",
      };
    }

    console.error("Failed to start checkout", error);
    return {
      status: "error",
      message:
        "Não foi possível iniciar o checkout agora. Confira as credenciais e tente novamente.",
    };
  }
}

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT")
  );
}

function isMissingEnvError(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith("Missing required");
}
