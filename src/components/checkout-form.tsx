"use client";

import { useActionState } from "react";
import { initialCheckoutFormState, startCheckout } from "@/app/actions/checkout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { DEMO_PRODUCT } from "@/lib/payments/types";

const priceLabel = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: DEMO_PRODUCT.currencyId,
}).format(DEMO_PRODUCT.unitPrice);

export function CheckoutForm() {
  const [state, formAction, pending] = useActionState(
    startCheckout,
    initialCheckoutFormState,
  );

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
          {state.status === "error" ? (
            <Alert variant="destructive">
              <AlertTitle>Não foi possível ir ao pagamento</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="checkout-name">Nome</Label>
            <Input
              id="checkout-name"
              name="name"
              autoComplete="name"
              required
              aria-invalid={Boolean(state.fields?.name)}
            />
            {state.fields?.name ? (
              <p className="text-destructive text-sm">{state.fields.name}</p>
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
              aria-invalid={Boolean(state.fields?.email)}
            />
            {state.fields?.email ? (
              <p className="text-destructive text-sm">{state.fields.email}</p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? "Criando preferência..." : `Pagar ${priceLabel}`}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
