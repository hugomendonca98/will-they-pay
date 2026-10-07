import { http, HttpResponse } from "msw";

export const mercadoPagoHandlers = [
  http.post("https://api.mercadopago.com/checkout/preferences", async ({ request }) => {
    const body = (await request.json()) as {
      external_reference?: string;
      items?: Array<{ title?: string }>;
    };

    return HttpResponse.json({
      id: "pref-test-1",
      init_point:
        "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=pref-test-1",
      sandbox_init_point:
        "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=pref-test-1",
      external_reference: body.external_reference,
      items: body.items,
    });
  }),

  http.get("https://api.mercadopago.com/v1/payments/:id", ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
      status: "approved",
      status_detail: "accredited",
      external_reference: "order-1",
      transaction_amount: 10,
      currency_id: "BRL",
    });
  }),
];
