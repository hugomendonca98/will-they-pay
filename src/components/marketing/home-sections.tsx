import Link from "next/link";
import type { ComponentType } from "react";
import {
  IconCartao,
  IconCheck,
  IconEscudo,
  IconSetaDireita,
  IconSuporte,
  IconUsuarios,
  type WtpIconProps,
} from "@/components/icons";
import { HeroTemplateShowcase } from "@/components/marketing/hero-template-showcase";
import { LeadForm } from "@/components/lead-form";
import { PricingCards } from "@/components/pricing-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TEMPLATE_GITHUB_URL } from "@/lib/site";

const STACK_CHIPS = [
  "Next.js 16",
  "Cloudflare Workers",
  "D1",
  "Mercado Pago",
  "Tailwind + shadcn",
] as const;

const HERO_CHECKLIST = [
  "Pix, cartão e boleto pelo Mercado Pago",
  "Deploy na Cloudflare Workers",
  "Testes com Vitest",
] as const;

const FEATURES: {
  icon: ComponentType<WtpIconProps>;
  title: string;
  description: string;
}[] = [
  {
    icon: IconCartao,
    title: "Checkout com Pix, cartão e boleto",
    description:
      "Checkout Pro do Mercado Pago integrado, com webhook que valida a assinatura e grava o status do pedido no D1.",
  },
  {
    icon: IconUsuarios,
    title: "Captura de leads",
    description:
      "Formulário validado no servidor e salvo no D1. É o mesmo que está no fim desta página.",
  },
  {
    icon: IconEscudo,
    title: "Pronto pra produção na Cloudflare",
    description:
      "Next.js 16 em Workers, Drizzle e testes com Vitest. As credenciais ficam em secrets, nunca no repositório.",
  },
];

const FAQ_ITEMS = [
  {
    question: "O que é o Will They Pay?",
    answer:
      "Um template de SaaS em Next.js pra quem quer lançar produto no Brasil. Ele já vem com checkout do Mercado Pago, banco D1, formulário de leads, páginas de retorno do pagamento e testes, tudo rodando na Cloudflare.",
  },
  {
    question: "O que eu preciso fazer depois de clonar?",
    answer:
      "Configurar suas credenciais do Mercado Pago e da Cloudflare como secrets, trocar textos, cores e planos, e fazer o deploy com pnpm deploy.",
  },
  {
    question: "Como funciona o pagamento?",
    answer:
      "Ao assinar, você é redirecionado ao checkout seguro. Após o pagamento, retornamos para páginas de sucesso, pendência ou falha e o webhook atualiza o status no D1.",
  },
  {
    question: "Ele emite nota fiscal?",
    answer:
      "Não. A emissão de NF-e ou NFS-e depende do regime da sua empresa e fica por sua conta.",
  },
] as const;

export function HeroSection() {
  return (
    <section
      className="relative border-b bg-[radial-gradient(ellipse_85%_60%_at_75%_0%,color-mix(in_oklch,var(--success),transparent_72%),transparent)] dark:bg-[radial-gradient(ellipse_85%_60%_at_75%_0%,color-mix(in_oklch,var(--success),transparent_88%),transparent)]"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-20">
        <div className="space-y-6">
          <Badge variant="gold" className="h-7 px-3 py-1 text-xs font-semibold">
            Template Next.js + Cloudflare para o Brasil
          </Badge>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            O template de SaaS que já nasce cobrando em{" "}
            <span className="text-primary">Pix</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg text-pretty">
            Next.js 16 rodando na Cloudflare, banco D1, checkout do Mercado Pago com
            Pix, cartão e boleto, formulário de leads e testes. Você clona, troca os
            textos e começa a vender.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              size="lg"
              className="h-11 px-5"
              render={
                <a
                  href={TEMPLATE_GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Usar o template
              <IconSetaDireita decorative className="size-4" data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-5"
              render={<Link href="/#precos" />}
            >
              Testar o checkout
            </Button>
          </div>
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Vem com
            </p>
            <ul className="flex flex-wrap gap-2">
              {STACK_CHIPS.map((chip) => (
                <li
                  key={chip}
                  className="rounded-lg border bg-card px-3 py-1.5 text-xs font-semibold shadow-sm"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>
          <ul className="flex flex-col gap-2 text-sm sm:gap-y-2">
            {HERO_CHECKLIST.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-success text-success-foreground">
                  <IconCheck decorative className="size-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <HeroTemplateShowcase />
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section id="recursos" className="border-t bg-muted/30 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-xs font-semibold tracking-widest uppercase">
            O que vem pronto
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            A parte chata já está feita
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty">
            Pagamento, banco, leads e deploy configurados. Sobra o que só você sabe
            fazer: o produto.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="h-full border bg-card shadow-sm">
              <CardHeader>
                <span className="mb-2 flex size-11 items-center justify-center rounded-lg bg-success/80 text-success-foreground">
                  <feature.icon decorative className="size-5" />
                </span>
                <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm text-pretty">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section id="precos" className="py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-xs font-semibold tracking-widest uppercase">
            Checkout
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Teste o fluxo de pagamento
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty">
            Estes planos são exemplos. Clique em assinar pra ver o caminho completo:
            checkout do Mercado Pago, página de retorno e webhook atualizando o pedido.
          </p>
        </div>
        <PricingCards />
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contato" className="border-t bg-muted/30 py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="space-y-6">
          <p className="text-primary text-xs font-semibold tracking-widest uppercase">
            Contato
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Dúvidas sobre o template?
          </h2>
          <p className="text-muted-foreground text-pretty">
            Manda uma mensagem. Esse formulário também vem no template: valida os dados
            no servidor e salva cada lead no D1.
          </p>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconSuporte decorative className="size-5" />
              </span>
              <div>
                <p className="font-medium">Respondemos em português</p>
                <p className="text-muted-foreground text-sm">
                  Mensagens sobre o template e integrações.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconEscudo decorative className="size-5" />
              </span>
              <div>
                <p className="font-medium">Seus dados protegidos</p>
                <p className="text-muted-foreground text-sm">
                  Formulário com aviso de privacidade e dados guardados no seu próprio
                  banco.
                </p>
              </div>
            </li>
          </ul>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="py-20 lg:py-24">
      <div className="mx-auto w-full max-w-3xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-primary text-xs font-semibold tracking-widest uppercase">
            FAQ
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty">
            O que você precisa saber antes de clonar o repositório.
          </p>
        </div>
        <Accordion defaultValue={["item-0"]} className="mt-10 w-full">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger className="text-base font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
