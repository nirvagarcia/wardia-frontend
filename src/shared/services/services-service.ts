import type { ISubscription } from "@/shared/types/finance";

interface ServiceRecord {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  iconUrl?: string | null;
  amountValue: number;
  amountCurrency: string;
  frequency: string;
  nextPaymentDate: string;
  status: string;
  autoRenewal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesMeta {
  total: number;
  activeCount: number;
  totalMonthlyCost: number;
}

function toSubscription(r: ServiceRecord): ISubscription {
  return {
    id: r.id,
    name: r.name,
    description: r.description ?? undefined,
    category: r.category,
    iconUrl: r.iconUrl ?? undefined,
    amount: {
      value: r.amountValue,
      currency: r.amountCurrency as "PEN" | "USD" | "EUR",
    },
    frequency: r.frequency as ISubscription["frequency"],
    nextPaymentDate: new Date(r.nextPaymentDate),
    status: r.status as ISubscription["status"],
    autoRenewal: r.autoRenewal,
  };
}

function toPayload(service: Omit<ISubscription, "id">) {
  return {
    name: service.name,
    description: service.description,
    category: service.category,
    iconUrl: service.iconUrl,
    amountValue: service.amount.value,
    amountCurrency: service.amount.currency,
    frequency: service.frequency,
    nextPaymentDate: service.nextPaymentDate.toISOString(),
    status: service.status,
    autoRenewal: service.autoRenewal,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error((json as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json().then((j: { data: T }) => j.data);
}

export const servicesService = {
  async getServices(): Promise<{ services: ISubscription[]; meta: ServicesMeta }> {
    const res = await fetch("/api/services");
    const data = await handleResponse<{ services: ServiceRecord[]; meta: ServicesMeta }>(res);
    return {
      services: data.services.map(toSubscription),
      meta: data.meta,
    };
  },

  async createService(service: Omit<ISubscription, "id">): Promise<ISubscription> {
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(service)),
    });
    const record = await handleResponse<ServiceRecord>(res);
    return toSubscription(record);
  },

  async updateService(id: string, service: Omit<ISubscription, "id">): Promise<ISubscription> {
    const res = await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(service)),
    });
    const record = await handleResponse<ServiceRecord>(res);
    return toSubscription(record);
  },

  async deleteService(id: string): Promise<void> {
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error((json as { error?: string }).error ?? "Failed to delete service");
    }
  },
};
