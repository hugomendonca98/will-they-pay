"use client";

import { useEffect, useRef, useState } from "react";
import type { CheckoutFormState } from "@/app/actions/checkout-state";

export function useCheckoutFailureCount(
  pending: boolean,
  state: CheckoutFormState,
): [number, () => void] {
  const [failureCount, setFailureCount] = useState(0);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && state.status === "error") {
      setFailureCount((count) => count + 1);
    }
    wasPending.current = pending;
  }, [pending, state.status]);

  const resetFailureCount = () => {
    setFailureCount(0);
  };

  return [failureCount, resetFailureCount];
}
