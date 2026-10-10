import Link from "next/link";
import {
  ArrowRight,
  Check,
  CreditCard,
  MessageCircle,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { HeroDashboardPreview } from "@/components/marketing/hero-dashboard";
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
const FEATURES = [
  {
    icon: CreditCard,
    title: "Pagamentos integrados",
    description:
      "Checkout pronto para Pix, cartão e boleto. Webhook com validação de assinatura e pedidos no D1.",
  },
  {
    icon: Users,
    title: "Captura de leads",
    description:
      "Formulário validado no servidor, persistência no D1 e mensagens de sucesso pensadas para conversão.",
  },
  {
    icon: Shield,
    title: "Pronto para produção",
    description:
      "Next.js 16, Workers, Drizzle e testes com Vitest. Credenciais em secrets — nunca no repositório.",
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "Como funciona o pagamento?",
    answer:
      "Ao assinar, você é redirecionado ao checkout seguro. Após o pagamento, retornamos para páginas de sucesso, pendência ou falha e o webhook atualiza o status no D1.",
  },
  {
    question: "Posso pagar com Pix ou boleto?",
    answer:
      "Sim. Aceitamos Pix, cartão de crédito em até 12x e boleto bancário, conforme disponibilidade no gateway configurado.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer:
      "Sim. Não há fidelidade neste template — adapte a política de cancelamento ao seu produto real.",
  },
  {
    question: "Vocês emitem nota fiscal?",
    answer:
      "Este é um template de demonstração. Configure emissão de NF-e ou NFS-e conforme o regime da sua empresa.",
  },
] as const;

export function HeroSection() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
      <div className="space-y-6">
        <Badge variant="gold" className="h-7 gap-1.5 px-3 py-1 text-xs font-semibold">
          <Sparkles className="size-3.5" />
          Template SaaS pronto para o Brasil
        </Badge>
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
          Seu produto resolve X em minutos, não em semanas
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg text-pretty">
          Descreva aqui a principal dor do seu cliente e como o seu SaaS a elimina.
          Substitua este texto pela proposta de valor do seu produto em uma ou duas
          frases.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button size="lg" className="h-11 px-5" render={<Link href="/#precos" />}>
            Começar agora
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 px-5"
            render={<Link href="/#recursos" />}
          >
            Ver demonstração
          </Button>
        </div>
        <ul className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-6">
          {["Pix, cartão e boleto", "Sem fidelidade", "Pronto em 5 min"].map((item) => (
            <li key={item} className="inline-flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-success text-success-foreground">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <HeroDashboardPreview />
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section id="recursos" className="border-t bg-muted/30 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-xs font-semibold tracking-widest uppercase">
            Recursos
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Tudo o que você precisa para começar a vender
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty">
            Stack moderna, integrações brasileiras e componentes prontos para você
            focar no produto.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="h-full border bg-card shadow-sm">
              <CardHeader>
                <span className="mb-2 flex size-11 items-center justify-center rounded-lg bg-success/80 text-success-foreground">
                  <feature.icon className="size-5" />
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
            Preços
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Planos simples, sem surpresas
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty">
            Escolha o plano ideal e assine em poucos cliques. Valores de exemplo para o
            template.
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
            Ainda com dúvidas? Fale com a gente
          </h2>
          <p className="text-muted-foreground text-pretty">
            Use o formulário para capturar leads reais. Os dados são validados no
            servidor e salvos no D1.
          </p>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageCircle className="size-5" />
              </span>
              <div>
                <p className="font-medium">Resposta em até 1 dia útil</p>
                <p className="text-muted-foreground text-sm">
                  Horário comercial, em português.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Shield className="size-5" />
              </span>
              <div>
                <p className="font-medium">Seus dados protegidos</p>
                <p className="text-muted-foreground text-sm">
                  Boas práticas de LGPD no template.
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
            Respostas rápidas sobre pagamentos e o template.
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
