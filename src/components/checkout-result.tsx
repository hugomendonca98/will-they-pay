import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";

type CheckoutOutcome = "success" | "failure" | "pending";

const COPY: Record<
  CheckoutOutcome,
  { title: string; description: string; badge: string }
> = {
  success: {
    title: "Pagamento aprovado",
    description:
      "O Mercado Pago redirecionou você após a aprovação. O status definitivo chega pelo webhook e é gravado no D1.",
    badge: "Aprovado",
  },
  failure: {
    title: "Pagamento não concluído",
    description:
      "A cobrança falhou ou foi cancelada no Checkout Pro. Você pode tentar novamente quando quiser.",
    badge: "Falhou",
  },
  pending: {
    title: "Pagamento em análise",
    description:
      "O Mercado Pago ainda está processando. Quando houver novidade, o webhook atualiza o pedido.",
    badge: "Pendente",
  },
};

function firstQueryValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

async function CheckoutResultDetails({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const paymentId =
    firstQueryValue(params.payment_id) ?? firstQueryValue(params.collection_id);
  const status =
    firstQueryValue(params.status) ?? firstQueryValue(params.collection_status);
  const preferenceId = firstQueryValue(params.preference_id);
  const externalReference = firstQueryValue(params.external_reference);

  if (!paymentId && !status && !preferenceId) {
    return (
      <p className="text-muted-foreground text-sm">
        Nenhum detalhe extra veio na URL de retorno. Confira o webhook para o status no
        banco.
      </p>
    );
  }

  return (
    <dl className="grid gap-2 text-sm">
      {status ? (
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Status (retorno)</dt>
          <dd className="font-medium">{status}</dd>
        </div>
      ) : null}
      {paymentId ? (
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">ID do pagamento</dt>
          <dd className="font-mono text-xs">{paymentId}</dd>
        </div>
      ) : null}
      {preferenceId ? (
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Preferência</dt>
          <dd className="font-mono text-xs">{preferenceId}</dd>
        </div>
      ) : null}
      {externalReference ? (
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Pedido</dt>
          <dd className="font-mono text-xs">{externalReference}</dd>
        </div>
      ) : null}
    </dl>
  );
}

export function CheckoutResultPage({
  outcome,
  searchParams,
}: {
  outcome: CheckoutOutcome;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const copy = COPY[outcome];

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 items-start px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <div className="mb-2">
            <Badge variant={outcome === "success" ? "default" : "secondary"}>
              {copy.badge}
            </Badge>
          </div>
          <CardTitle>{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <p className="text-muted-foreground text-sm">Carregando detalhes...</p>
            }
          >
            <CheckoutResultDetails searchParams={searchParams} />
          </Suspense>
        </CardContent>
        <CardFooter className="gap-2">
          <Button render={<Link href="/" />}>Voltar ao início</Button>
          {outcome !== "success" ? (
            <Button variant="outline" render={<Link href="/#checkout" />}>
              Tentar de novo
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
