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
import { submitLead } from "@/app/actions/leads";
import { initialLeadFormState } from "@/app/actions/lead-state";
import { site } from "@/content/site";

const formCopy = site.contact.form;

export function LeadForm() {
  const [state, formAction, pending] = useActionState(submitLead, initialLeadFormState);

  return (
    <Card id="leads" className="border shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{formCopy.title}</CardTitle>
        <CardDescription>{formCopy.description}</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid gap-4">
          {state.status === "success" ? (
            <Alert>
              <AlertTitle>{formCopy.successTitle}</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}
          {state.status === "error" ? (
            <Alert variant="destructive">
              <AlertTitle>{formCopy.errorTitle}</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="lead-name">{formCopy.nameLabel}</Label>
            <Input
              id="lead-name"
              name="name"
              autoComplete="name"
              placeholder={formCopy.namePlaceholder}
              required
              aria-invalid={Boolean(state.fields?.name)}
            />
            {state.fields?.name ? (
              <p className="text-destructive text-sm">{state.fields.name}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-email">{formCopy.emailLabel}</Label>
            <Input
              id="lead-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={formCopy.emailPlaceholder}
              required
              aria-invalid={Boolean(state.fields?.email)}
            />
            {state.fields?.email ? (
              <p className="text-destructive text-sm">{state.fields.email}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-phone">{formCopy.phoneLabel}</Label>
            <Input
              id="lead-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder={formCopy.phonePlaceholder}
              aria-invalid={Boolean(state.fields?.phone)}
            />
            {state.fields?.phone ? (
              <p className="text-destructive text-sm">{state.fields.phone}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-message">{formCopy.messageLabel}</Label>
            <Textarea
              id="lead-message"
              name="message"
              rows={4}
              placeholder={formCopy.messagePlaceholder}
              aria-invalid={Boolean(state.fields?.message)}
            />
            {state.fields?.message ? (
              <p className="text-destructive text-sm">{state.fields.message}</p>
            ) : null}
          </div>

          <Button type="submit" disabled={pending} className="h-11 w-full">
            {pending ? formCopy.submitPending : formCopy.submitIdle}
            {!pending ? (
              <IconSetaDireita decorative className="size-4" data-icon="inline-end" />
            ) : null}
          </Button>
          <p className="text-muted-foreground flex items-start gap-2 text-xs">
            <IconCadeado decorative className="mt-0.5 size-3.5 shrink-0" />
            {formCopy.privacyNote}
          </p>
        </CardContent>
      </form>
    </Card>
  );
}
