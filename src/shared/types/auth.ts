export interface IUserPreferences {
  language?: "es" | "en";
  currency?: "PEN" | "USD" | "EUR";
  notifications?: {
    paymentReminders?: boolean;
    balanceAlerts?: boolean;
    transactionNotifications?: boolean;
    monthlySummary?: boolean;
  };
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  createdAt: Date;
  preferences?: IUserPreferences | null;
}
