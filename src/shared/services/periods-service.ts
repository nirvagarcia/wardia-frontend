export interface IBillingPeriodClient {
  id: string;
  label: string;
  startDate: string; // ISO string
  endDate: string | null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error((json as { error?: string }).error ?? `Request failed: ${response.status}`);
  }
  return response.json().then((j: { data: T }) => j.data);
}

export const periodsService = {
  async getCurrentPeriod(): Promise<IBillingPeriodClient> {
    const res = await fetch("/api/transactions/periods/current");
    return handleResponse<IBillingPeriodClient>(res);
  },

  async getPeriods(): Promise<IBillingPeriodClient[]> {
    const res = await fetch("/api/transactions/periods");
    return handleResponse<IBillingPeriodClient[]>(res);
  },

  async startNewPeriod(data: {
    paymentDate: string;
    label: string;
  }): Promise<IBillingPeriodClient> {
    const res = await fetch("/api/transactions/periods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<IBillingPeriodClient>(res);
  },
};
