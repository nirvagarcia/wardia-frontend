/**
 * Services Store - Manages subscriptions and recurring services state.
 * Centralized store for all service-related data across the application.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ISubscription } from "@/shared/types/finance";

/**
 * Custom storage with date deserialization
 */
const customStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    
    try {
      const parsed = JSON.parse(str);
      const { state } = parsed;
      
      // Convert date strings back to Date objects
      if (state.services && Array.isArray(state.services)) {
        state.services = state.services.map((service: ISubscription) => ({
          ...service,
          nextPaymentDate: service.nextPaymentDate ? new Date(service.nextPaymentDate) : new Date(),
        }));
      }
      
      return { state, version: parsed.version };
    } catch (error) {
      console.error('Error parsing services storage:', error);
      return null;
    }
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

interface ServicesState {
  // State
  services: ISubscription[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addService: (service: Omit<ISubscription, "id">) => void;
  updateService: (id: string, service: Omit<ISubscription, "id">) => void;
  deleteService: (id: string) => void;
  setServices: (services: ISubscription[]) => void;
  reorderServices: (services: ISubscription[]) => void;

  // Loading states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed/selectors
  getMonthlyTotal: () => number;
  getActiveServices: () => ISubscription[];
  getUpcomingPayments: (daysAhead?: number) => ISubscription[];
  getServicesByCategory: (category: string) => ISubscription[];
}

export const useServicesStore = create<ServicesState>()(
  persist(
    (set, get) => ({
      // Initial state
      services: [],
      isLoading: false,
      error: null,

      // Actions
      addService: (serviceData) => {
        const newService: ISubscription = {
          ...serviceData,
          id: `service-${Date.now()}`,
        };
        set((state) => ({
          services: [...state.services, newService],
          error: null,
        }));
      },

      updateService: (id, serviceData) => {
        set((state) => ({
          services: state.services.map((service) =>
            service.id === id ? { ...serviceData, id } : service
          ),
          error: null,
        }));
      },

      deleteService: (id) => {
        set((state) => ({
          services: state.services.filter((service) => service.id !== id),
          error: null,
        }));
      },

      setServices: (services) => {
        set({ services, error: null });
      },

      reorderServices: (services) => {
        set({ services });
      },

      // Loading states
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      // Computed/selectors
      getMonthlyTotal: () => {
        const { services } = get();
        return services
          .filter((s) => s.status === "active")
          .reduce((sum, service) => {
            let monthlyAmount = service.amount.value;
            
            // Convert to monthly cost
            switch (service.frequency) {
              case "yearly":
                monthlyAmount = service.amount.value / 12;
                break;
              case "weekly":
                monthlyAmount = service.amount.value * 4.33; // Avg weeks per month
                break;
              case "quarterly":
                monthlyAmount = service.amount.value / 3;
                break;
              // monthly is already correct
            }
            
            return sum + monthlyAmount;
          }, 0);
      },

      getActiveServices: () => {
        const { services } = get();
        return services.filter((s) => s.status === "active");
      },

      getUpcomingPayments: (daysAhead = 7) => {
        const { services } = get();
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + daysAhead);

        return services
          .filter((s) => s.status === "active")
          .filter((s) => {
            const paymentDate = new Date(s.nextPaymentDate);
            return paymentDate >= today && paymentDate <= futureDate;
          })
          .sort((a, b) => 
            new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime()
          );
      },

      getServicesByCategory: (category) => {
        const { services } = get();
        return services.filter((s) => s.category === category);
      },
    }),
    {
      name: "wardia-services",
      storage: customStorage,
    }
  )
);
