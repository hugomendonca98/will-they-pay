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
  IconSuporte,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Suspense } from "react";

type CheckoutOutcome = "success" | "failure" | "pending";

const FAILURE_REASONS = [
  "Saldo ou limite do cartão insuficiente",
  "Dados do cartão digitados incorretamente",
  "Pagamento recusado pelo banco emissor",
  "Tempo para concluir o pagamento expirou",
] as const;

function firstQueryValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function PaymentMethodDisplay({
  outcome,
}: {
  outcome: CheckoutOutcome;
}) {
  if (outcome === "success") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <IconPix decorative className="size-4" />
        Pix
      </span>
    );
  }
  if (outcome === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <IconBoleto decorative className="size-4" />
        Boleto bancário
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <IconCartao decorative className="size-4" />
      Cartão
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

  const planLabel = "Pro (mensal)";
  const amountLabel = "R$ 97,00";

  return (
    <div className="rounded-lg bg-muted/60 px-4 py-1">
      <SummaryRow label="Plano" value={planLabel} />
      <SummaryRow label="Valor" value={amountLabel} />
      <SummaryRow
        label="Forma de pagamento"
        value={<PaymentMethodDisplay outcome={outcome} />}
      />
      {paymentId ? (
        <SummaryRow label="ID do pagamento" value={paymentId} />
      ) : null}
      <SummaryRow
        label="Status"
        value={
          outcome === "success" ? (
            <Badge variant="success">
              <IconCheck decorative className="size-3" />
              Aprovado
            </Badge>
          ) : outcome === "pending" ? (
            <Badge variant="warning">
              <IconPagamentoPendente decorative className="size-3" />
              Em análise
            </Badge>
          ) : (
            <Badge variant="destructive">
              <IconPagamentoRecusado decorative className="size-3" />
              Recusado
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

const COPY: Record<
  CheckoutOutcome,
  { title: string; description: string; hint: string }
> = {
  success: {
    title: "Pagamento aprovado",
    description:
      "Obrigado pela sua assinatura! Seu acesso já está liberado e enviamos o recibo para o seu e-mail.",
    hint: "Não recebeu o e-mail? Verifique a caixa de spam ou fale com o suporte.",
  },
  failure: {
    title: "Pagamento não aprovado",
    description:
      "Não conseguimos concluir o seu pagamento. Nenhum valor foi cobrado — você pode tentar novamente.",
    hint: "Dica: tente outro cartão ou pague com Pix para aprovação imediata.",
  },
  pending: {
    title: "Pagamento em análise",
    description:
      "Recebemos o seu pedido e estamos aguardando a confirmação do pagamento.",
    hint: "Você não precisa pagar novamente. Guarde o ID do pagamento para consultas.",
  },
};

export function CheckoutResultPage({
  outcome,
  searchParams,
}: {
  outcome: CheckoutOutcome;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const copy = COPY[outcome];

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

          {outcome === "pending" ? (
            <Alert variant="warning" className="text-left">
              <IconAlerta decorative className="size-4" />
              <AlertTitle>Pix ou boleto podem levar um tempo</AlertTitle>
              <AlertDescription>
                Pagamentos via Pix costumam ser confirmados em poucos minutos. Boletos são
                compensados em até 3 dias úteis. Avisaremos por e-mail assim que for
                aprovado.
              </AlertDescription>
            </Alert>
          ) : null}

          {outcome === "failure" ? (
            <div className="rounded-lg bg-muted/60 px-4 py-4 text-left">
              <p className="mb-3 text-sm font-semibold">Possíveis motivos</p>
              <ul className="space-y-2.5">
                {FAILURE_REASONS.map((reason) => (
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
            {outcome === "success" ? (
              <Button className="h-11 w-full" render={<Link href="/#contato" />}>
                Acessar minha conta
                <IconSetaDireita decorative className="size-4" data-icon="inline-end" />
              </Button>
            ) : outcome === "failure" ? (
              <>
                <Button className="h-11 w-full" render={<Link href="/#precos" />}>
                  <IconSetaDireita decorative className="size-4" data-icon="inline-start" />
                  Tentar novamente
                </Button>
                <Button
                  variant="outline"
                  className="h-11 w-full"
                  render={<Link href="/#contato" />}
                >
                  <IconSuporte decorative className="size-4" data-icon="inline-start" />
                  Falar com o suporte
                </Button>
              </>
            ) : (
              <Button className="h-11 w-full" render={<Link href="/" />}>
                <IconSetaDireita
                  decorative
                  className="size-4 rotate-180"
                  data-icon="inline-start"
                />
                Voltar para o início
              </Button>
            )}
            {outcome === "success" ? (
              <Button variant="link" className="w-full" render={<Link href="/" />}>
                Voltar para o início
              </Button>
            ) : null}
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
