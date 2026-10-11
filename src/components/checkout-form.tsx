"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { startCheckout } from "@/app/actions/checkout";
import { initialCheckoutFormState } from "@/app/actions/checkout-state";
import { CheckoutErrorAlert } from "@/components/checkout-error-alert";
import { useCheckoutFailureCount } from "@/components/use-checkout-failure-count";
import { useCheckoutRedirect } from "@/components/use-checkout-redirect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { site } from "@/content/site";
import { DEMO_PRODUCT } from "@/lib/payments/types";

const checkoutErrorCopy = site.checkout.error;

const priceLabel = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: DEMO_PRODUCT.currencyId,
}).format(DEMO_PRODUCT.unitPrice);

export function CheckoutForm() {
  const [state, formAction, pending] = useActionState(
    startCheckout,
    initialCheckoutFormState,
  );
  const alertRef = useRef<HTMLDivElement>(null);
  const [failureCount] = useCheckoutFailureCount(pending, state);
  useCheckoutRedirect(state);

  const hasError = state.status === "error";
  const fieldErrors = hasError ? state.fields : undefined;

  useEffect(() => {
    if (state.status === "error") {
      alertRef.current?.focus();
    }
  }, [state.status, failureCount]);

  const submitLabel = pending
    ? checkoutErrorCopy.retrying
    : hasError
      ? checkoutErrorCopy.retry
      : `Pagar ${priceLabel}`;

  return (
    <Card id="checkout">
      <CardHeader>
        <CardTitle>Checkout de exemplo</CardTitle>
        <CardDescription>
          Cria uma preferência no servidor, grava o pedido no D1 e redireciona para o
          pagamento. Produto demo: {DEMO_PRODUCT.title} por {priceLabel}.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid gap-4">
          {hasError ? (
            <CheckoutErrorAlert
              ref={alertRef}
              failureCount={failureCount}
              validationMessage={hasError ? state.message : undefined}
            />
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="checkout-name">Nome</Label>
            <Input
              id="checkout-name"
              name="name"
              autoComplete="name"
              required
              aria-invalid={Boolean(fieldErrors?.name)}
            />
            {fieldErrors?.name ? (
              <p className="text-destructive text-sm">{fieldErrors.name}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="checkout-email">E-mail</Label>
            <Input
              id="checkout-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(fieldErrors?.email)}
            />
            {fieldErrors?.email ? (
              <p className="text-destructive text-sm">{fieldErrors.email}</p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : null}
            {submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
