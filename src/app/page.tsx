import { CheckoutForm } from "@/components/checkout-form";
import { LeadForm } from "@/components/lead-form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-12">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-4">
          <Badge variant="secondary">Template para novos produtos</Badge>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance">
            Comece um SaaS no Cloudflare, com leads e Checkout Pro prontos.
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg text-pretty">
            Este repositório é um ponto de partida em português: Next.js 16, Workers,
            Drizzle no D1, shadcn/ui e Mercado Pago. Credenciais ficam em secrets — nunca
            no git.
          </p>
        </div>
        <ul className="text-muted-foreground grid gap-2 text-sm">
          <li>App Router + TypeScript estrito</li>
          <li>D1 local e remoto via Wrangler</li>
          <li>Webhook com validação HMAC da x-signature</li>
          <li>Testes com Vitest e MSW, sem credenciais reais</li>
        </ul>
      </section>

      <Separator />

      <section className="grid gap-6 lg:grid-cols-2">
        <LeadForm />
        <CheckoutForm />
      </section>
    </main>
  );
}
