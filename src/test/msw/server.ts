import { setupServer } from "msw/node";
import { mercadoPagoHandlers } from "./handlers";

export const server = setupServer(...mercadoPagoHandlers);
