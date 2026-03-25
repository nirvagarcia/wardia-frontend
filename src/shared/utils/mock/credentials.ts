/**
 * Mock data for bank credentials.
 */

import { IBankCredentials } from "@/shared/types/finance";

export const mockBankCredentials: IBankCredentials[] = [
  {
    id: "cred-1",
    bankName: "Banco de Crédito del Perú (BCP)",
    username: "nirvana.garcia",
    password: "MySecurePass123!",
    digitalKey: "456789",
    securityToken: "TOKEN-BCP-2026",
    notes: "Usar clave digital para transferencias mayores a S/ 5,000",
    lastUpdated: new Date("2026-03-15T10:00:00"),
  },
  {
    id: "cred-2",
    bankName: "Interbank",
    username: "ngarcia@email.com",
    password: "Inter@Secure2026",
    digitalKey: "789012",
    lastUpdated: new Date("2026-02-28T14:30:00"),
  },
  {
    id: "cred-3",
    bankName: "BBVA Perú",
    username: "nirvana_garcia",
    password: "BBVA#Strong99",
    securityToken: "BBVA-TOKEN-XYZ",
    notes: "Recordar cambiar contraseña cada 90 días",
    lastUpdated: new Date("2026-03-01T09:20:00"),
  },
];
