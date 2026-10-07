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
