export const ORDER_STATUSES = [
  "pending",
  "in_process",
  "approved",
  "rejected",
  "cancelled",
  "refunded",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type CreatePreferenceItem = {
  title: string;
  quantity: number;
  unitPrice: number;
  currencyId: string;
};

export type CreatePreferenceInput = {
  items: CreatePreferenceItem[];
  payer?: {
    email?: string;
    name?: string;
  };
  backUrls: {
    success: string;
    failure: string;
    pending: string;
  };
  notificationUrl?: string;
  externalReference: string;
  autoReturn?: "approved";
};

export type PreferenceResult = {
  id: string;
  initPoint: string;
  sandboxInitPoint: string | null;
};

export type MercadoPagoPayment = {
  id: number;
  status: string;
  statusDetail?: string;
  externalReference?: string | null;
  transactionAmount?: number;
  currencyId?: string;
};

export type MercadoPagoClient = {
  createPreference(input: CreatePreferenceInput): Promise<PreferenceResult>;
  getPayment(id: string): Promise<MercadoPagoPayment>;
};

export type WebhookNotification = {
  type?: string;
  action?: string;
  data?: { id?: string };
};

export const DEMO_PRODUCT = {
  title: "Plano Starter",
  quantity: 1,
  unitPrice: 10,
  currencyId: "BRL",
} as const;

export type SubscriptionPlanId = "starter" | "pro" | "business";

export const SUBSCRIPTION_PLANS: Record<
  SubscriptionPlanId,
  {
    id: SubscriptionPlanId;
    name: string;
    priceLabel: string;
    unitPrice: number;
    currencyId: string;
    title: string;
    features: string[];
    highlighted?: boolean;
  }
> = {
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
      "Atualizações do template",
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
      "Consultoria de implementação",
    ],
  },
};

export function resolveCheckoutItem(planId: string | undefined) {
  if (planId && planId in SUBSCRIPTION_PLANS) {
    const plan = SUBSCRIPTION_PLANS[planId as SubscriptionPlanId];
    return {
      title: plan.title,
      quantity: 1,
      unitPrice: plan.unitPrice,
      currencyId: plan.currencyId,
    };
  }
  return { ...DEMO_PRODUCT };
}
