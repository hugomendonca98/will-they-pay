/**
 * All user-facing marketing copy and example checkout plans.
 * Rebrand by editing this file (+ globals.css tokens + public/brand).
 */

export const site = {
  name: "Will They Pay",
  repoUrl: "https://github.com/hugomendonca98/will-they-pay",
  issuesUrl: "https://github.com/hugomendonca98/will-they-pay/issues",

  brand: {
    logoLight: "/brand/logo-mark-color.svg",
    logoDark: "/brand/logo-mark-color-dark.svg",
  },

  metadata: {
    title: "Will They Pay | Valide sua ideia de SaaS com lista de espera e pré-venda",
    description:
      "Template open source de lista de espera e pré-venda para testar se as pessoas pagam pelo seu SaaS antes de construir. Next.js na Cloudflare, com Pix, cartão e boleto pelo Mercado Pago.",
  },

  header: {
    checkoutBack: "Voltar ao site",
    menuTitle: "Menu",
    menuOpenLabel: "Abrir menu",
  },

  nav: [
    { href: "/#recursos", label: "O que vem pronto" },
    { href: "/#precos", label: "Checkout" },
    { href: "/#faq", label: "FAQ" },
    { href: "/#contato", label: "Contato" },
  ],

  headerCta: { label: "Ver no GitHub", href: "repoUrl" as const },

  demoBanner: {
    desktop:
      "Demo: os pagamentos são de teste e nada é cobrado. Use um e-mail que não seja o seu.",
    mobile: "Demo: pagamentos de teste, nada é cobrado.",
    linkLabel: "Ver no GitHub",
  },

  hero: {
    badge: "Open source · Lista de espera + pré-venda",
    title: "Descubra se vão pagar pelo seu SaaS antes de construir",
    titleHighlight: "pagar",
    subtitle:
      "Um template open source de lista de espera e pré-venda. Publique a página da sua ideia, junte interessados e aceite reservas pagas em Pix, cartão ou boleto. Se ninguém pagar, você economizou meses.",
    primaryCta: { label: "Ver no GitHub", href: "repoUrl" as const },
    secondaryCta: { label: "Testar uma reserva", href: "/#precos" },
    stackLabel: "Vem com",
    stackChips: [
      "Next.js 16",
      "Cloudflare Workers",
      "D1",
      "Mercado Pago",
      "Tailwind + shadcn",
    ],
    highlights: [
      "Lista de espera com captura de e-mails",
      "Reservas pagas pelo Mercado Pago",
      "Deploy na Cloudflare Workers",
    ],
    editHint: "Todos os textos desta página ficam em src/content/site.ts.",
  },

  heroVisual: {
    terminalTitle: "~/meu-saas",
    commands: {
      clone: "git clone will-they-pay meu-saas",
      installMigrate: "pnpm install && pnpm run db:migrate",
      deploy: "pnpm run deploy",
      workerPublished: "Worker publicado em meu-saas.workers.dev",
    },
    migrationSuccessPrefix: "D1:",
    flowTitle: "Fluxo de validação incluso",
    flowSteps: {
      waitlist: { title: "Lista de espera", subtitle: "128 interessados" },
      paidReservation: { title: "Reserva paga", subtitle: "23 reservas em Pix" },
      validated: { title: "Ideia validada", subtitle: "18% pagaram" },
    },
    flowFooter: "Números de exemplo, só pra ilustrar o fluxo.",
  },

  features: {
    sectionId: "recursos",
    eyebrow: "O que vem pronto",
    title: "A parte chata já está feita",
    subtitle:
      "Pagamento, banco, leads e deploy configurados. Sobra o que só você sabe fazer: o produto.",
    items: [
      {
        icon: "cartao",
        title: "Checkout com Pix, cartão e boleto",
        description:
          "Checkout Pro do Mercado Pago com webhook que valida a assinatura e grava o status do pedido no D1.",
      },
      {
        icon: "usuarios",
        title: "Captura de leads",
        description:
          "Formulário validado no servidor e salvo no D1. É o mesmo que está no fim desta página.",
      },
      {
        icon: "escudo",
        title: "Pronto pra produção",
        description:
          "Next.js 16 em Workers, Drizzle e testes com Vitest. Credenciais ficam em secrets, nunca no repositório.",
      },
    ],
  },

  pricing: {
    sectionId: "precos",
    eyebrow: "Checkout",
    demoBadge: "Demonstração",
    title: "Planos de exemplo",
    subtitle:
      "Esses planos não existem: estão aqui pra você ver o checkout funcionando. Clique em assinar e siga o fluxo até a página de retorno.",
    cta: "Assinar agora",
    footnote: "Pagamento seguro com Pix, cartão de crédito ou boleto.",
    dialog: {
      title: (planName: string) => `Assinar plano ${planName} (exemplo)`,
      description: (priceLabel: string) =>
        `Informe seus dados para continuar com o pagamento de demonstração (${priceLabel}/mês).`,
      submitIdle: "Continuar para pagamento",
      submitPending: "Redirecionando...",
      errorTitle: "Não foi possível ir ao pagamento",
      nameLabel: "Nome",
      namePlaceholder: "Seu nome completo",
      emailLabel: "E-mail",
      emailPlaceholder: "voce@empresa.com",
    },
    plans: {
      starter: {
        id: "starter",
        name: "Starter",
        priceLabel: "R$ 49",
        unitPrice: 49,
        currencyId: "BRL",
        title: "Plano Starter (mensal)",
        features: [
          "Até 100 leads por mês",
          "Checkout integrado",
          "Suporte por e-mail",
          "Relatórios básicos",
        ],
      },
      pro: {
        id: "pro",
        name: "Pro",
        priceLabel: "R$ 97",
        unitPrice: 97,
        currencyId: "BRL",
        title: "Plano Pro (mensal)",
        highlighted: true,
        highlightLabel: "Exemplo em destaque",
        features: [
          "Tudo do Starter",
          "Leads ilimitados",
          "Webhooks personalizados",
          "Prioridade no suporte",
        ],
      },
      business: {
        id: "business",
        name: "Business",
        priceLabel: "R$ 197",
        unitPrice: 197,
        currencyId: "BRL",
        title: "Plano Business (mensal)",
        features: [
          "Tudo do Pro",
          "Múltiplos produtos",
          "SLA de suporte",
          "Onboarding assistido",
        ],
      },
    },
  },

  contact: {
    sectionId: "contato",
    eyebrow: "Contato",
    title: "Dúvidas ou sugestões?",
    subtitle:
      "Esse formulário também vem no template: valida os dados no servidor e salva cada lead no D1. Achou um bug? Abra uma issue no GitHub.",
    issuesLinkLabel: "Abrir issues no GitHub",
    points: [
      { icon: "suporte", title: "Fala com a gente", text: "Em português." },
      {
        icon: "escudo",
        title: "Seus dados protegidos",
        text: "Os leads ficam no seu próprio banco, não em ferramenta de terceiros.",
      },
    ],
    form: {
      title: "Envie uma mensagem",
      description: "Preencha os campos abaixo. Leva menos de 1 minuto.",
      successTitle: "Mensagem enviada",
      errorTitle: "Não foi possível enviar",
      nameLabel: "Nome",
      namePlaceholder: "Seu nome completo",
      emailLabel: "E-mail",
      emailPlaceholder: "voce@empresa.com",
      phoneLabel: "WhatsApp (opcional)",
      phonePlaceholder: "(11) 99999-0000",
      messageLabel: "Mensagem",
      messagePlaceholder: "Conte um pouco sobre o que você precisa...",
      submitIdle: "Enviar mensagem",
      submitPending: "Enviando...",
      privacyNote:
        "Ao enviar, você concorda com nossa política de privacidade. Não compartilhamos seus dados com terceiros.",
    },
  },

  faq: {
    sectionId: "faq",
    title: "Perguntas frequentes",
    subtitle: "Sobre o template e como adaptar pro seu produto.",
    items: [
      {
        question: "O que é o Will They Pay?",
        answer:
          "Um template open source de SaaS em Next.js pra quem quer lançar produto no Brasil. Vem com checkout do Mercado Pago, banco D1, formulário de leads, páginas de retorno do pagamento e testes, rodando na Cloudflare.",
      },
      {
        question: "É de graça?",
        answer:
          "Sim. O código é aberto no GitHub sob a licença MIT: você pode usar, modificar e lançar produtos com ele, inclusive pagos. Só paga o que usar na Cloudflare e as taxas do Mercado Pago.",
      },
      {
        question: "Como troco os textos e a marca?",
        answer:
          "Os textos ficam em src/content/site.ts e as cores em src/app/globals.css. O passo a passo está no README.",
      },
      {
        question: "Como funciona o pagamento?",
        answer:
          "O cliente vai pro Checkout Pro do Mercado Pago e volta pra uma página de sucesso, pendência ou falha. O webhook atualiza o status do pedido no D1.",
      },
      {
        question: "Ele emite nota fiscal?",
        answer:
          "Não. A emissão de NF-e ou NFS-e depende do regime da sua empresa e fica por sua conta.",
      },
    ],
  },

  footer: {
    description:
      "Template open source de SaaS em Next.js e Cloudflare, com Pix, cartão e boleto pelo Mercado Pago.",
    navHeading: "Navegação",
    githubLink: "Código no GitHub",
    copyright: "© 2026 Will They Pay. Código aberto no GitHub.",
    checkout: {
      secure: "Pagamento seguro",
      terms: "Termos",
      privacy: "Privacidade",
      support: "Suporte",
    },
    securePayments: "Pagamentos processados com segurança",
  },

  checkoutResult: {
    success: {
      title: "Pagamento aprovado",
      description:
        "Obrigado por testar o fluxo! Este é o retorno de sucesso do template — em produção, você liberaria o acesso ou enviaria o recibo por e-mail.",
      hint: "Não recebeu o e-mail? Verifique a caixa de spam ou ajuste o fluxo no seu produto.",
      primaryCta: { label: "Ver no GitHub", href: "repoUrl" as const },
      secondaryCta: { label: "Voltar para o início", href: "/" },
    },
    pending: {
      title: "Pagamento em análise",
      description:
        "Recebemos o pedido de demonstração e aguardamos a confirmação do pagamento.",
      alertTitle: "Pix ou boleto podem levar um tempo",
      alertDescription:
        "Pagamentos via Pix costumam ser confirmados em poucos minutos. Boletos são compensados em até 3 dias úteis. O webhook atualiza o pedido quando houver confirmação.",
      hint: "Você não precisa pagar novamente. Guarde o ID do pagamento para consultas.",
      primaryCta: { label: "Voltar para o início", href: "/" },
    },
    failure: {
      title: "Pagamento não aprovado",
      description:
        "Não conseguimos concluir o pagamento de demonstração. Nenhum valor foi cobrado — você pode tentar novamente.",
      reasonsTitle: "Possíveis motivos",
      reasons: [
        "Saldo ou limite do cartão insuficiente",
        "Dados do cartão digitados incorretamente",
        "Pagamento recusado pelo banco emissor",
        "Tempo para concluir o pagamento expirou",
      ],
      hint: "Dica: tente outro cartão ou pague com Pix para aprovação imediata.",
      primaryCta: { label: "Tentar novamente", href: "/#precos" },
      secondaryCta: { label: "Abrir issue no GitHub", href: "issuesUrl" as const },
    },
    summary: {
      planLabel: "Plano",
      amountLabel: "Valor",
      methodLabel: "Forma de pagamento",
      paymentIdLabel: "ID do pagamento",
      statusLabel: "Status",
      demoPlan: "Pro (mensal)",
      demoAmount: "R$ 97,00",
      methods: {
        success: "Pix",
        pending: "Boleto bancário",
        failure: "Cartão",
      },
      statusApproved: "Aprovado",
      statusPending: "Em análise",
      statusRejected: "Recusado",
    },
  },
} as const;

export type SiteHrefKey = "repoUrl" | "issuesUrl";

export function resolveSiteHref(href: string): string {
  if (href === "repoUrl") return site.repoUrl;
  if (href === "issuesUrl") return site.issuesUrl;
  return href;
}

export type SubscriptionPlanId = keyof typeof site.pricing.plans;

export const subscriptionPlans = Object.values(site.pricing.plans);

export function getSubscriptionPlan(id: string | undefined) {
  if (id && id in site.pricing.plans) {
    return site.pricing.plans[id as SubscriptionPlanId];
  }
  return undefined;
}

/** SQL migrations in `drizzle/` — update when adding migrations. */
export const D1_MIGRATION_COUNT = 1;
