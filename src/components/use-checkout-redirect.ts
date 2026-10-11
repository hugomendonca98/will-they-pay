"use client";

import { useEffect } from "react";
import type { CheckoutFormState } from "@/app/actions/checkout-state";

export function useCheckoutRedirect(state: CheckoutFormState): void {
  useEffect(() => {
    if (state.status === "redirect" && state.checkoutUrl) {
      window.location.assign(state.checkoutUrl);
    }
  }, [state]);
}
