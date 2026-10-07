import { describe, expect, it } from "vitest";
import { mapMercadoPagoStatus } from "./status";

describe("mapMercadoPagoStatus", () => {
  it("maps known Mercado Pago statuses onto order statuses", () => {
    expect(mapMercadoPagoStatus("approved")).toBe("approved");
    expect(mapMercadoPagoStatus("in_process")).toBe("in_process");
    expect(mapMercadoPagoStatus("charged_back")).toBe("refunded");
  });

  it("falls back to pending for unknown values", () => {
    expect(mapMercadoPagoStatus("something_new")).toBe("pending");
  });
});
