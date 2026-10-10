"use client";

import { useActionState } from "react";
import { IconCadeado, IconSetaDireita } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { initialLeadFormState, submitLead } from "@/app/actions/leads";

export function LeadForm() {
  const [state, formAction, pending] = useActionState(submitLead, initialLeadFormState);

  return (
    <Card id="leads" className="border shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Envie uma mensagem</CardTitle>
        <CardDescription>
          Preencha os campos abaixo. Leva menos de 1 minuto.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid gap-4">
          {state.status === "success" ? (
            <Alert>
              <AlertTitle>Mensagem enviada</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}
          {state.status === "error" ? (
            <Alert variant="destructive">
              <AlertTitle>Não foi possível enviar</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="lead-name">Nome</Label>
            <Input
              id="lead-name"
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
            <Label htmlFor="lead-email">E-mail</Label>
            <Input
              id="lead-email"
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

          <div className="grid gap-2">
            <Label htmlFor="lead-phone">WhatsApp (opcional)</Label>
            <Input
              id="lead-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="(11) 99999-0000"
              aria-invalid={Boolean(state.fields?.phone)}
            />
            {state.fields?.phone ? (
              <p className="text-destructive text-sm">{state.fields.phone}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-message">Mensagem</Label>
            <Textarea
              id="lead-message"
              name="message"
              rows={4}
              placeholder="Conte um pouco sobre o que você precisa..."
              aria-invalid={Boolean(state.fields?.message)}
            />
            {state.fields?.message ? (
              <p className="text-destructive text-sm">{state.fields.message}</p>
            ) : null}
          </div>

          <Button type="submit" disabled={pending} className="h-11 w-full">
            {pending ? "Enviando..." : "Enviar mensagem"}
            {!pending ? (
              <IconSetaDireita decorative className="size-4" data-icon="inline-end" />
            ) : null}
          </Button>
          <p className="text-muted-foreground flex items-start gap-2 text-xs">
            <IconCadeado decorative className="mt-0.5 size-3.5 shrink-0" />
            Ao enviar, você concorda com nossa política de privacidade. Não compartilhamos
            seus dados com terceiros.
          </p>
        </CardContent>
      </form>
    </Card>
  );
}
