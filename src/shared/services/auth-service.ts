import type { IUser } from "@/shared/types/auth";

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as { error?: string }).error ?? `Error ${res.status}`);
  return (json as { data: T }).data;
}

export const authService = {
  async login(email: string, password: string): Promise<IUser> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse<IUser & { createdAt: string }>(res);
    return { ...data, createdAt: new Date(data.createdAt) };
  },

  async register(data: { name: string; email: string; phone?: string; password: string }): Promise<IUser> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await handleResponse<IUser & { createdAt: string }>(res);
    return { ...body, createdAt: new Date(body.createdAt) };
  },

  async logout(): Promise<void> {
    await fetch("/api/auth/logout", { method: "POST" });
  },

  async getMe(): Promise<IUser> {
    const res = await fetch("/api/auth/me");
    const data = await handleResponse<IUser & { createdAt: string }>(res);
    return { ...data, createdAt: new Date(data.createdAt) };
  },

  async forgotPassword(email: string): Promise<void> {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error((json as { error?: string }).error ?? `Error ${res.status}`);
    }
  },

  async resetPassword(token: string, password: string): Promise<void> {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error((json as { error?: string }).error ?? `Error ${res.status}`);
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error((json as { error?: string }).error ?? `Error ${res.status}`);
    }
  },

  async updateProfile(data: { name?: string; phone?: string | null; email?: string }): Promise<IUser> {
    const res = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await handleResponse<IUser & { createdAt: string }>(res);
    return { ...body, createdAt: new Date(body.createdAt) };
  },
};
