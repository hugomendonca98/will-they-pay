import type { ReactNode } from "react";
import Link from "next/link";
import {
  IconAlerta,
  IconBoleto,
  IconCadeado,
  IconCartao,
  IconCheck,
  IconEmail,
  IconPagamentoAprovado,
  IconPagamentoPendente,
  IconPagamentoRecusado,
  IconPix,
  IconSetaDireita,
} from "@/components/icons";
import { SiteCtaButton } from "@/components/marketing/site-cta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Suspense } from "react";
import { site } from "@/content/site";

type CheckoutOutcome = "success" | "failure" | "pending";

const resultCopy = site.checkoutResult;
const summaryCopy = resultCopy.summary;

function firstQueryValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function PaymentMethodDisplay({
  outcome,
}: {
  outcome: CheckoutOutcome;
}) {
  const label = summaryCopy.methods[outcome];
  if (outcome === "success") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <IconPix decorative className="size-4" />
        {label}
      </span>
    );
  }
  if (outcome === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <IconBoleto decorative className="size-4" />
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <IconCartao decorative className="size-4" />
      {label}
    </span>
  );
}

function SummaryRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

async function CheckoutResultDetails({
  outcome,
  searchParams,
}: {
  outcome: CheckoutOutcome;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const paymentId =
    firstQueryValue(params.payment_id) ??
    firstQueryValue(params.collection_id) ??
    (outcome === "success"
      ? "MP-1234567890"
      : outcome === "pending"
        ? "MP-1234567891"
        : undefined);

  return (
    <div className="rounded-lg bg-muted/60 px-4 py-1">
      <SummaryRow label={summaryCopy.planLabel} value={summaryCopy.demoPlan} />
      <SummaryRow label={summaryCopy.amountLabel} value={summaryCopy.demoAmount} />
      <SummaryRow
        label={summaryCopy.methodLabel}
        value={<PaymentMethodDisplay outcome={outcome} />}
      />
      {paymentId ? (
        <SummaryRow label={summaryCopy.paymentIdLabel} value={paymentId} />
      ) : null}
      <SummaryRow
        label={summaryCopy.statusLabel}
        value={
          outcome === "success" ? (
            <Badge variant="success">
              <IconCheck decorative className="size-3" />
              {summaryCopy.statusApproved}
            </Badge>
          ) : outcome === "pending" ? (
            <Badge variant="warning">
              <IconPagamentoPendente decorative className="size-3" />
              {summaryCopy.statusPending}
            </Badge>
          ) : (
            <Badge variant="destructive">
              <IconPagamentoRecusado decorative className="size-3" />
              {summaryCopy.statusRejected}
            </Badge>
          )
        }
      />
    </div>
  );
}

function OutcomeIcon({ outcome }: { outcome: CheckoutOutcome }) {
  if (outcome === "success") {
    return <IconPagamentoAprovado className="mx-auto size-16" />;
  }
  if (outcome === "pending") {
    return <IconPagamentoPendente className="mx-auto size-16" />;
  }
  return <IconPagamentoRecusado className="mx-auto size-16" />;
}

export function CheckoutResultPage({
  outcome,
  searchParams,
}: {
  outcome: CheckoutOutcome;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const copy = resultCopy[outcome];

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-10 sm:py-16">
      <Card className="border shadow-md">
        <CardContent className="space-y-6 px-6 py-8 text-center sm:px-8">
          <OutcomeIcon outcome={outcome} />
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              {copy.title}
            </h1>
            <p className="text-muted-foreground text-sm text-pretty">{copy.description}</p>
          </div>

          {outcome === "pending" && "alertTitle" in copy ? (
            <Alert variant="warning" className="text-left">
              <IconAlerta decorative className="size-4" />
              <AlertTitle>{copy.alertTitle}</AlertTitle>
              <AlertDescription>{copy.alertDescription}</AlertDescription>
            </Alert>
          ) : null}

          {outcome === "failure" && "reasonsTitle" in copy ? (
            <div className="rounded-lg bg-muted/60 px-4 py-4 text-left">
              <p className="mb-3 text-sm font-semibold">{copy.reasonsTitle}</p>
              <ul className="space-y-2.5">
                {copy.reasons.map((reason) => (
                  <li key={reason} className="flex gap-2 text-sm">
                    <IconPagamentoRecusado
                      decorative
                      className="mt-0.5 size-4 shrink-0 text-destructive"
                    />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <Suspense
            fallback={
              <div className="h-40 animate-pulse rounded-lg bg-muted/60" aria-hidden />
            }
          >
            <CheckoutResultDetails outcome={outcome} searchParams={searchParams} />
          </Suspense>

          <div className="space-y-3 pt-2">
            {outcome === "success" && "secondaryCta" in copy ? (
              <>
                <SiteCtaButton cta={copy.primaryCta} className="h-11 w-full">
                  <IconSetaDireita decorative className="size-4" data-icon="inline-end" />
                </SiteCtaButton>
                <SiteCtaButton
                  cta={copy.secondaryCta}
                  variant="outline"
                  className="h-11 w-full"
                />
              </>
            ) : outcome === "failure" && "secondaryCta" in copy ? (
              <>
                <Button className="h-11 w-full" render={<Link href={copy.primaryCta.href} />}>
                  <IconSetaDireita decorative className="size-4" data-icon="inline-start" />
                  {copy.primaryCta.label}
                </Button>
                <SiteCtaButton
                  cta={copy.secondaryCta}
                  variant="outline"
                  className="h-11 w-full"
                />
              </>
            ) : (
              <Button className="h-11 w-full" render={<Link href={copy.primaryCta.href} />}>
                <IconSetaDireita
                  decorative
                  className="size-4 rotate-180"
                  data-icon="inline-start"
                />
                {copy.primaryCta.label}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <p className="text-muted-foreground mx-auto mt-6 flex max-w-md items-start justify-center gap-2 text-center text-xs">
        {outcome === "failure" ? (
          <IconCadeado decorative className="mt-0.5 size-3.5 shrink-0" />
        ) : (
          <IconEmail decorative className="mt-0.5 size-3.5 shrink-0" />
        )}
        {copy.hint}
      </p>
    </div>
  );
}
