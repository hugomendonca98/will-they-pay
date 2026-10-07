"use client";

import { useActionState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { initialLeadFormState, submitLead } from "@/app/actions/leads";

export function LeadForm() {
  const [state, formAction, pending] = useActionState(submitLead, initialLeadFormState);

  return (
    <Card id="leads">
      <CardHeader>
        <CardTitle>Capte o interesse de quem chega</CardTitle>
        <CardDescription>
          Formulário de exemplo com validação no servidor e persistência no D1.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid gap-4">
          {state.status === "success" ? (
            <Alert>
              <AlertTitle>Lead salvo</AlertTitle>
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
              required
              aria-invalid={Boolean(state.fields?.email)}
            />
            {state.fields?.email ? (
              <p className="text-destructive text-sm">{state.fields.email}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-phone">Telefone (opcional)</Label>
            <Input
              id="lead-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              aria-invalid={Boolean(state.fields?.phone)}
            />
            {state.fields?.phone ? (
              <p className="text-destructive text-sm">{state.fields.phone}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-message">Mensagem (opcional)</Label>
            <Textarea
              id="lead-message"
              name="message"
              rows={4}
              aria-invalid={Boolean(state.fields?.message)}
            />
            {state.fields?.message ? (
              <p className="text-destructive text-sm">{state.fields.message}</p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? "Enviando..." : "Enviar lead"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
