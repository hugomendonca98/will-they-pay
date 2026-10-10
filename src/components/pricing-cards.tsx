"use client";

import { useActionState, useState } from "react";
import {
  IconCartao,
  IconCadeado,
  IconCheck,
  IconMoedas,
} from "@/components/icons";
import { initialCheckoutFormState, startCheckout } from "@/app/actions/checkout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanId,
} from "@/lib/payments/types";
import { cn } from "@/lib/utils";

const plans = Object.values(SUBSCRIPTION_PLANS);

export function PricingCards() {
  const [checkoutPlanId, setCheckoutPlanId] = useState<SubscriptionPlanId | null>(
    null,
  );
  const [state, formAction, pending] = useActionState(
    startCheckout,
    initialCheckoutFormState,
  );

  const open = checkoutPlanId !== null;
  const activePlan = checkoutPlanId ? SUBSCRIPTION_PLANS[checkoutPlanId] : null;

  function openCheckout(planId: SubscriptionPlanId) {
    setCheckoutPlanId(planId);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setCheckoutPlanId(null);
  }

  return (
    <>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative h-full border shadow-sm",
              plan.highlighted && "border-primary ring-2 ring-primary/20",
            )}
          >
            {plan.highlighted ? (
              <Badge
                variant="gold"
                className="absolute top-4 right-4 gap-1 border-transparent"
              >
                <IconMoedas decorative className="size-3" />
                Mais popular
              </Badge>
            ) : null}
            <CardHeader className="space-y-4 pb-2">
              <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
              <div>
                <span className="font-heading text-4xl font-bold">{plan.priceLabel}</span>
                <span className="text-muted-foreground text-sm"> /mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                type="button"
                variant={plan.highlighted ? "default" : "outline"}
                className="h-11 w-full"
                onClick={() => openCheckout(plan.id)}
              >
                <IconCartao decorative className="size-4" data-icon="inline-start" />
                Assinar agora
              </Button>
              <ul className="space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <IconCheck decorative className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="gap-0 p-0 sm:max-w-md">
          {activePlan ? (
            <>
              <DialogHeader className="border-b px-6 py-5 text-left">
                <DialogTitle className="text-lg font-semibold">
                  Assinar plano {activePlan.name}
                </DialogTitle>
                <DialogDescription>
                  Informe seus dados para continuar com o pagamento (
                  {activePlan.priceLabel}/mês).
                </DialogDescription>
              </DialogHeader>
              <form
                key={activePlan.id}
                action={formAction}
                className="grid gap-4 px-6 py-5"
              >
                <input type="hidden" name="plan" value={activePlan.id} />
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
                    placeholder="Seu nome completo"
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
                    placeholder="voce@empresa.com"
                    required
                    aria-invalid={Boolean(state.fields?.email)}
                  />
                  {state.fields?.email ? (
                    <p className="text-destructive text-sm">{state.fields.email}</p>
                  ) : null}
                </div>
                <Button type="submit" disabled={pending} className="h-11 w-full">
                  {pending ? "Redirecionando..." : "Continuar para pagamento"}
                </Button>
              </form>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <p className="text-muted-foreground mx-auto mt-10 flex max-w-2xl items-start justify-center gap-2 text-center text-sm">
        <IconCadeado decorative className="mt-0.5 size-4 shrink-0" />
        Pagamento seguro. Aceitamos Pix, cartão de crédito em até 12x e boleto.
      </p>
    </>
  );
}
