export type CheckoutFormState =
  | { status: "idle" }
  | {
      status: "error";
      code: string;
      message?: string;
      fields?: Record<string, string>;
      mpStatus?: number;
    }
  | { status: "redirect"; checkoutUrl: string };

export const initialCheckoutFormState: CheckoutFormState = { status: "idle" };
