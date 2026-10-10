import type { ReactNode } from "react";
import {
  IconCartao,
  IconPagamentoAprovado,
  IconPix,
  IconSetaDireita,
} from "@/components/icons";
import { Card } from "@/components/ui/card";
import { D1_MIGRATION_COUNT } from "@/lib/site";
import { cn } from "@/lib/utils";

const MIGRATION_LABEL =
  D1_MIGRATION_COUNT === 1
    ? "1 migração aplicada"
    : `${D1_MIGRATION_COUNT} migrações aplicadas`;

function TerminalLine({
  kind = "command",
  children,
}: {
  kind?: "command" | "success" | "prompt";
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[13px] leading-relaxed sm:text-sm",
        kind === "success" && "text-success-foreground",
        kind === "prompt" && "text-gold",
        kind === "command" && "text-foreground",
      )}
    >
      {kind === "command" || kind === "prompt" ? (
        <span className="text-primary">$ </span>
      ) : (
        <span className="text-primary">✓ </span>
      )}
      {children}
    </p>
  );
}

function FlowStep({
  title,
  subtitle,
  icon,
  tone = "muted",
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  tone?: "muted" | "success";
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-3 rounded-xl p-4",
        tone === "success" ? "bg-success/80 text-success-foreground" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-lg",
          tone === "success" ? "bg-background/40" : "bg-background",
        )}
      >
        {icon}
      </span>
      <div>
        <p className="font-heading text-sm font-semibold">{title}</p>
        <p
          className={cn(
            "text-xs",
            tone === "success" ? "text-success-foreground/80" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export function HeroTemplateShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <Card
        className="overflow-hidden border-0 bg-zinc-950 text-zinc-50 shadow-xl ring-1 ring-white/10"
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="size-2.5 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="size-2.5 rounded-full bg-[#28c840]" aria-hidden />
          <p className="mx-auto font-mono text-xs text-zinc-400">~/meu-saas</p>
        </div>
        <div className="space-y-1 px-4 py-5 sm:px-5">
          <TerminalLine>git clone will-they-pay meu-saas</TerminalLine>
          <TerminalLine>pnpm install && pnpm db:migrate</TerminalLine>
          <TerminalLine kind="success">D1: {MIGRATION_LABEL}</TerminalLine>
          <TerminalLine>pnpm deploy</TerminalLine>
          <TerminalLine kind="success">
            Worker publicado em meu-saas.workers.dev
          </TerminalLine>
          <TerminalLine kind="prompt">
            <span className="animate-pulse">▍</span>
          </TerminalLine>
        </div>
      </Card>

      <Card className="relative z-10 -mt-6 ml-4 border shadow-lg sm:ml-8 lg:-mt-10 lg:ml-12">
        <div className="p-5 sm:p-6">
          <h3 className="font-heading text-base font-semibold">
            Fluxo de pagamento incluso
          </h3>
          <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <FlowStep
              title="Checkout"
              subtitle="Plano Pro · R$ 97"
              icon={<IconCartao decorative className="size-5 text-foreground" />}
            />
            <IconSetaDireita
              decorative
              className="mx-auto hidden size-4 shrink-0 text-muted-foreground sm:block"
            />
            <FlowStep
              title="Pix"
              subtitle="QR Code gerado"
              tone="success"
              icon={<IconPix decorative className="size-5" />}
            />
            <IconSetaDireita
              decorative
              className="mx-auto hidden size-4 shrink-0 text-muted-foreground sm:block"
            />
            <FlowStep
              title="Aprovado"
              subtitle="Webhook recebido"
              tone="success"
              icon={<IconPagamentoAprovado decorative className="size-5" />}
            />
          </div>
          <p className="text-muted-foreground mt-4 text-xs">
            Páginas de sucesso, pendente e falha já vêm prontas.
          </p>
        </div>
      </Card>
    </div>
  );
}
