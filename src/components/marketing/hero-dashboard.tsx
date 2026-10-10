import {
  IconCheck,
  IconPix,
  IconBoleto,
  IconRaio,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CHART_HEIGHTS = [38, 52, 44, 60, 48, 72, 56, 88];

export function HeroDashboardPreview() {
  return (
    <Card className="overflow-hidden border shadow-lg ring-1 ring-border/60 [--card-spacing:--spacing(5)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <div>
          <p className="font-heading text-sm font-semibold">Visão geral</p>
          <p className="text-muted-foreground text-xs">Últimos 30 dias</p>
        </div>
        <Badge className="bg-primary text-primary-foreground gap-1 border-transparent">
          <IconRaio decorative className="size-3" />
          Ao vivo
        </Badge>
      </div>
      <div className="grid gap-4 px-5 pt-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="text-muted-foreground text-xs">Receita do mês</p>
          <p className="font-heading mt-1 text-2xl font-bold tracking-tight">R$ 12.480</p>
          <p className="mt-1 text-xs font-medium text-primary">+18% vs. mês anterior</p>
        </div>
        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="text-muted-foreground text-xs">Assinantes ativos</p>
          <p className="font-heading mt-1 text-2xl font-bold tracking-tight">248</p>
          <p className="mt-1 text-xs font-medium text-primary">+32 novos</p>
        </div>
      </div>
      <div className="px-5 py-4">
        <div className="flex h-28 items-end gap-1.5">
          {CHART_HEIGHTS.map((height, index) => (
            <div
              key={index}
              className={cn(
                "flex-1 rounded-sm",
                index === CHART_HEIGHTS.length - 1 ? "bg-gold" : "bg-primary/80",
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
      <div className="border-t px-5 py-4">
        <p className="mb-3 text-xs font-medium">Pagamentos recentes</p>
        <ul className="space-y-3">
          <li className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                AS
              </span>
              <div>
                <p className="text-sm font-medium">Ana Souza</p>
                <p className="text-muted-foreground flex items-center gap-1 text-xs">
                  <IconPix decorative className="size-3.5" />
                  Pix · Plano Pro
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">R$ 97,00</p>
              <Badge variant="success" className="mt-1">
                <IconCheck decorative className="size-3" />
                Aprovado
              </Badge>
            </div>
          </li>
          <li className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                BL
              </span>
              <div>
                <p className="text-sm font-medium">Bruno Lima</p>
                <p className="text-muted-foreground flex items-center gap-1 text-xs">
                  <IconBoleto decorative className="size-3.5" />
                  Boleto · Plano Starter
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">R$ 49,00</p>
              <Badge variant="warning" className="mt-1">Pendente</Badge>
            </div>
          </li>
        </ul>
      </div>
    </Card>
  );
}
