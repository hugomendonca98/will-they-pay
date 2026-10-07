import type { OrderStatus } from "./types";

const STATUS_MAP: Record<string, OrderStatus> = {
  pending: "pending",
  authorized: "pending",
  in_process: "in_process",
  in_mediation: "in_process",
  approved: "approved",
  rejected: "rejected",
  cancelled: "cancelled",
  refunded: "refunded",
  charged_back: "refunded",
};

export function mapMercadoPagoStatus(status: string): OrderStatus {
  return STATUS_MAP[status] ?? "pending";
}
