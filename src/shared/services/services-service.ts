/**
 * Services Service (Subscriptions)
 * Abstraction layer for subscription/service data operations.
 */

import type { ISubscription } from "@/shared/types/finance";
import { mockSubscriptions } from "@/shared/utils/mock";

const USE_MOCK_DATA = true;

export const servicesService = {
  /**
   * Fetch all services/subscriptions
   */
  async getServices(): Promise<ISubscription[]> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockSubscriptions;
    }

    // Real API implementation
    // const response = await fetch('/api/services');
    // if (!response.ok) throw new Error('Failed to fetch services');
    // return response.json();

    return [];
  },

  /**
   * Create a new service
   */
  async createService(service: Omit<ISubscription, "id">): Promise<ISubscription> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        ...service,
        id: `service-${Date.now()}`,
      };
    }

    // Real API implementation
    // const response = await fetch('/api/services', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(service),
    // });
    // if (!response.ok) throw new Error('Failed to create service');
    // return response.json();

    throw new Error("API not implemented");
  },

  /**
   * Update an existing service
   */
  async updateService(id: string, service: Omit<ISubscription, "id">): Promise<ISubscription> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        ...service,
        id,
      };
    }

    // Real API implementation
    // const response = await fetch(`/api/services/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(service),
    // });
    // if (!response.ok) throw new Error('Failed to update service');
    // return response.json();

    throw new Error("API not implemented");
  },

  /**
   * Delete a service
   */
  async deleteService(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      console.log(`Deleting service: ${id}`);
      return;
    }

    // Real API implementation
    // const response = await fetch(`/api/services/${id}`, {
    //   method: 'DELETE',
    // });
    // if (!response.ok) throw new Error('Failed to delete service');

    throw new Error("API not implemented");
  },
};
