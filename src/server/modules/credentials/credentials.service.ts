import { ApiError } from "@/server/lib/api-error";
import * as repo from "./credentials.repository";
import type { CredentialCreateInput, CredentialUpdateInput } from "./credentials.validation";

export async function getCredentials(userId: string) {
  return repo.findAllByUser(userId);
}

export async function getCredentialById(id: string, userId: string) {
  const credential = await repo.findById(id, userId);
  if (!credential) throw new ApiError("Credential not found", 404);
  return credential;
}

export async function createCredential(userId: string, data: CredentialCreateInput) {
  return repo.create(userId, data);
}

export async function updateCredential(id: string, userId: string, data: CredentialUpdateInput) {
  const existing = await repo.findById(id, userId);
  if (!existing) throw new ApiError("Credential not found", 404);
  return repo.update(id, data);
}

export async function deleteCredential(id: string, userId: string) {
  const existing = await repo.findById(id, userId);
  if (!existing) throw new ApiError("Credential not found", 404);
  await repo.remove(id);
}

