import type { ICredential } from "@/shared/types/finance";

type CredentialPayload = Omit<ICredential, "id" | "lastUpdated">;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error((json as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json().then((j: { data: T }) => j.data);
}

function deserialize(raw: ICredential): ICredential {
  return { ...raw, lastUpdated: new Date(raw.lastUpdated) };
}

export const credentialsService = {
  async getCredentials(): Promise<ICredential[]> {
    const res = await fetch("/api/credentials");
    const list = await handleResponse<ICredential[]>(res);
    return list.map(deserialize);
  },

  async getCredentialById(id: string): Promise<ICredential> {
    const res = await fetch(`/api/credentials/${id}`);
    const item = await handleResponse<ICredential>(res);
    return deserialize(item);
  },

  async createCredential(data: CredentialPayload): Promise<ICredential> {
    const res = await fetch("/api/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const item = await handleResponse<ICredential>(res);
    return deserialize(item);
  },

  async updateCredential(id: string, data: Partial<CredentialPayload>): Promise<ICredential> {
    const res = await fetch(`/api/credentials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const item = await handleResponse<ICredential>(res);
    return deserialize(item);
  },

  async deleteCredential(id: string): Promise<void> {
    const res = await fetch(`/api/credentials/${id}`, { method: "DELETE" });
    return handleResponse<void>(res);
  },
};

