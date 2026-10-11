export type CheckoutFailureLog = {
  event: "checkout_start_failed";
  code: string;
  cause?: string;
  mpStatus?: number;
  message?: string;
};

export function logCheckoutFailure(details: Omit<CheckoutFailureLog, "event">): void {
  const payload: CheckoutFailureLog = {
    event: "checkout_start_failed",
    ...details,
  };
  console.error(JSON.stringify(payload));
}
