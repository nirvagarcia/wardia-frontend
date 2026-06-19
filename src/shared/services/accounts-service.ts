import type { IAccount, ICreditCard } from "@/shared/types/finance";

export const accountsService = {
  async getAccounts(): Promise<IAccount[]> {
    return [];
  },

  async getCreditCards(): Promise<ICreditCard[]> {
    return [];
  },
};
