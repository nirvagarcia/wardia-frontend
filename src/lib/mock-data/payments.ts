/**
 * Mock data for upcoming payments.
 */

import { IUpcomingPayment } from "@/types/finance";
import { createAmount } from "./helpers";

export const mockUpcomingPayments: IUpcomingPayment[] = [
  {
    id: "payment-1",
    name: "ChatGPT Plus",
    amount: createAmount(20.00, "USD"),
    dueDate: new Date("2026-03-25T00:00:00"),
    type: "subscription",
    isUrgent: true,
  },
  {
    id: "payment-2",
    name: "Spotify Premium",
    amount: createAmount(19.90),
    dueDate: new Date("2026-03-28T00:00:00"),
    type: "subscription",
    isUrgent: true,
  },
  {
    id: "payment-3",
    name: "Amazon Prime",
    amount: createAmount(39.90),
    dueDate: new Date("2026-03-30T00:00:00"),
    type: "subscription",
    isUrgent: false,
  },
  {
    id: "payment-4",
    name: "Netflix Premium",
    amount: createAmount(49.90),
    dueDate: new Date("2026-04-01T00:00:00"),
    type: "subscription",
    isUrgent: false,
  },
  {
    id: "payment-5",
    name: "Alquiler + Mantenimiento",
    amount: createAmount(2050.00),
    dueDate: new Date("2026-04-01T00:00:00"),
    type: "loan",
    isUrgent: false,
  },
  {
    id: "payment-6",
    name: "Visa BCP - Pago Mínimo",
    amount: createAmount(325.08),
    dueDate: new Date("2026-04-05T00:00:00"),
    type: "card",
    isUrgent: false,
  },
];
