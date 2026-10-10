import type { ReactNode } from "react";
import {
  IconPagamentoAprovado,
  IconPix,
  IconSetaDireita,
  IconUsuarios,
} from "@/components/icons";
import { Card } from "@/components/ui/card";
import { D1_MIGRATION_COUNT, site } from "@/content/site";
import { cn } from "@/lib/utils";

const copy = site.heroVisual;

const MIGRATION_LABEL =
  D1_MIGRATION_COUNT === 1
    ? "1 migração aplicada"
    : `${D1_MIGRATION_COUNT} migrações aplicadas`;

/** Terminal palette is fixed (not theme tokens) so commands stay readable on zinc-950 in light mode. */
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
        kind === "success" && "text-emerald-400",
        kind === "prompt" && "text-amber-300",
        kind === "command" && "text-zinc-100",
      )}
    >
      {kind === "command" || kind === "prompt" ? (
        <span className="text-emerald-500">$ </span>
      ) : (
        <span className="text-emerald-500">✓ </span>
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
        tone === "success" ? "bg-success/25" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-lg bg-background",
          tone === "success" && "text-primary",
        )}
      >
        {icon}
      </span>
      <div>
        <p className="font-heading text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground text-xs">{subtitle}</p>
      </div>
    </div>
  );
}

/**
 * Default hero illustration (terminal + validation flow).
 * Swap this component for a product screenshot when rebranding.
 */
export function HeroVisual() {
  const steps = copy.flowSteps;

  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <Card className="overflow-hidden border-0 bg-zinc-950 text-zinc-100 shadow-xl ring-1 ring-white/10">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 pb-3">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="size-2.5 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="size-2.5 rounded-full bg-[#28c840]" aria-hidden />
          <p className="mx-auto font-mono text-xs text-zinc-400">{copy.terminalTitle}</p>
        </div>
        <div className="space-y-1 px-4 py-5 sm:px-5">
          <TerminalLine>{copy.commands.clone}</TerminalLine>
          <TerminalLine>{copy.commands.installMigrate}</TerminalLine>
          <TerminalLine kind="success">
            {copy.migrationSuccessPrefix} {MIGRATION_LABEL}
          </TerminalLine>
          <TerminalLine>{copy.commands.deploy}</TerminalLine>
          <TerminalLine kind="success">{copy.commands.workerPublished}</TerminalLine>
          <TerminalLine kind="prompt">
            <span className="animate-pulse">▍</span>
          </TerminalLine>
        </div>
      </Card>

      <Card className="relative z-10 -mt-6 ml-4 border shadow-lg sm:ml-8 lg:-mt-10 lg:ml-12">
        <div className="p-5 sm:p-6">
          <h3 className="font-heading text-base font-semibold">{copy.flowTitle}</h3>
          <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <FlowStep
              title={steps.waitlist.title}
              subtitle={steps.waitlist.subtitle}
              icon={<IconUsuarios decorative className="size-5 text-foreground" />}
            />
            <IconSetaDireita
              decorative
              className="mx-auto hidden size-4 shrink-0 text-muted-foreground sm:block"
            />
            <FlowStep
              title={steps.paidReservation.title}
              subtitle={steps.paidReservation.subtitle}
              tone="success"
              icon={<IconPix decorative className="size-5" />}
            />
            <IconSetaDireita
              decorative
              className="mx-auto hidden size-4 shrink-0 text-muted-foreground sm:block"
            />
            <FlowStep
              title={steps.validated.title}
              subtitle={steps.validated.subtitle}
              tone="success"
              icon={<IconPagamentoAprovado decorative className="size-5" />}
            />
          </div>
          <p className="text-muted-foreground mt-4 text-xs">{copy.flowFooter}</p>
        </div>
      </Card>
    </div>
  );
}
