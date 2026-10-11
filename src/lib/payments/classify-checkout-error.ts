import {
  AppError,
  MissingSecretError,
  PaymentProviderError,
  ValidationError,
} from "@/lib/errors";
import { logCheckoutFailure } from "./checkout-log";

export type CheckoutErrorResult = {
  code: string;
  message?: string;
  fields?: Record<string, string>;
  mpStatus?: number;
};

function isMissingEnvError(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith("Missing required");
}

function isDbBindingError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes("D1 binding") ||
      error.message.includes("not configured") ||
      /no such table/i.test(error.message))
  );
}

export function classifyCheckoutError(error: unknown): CheckoutErrorResult {
  if (error instanceof ValidationError) {
    logCheckoutFailure({
      code: error.code,
      cause: "validation",
    });
    return {
      code: error.code,
      message: "Revise os campos destacados e tente novamente.",
      fields: error.fields,
    };
  }

  if (error instanceof MissingSecretError || isMissingEnvError(error)) {
    logCheckoutFailure({
      code: "MISSING_CONFIG",
      cause: error instanceof Error ? error.message : "missing_config",
    });
    return {
      code: "MISSING_CONFIG",
      message:
        "Pagamentos ainda não estão configurados. Defina as credenciais do gateway em .dev.vars ou como secrets do Worker.",
    };
  }

  if (error instanceof PaymentProviderError) {
    logCheckoutFailure({
      code: error.code,
      cause: "mercadopago",
      mpStatus: error.status,
      message: error.message,
    });
    return {
      code: error.code,
      mpStatus: error.status,
    };
  }

  if (isDbBindingError(error)) {
    logCheckoutFailure({
      code: "DB_ERROR",
      cause: error instanceof Error ? error.message : "db",
    });
    return { code: "DB_ERROR" };
  }

  if (error instanceof AppError) {
    logCheckoutFailure({
      code: error.code,
      cause: "app_error",
      message: error.message,
    });
    return { code: error.code, message: error.message };
  }

  logCheckoutFailure({
    code: "UNKNOWN",
    cause: error instanceof Error ? error.name : "unknown",
    message: error instanceof Error ? error.message : undefined,
  });
  return { code: "UNKNOWN" };
}
