export class AppError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}

export class MissingSecretError extends AppError {
  constructor(name: string) {
    super(
      `Missing required secret or binding: ${name}. Set it in .dev.vars locally or with wrangler secret put in production.`,
      "MISSING_SECRET",
      500,
    );
    this.name = "MissingSecretError";
  }
}

export class ValidationError extends AppError {
  readonly fields: Record<string, string>;

  constructor(fields: Record<string, string>, message = "Validation failed") {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
    this.fields = fields;
  }
}

export class PaymentProviderError extends AppError {
  constructor(message: string, status = 502) {
    super(message, "PAYMENT_PROVIDER_ERROR", status);
    this.name = "PaymentProviderError";
  }
}

export class InvalidWebhookSignatureError extends AppError {
  constructor() {
    super("Invalid Mercado Pago webhook signature", "INVALID_WEBHOOK_SIGNATURE", 401);
    this.name = "InvalidWebhookSignatureError";
  }
}
