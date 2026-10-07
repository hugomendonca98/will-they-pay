import { PaymentProviderError } from "@/lib/errors";
import type {
  CreatePreferenceInput,
  MercadoPagoClient,
  MercadoPagoPayment,
  PreferenceResult,
} from "./types";

const DEFAULT_BASE_URL = "https://api.mercadopago.com";

type MercadoPagoPreferenceResponse = {
  id?: string;
  init_point?: string;
  sandbox_init_point?: string;
  message?: string;
  error?: string;
};

type MercadoPagoPaymentResponse = {
  id?: number;
  status?: string;
  status_detail?: string;
  external_reference?: string | null;
  transaction_amount?: number;
  currency_id?: string;
  message?: string;
  error?: string;
};

export type HttpMercadoPagoClientOptions = {
  accessToken: string;
  fetchImpl?: typeof fetch;
  baseUrl?: string;
};

export function createHttpMercadoPagoClient(
  options: HttpMercadoPagoClientOptions,
): MercadoPagoClient {
  const fetchImpl = options.fetchImpl ?? fetch;
  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${options.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...init?.headers,
      },
    });

    const body = (await response.json().catch(() => ({}))) as T & {
      message?: string;
      error?: string;
    };

    if (!response.ok) {
      throw new PaymentProviderError(
        body.message ?? body.error ?? `Mercado Pago request failed (${response.status})`,
        response.status >= 400 && response.status < 600 ? response.status : 502,
      );
    }

    return body;
  }

  return {
    async createPreference(input: CreatePreferenceInput): Promise<PreferenceResult> {
      const payload: Record<string, unknown> = {
        items: input.items.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          currency_id: item.currencyId,
        })),
        back_urls: {
          success: input.backUrls.success,
          failure: input.backUrls.failure,
          pending: input.backUrls.pending,
        },
        external_reference: input.externalReference,
      };

      if (input.payer) payload.payer = input.payer;
      if (input.notificationUrl) payload.notification_url = input.notificationUrl;
      if (input.autoReturn) payload.auto_return = input.autoReturn;

      const data = await request<MercadoPagoPreferenceResponse>("/checkout/preferences", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!data.id || !data.init_point) {
        throw new PaymentProviderError("Mercado Pago preference is missing checkout URL");
      }

      return {
        id: data.id,
        initPoint: data.init_point,
        sandboxInitPoint: data.sandbox_init_point ?? null,
      };
    },

    async getPayment(id: string): Promise<MercadoPagoPayment> {
      const data = await request<MercadoPagoPaymentResponse>(
        `/v1/payments/${encodeURIComponent(id)}`,
      );

      if (data.id === undefined || !data.status) {
        throw new PaymentProviderError("Mercado Pago payment payload is incomplete");
      }

      return {
        id: data.id,
        status: data.status,
        statusDetail: data.status_detail,
        externalReference: data.external_reference,
        transactionAmount: data.transaction_amount,
        currencyId: data.currency_id,
      };
    },
  };
}
