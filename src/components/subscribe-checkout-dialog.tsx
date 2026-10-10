"use client";

import { useActionState, useState } from "react";
import { initialCheckoutFormState, startCheckout } from "@/app/actions/checkout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SubscriptionPlanId } from "@/lib/payments/types";
import { SUBSCRIPTION_PLANS } from "@/lib/payments/types";
import { CreditCard } from "lucide-react";

type SubscribeCheckoutDialogProps = {
  planId: SubscriptionPlanId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerVariant?: "default" | "outline";
  triggerClassName?: string;
  showTrigger?: boolean;
};

export function SubscribeCheckoutDialog({
  planId,
  open,
  onOpenChange,
  triggerVariant = "outline",
  triggerClassName,
  showTrigger = false,
}: SubscribeCheckoutDialogProps) {
  const plan = SUBSCRIPTION_PLANS[planId];
  const [state, formAction, pending] = useActionState(
    startCheckout,
    initialCheckoutFormState,
  );

  return (
    <>
      {showTrigger ? (
        <Button
          type="button"
          variant={triggerVariant}
          className={triggerClassName}
          onClick={() => onOpenChange(true)}
        >
          <CreditCard data-icon="inline-start" />
          Assinar com Mercado Pago
        </Button>
      ) : null}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Assinar plano {plan.name}</SheetTitle>
            <SheetDescription>
              Informe seus dados para continuar no Checkout Pro do Mercado Pago (
              {plan.priceLabel}/mês).
            </SheetDescription>
          </SheetHeader>
          <form action={formAction} className="mt-6 grid gap-4">
            <input type="hidden" name="plan" value={planId} />
            {state.status === "error" ? (
              <Alert variant="destructive">
                <AlertTitle>Não foi possível ir ao pagamento</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            ) : null}
            <div className="grid gap-2">
              <Label htmlFor={`checkout-name-${planId}`}>Nome</Label>
              <Input
                id={`checkout-name-${planId}`}
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
              <Label htmlFor={`checkout-email-${planId}`}>E-mail</Label>
              <Input
                id={`checkout-email-${planId}`}
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
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Criando preferência..." : "Assinar com Mercado Pago"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function SubscribeCheckoutButton({
  planId,
  variant = "outline",
  className,
  highlighted,
}: {
  planId: SubscriptionPlanId;
  variant?: "default" | "outline";
  className?: string;
  highlighted?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={highlighted ? "default" : variant}
        className={className}
        onClick={() => setOpen(true)}
      >
        <CreditCard data-icon="inline-start" />
        Assinar com Mercado Pago
      </Button>
      <SubscribeCheckoutDialog
        planId={planId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
