import { create } from "zustand";
import type { ISubscription } from "@/shared/types/finance";
import { servicesService } from "@/shared/services/services-service";

interface ServicesState {
  services: ISubscription[];
  isLoading: boolean;
  error: string | null;

  setServices: (services: ISubscription[]) => void;
  reorderServices: (services: ISubscription[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  addService: (service: Omit<ISubscription, "id">) => Promise<void>;
  updateService: (id: string, service: Omit<ISubscription, "id">) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  getMonthlyTotal: () => number;
  getActiveServices: () => ISubscription[];
  getUpcomingPayments: (daysAhead?: number) => ISubscription[];
  getServicesByCategory: (category: string) => ISubscription[];
}

export const useServicesStore = create<ServicesState>()((set, get) => ({
  services: [],
  isLoading: false,
  error: null,

  setServices: (services) => set({ services, error: null }),
  reorderServices: (services) => set({ services }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),

  addService: async (serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const created = await servicesService.createService(serviceData);
      set((state) => ({ services: [...state.services, created], isLoading: false }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to add service", isLoading: false });
      throw err;
    }
  },

  updateService: async (id, serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await servicesService.updateService(id, serviceData);
      set((state) => ({
        services: state.services.map((s) => (s.id === id ? updated : s)),
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to update service", isLoading: false });
      throw err;
    }
  },

  deleteService: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await servicesService.deleteService(id);
      set((state) => ({
        services: state.services.filter((s) => s.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to delete service", isLoading: false });
      throw err;
    }
  },

  getMonthlyTotal: () => {
    const { services } = get();
    return services
      .filter((s) => s.status === "active")
      .reduce((sum, s) => {
        const monthly =
          s.frequency === "yearly" ? s.amount.value / 12 :
          s.frequency === "weekly" ? s.amount.value * 4.33 :
          s.frequency === "quarterly" ? s.amount.value / 3 :
          s.amount.value;
        return sum + monthly;
      }, 0);
  },

  getActiveServices: () => get().services.filter((s) => s.status === "active"),

  getUpcomingPayments: (daysAhead = 7) => {
    const today = new Date();
    const limit = new Date();
    limit.setDate(today.getDate() + daysAhead);
    return get()
      .services.filter((s) => s.status === "active")
      .filter((s) => s.nextPaymentDate >= today && s.nextPaymentDate <= limit)
      .sort((a, b) => a.nextPaymentDate.getTime() - b.nextPaymentDate.getTime());
  },

  getServicesByCategory: (category) => get().services.filter((s) => s.category === category),
}));
