"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { credentialsService } from "@/shared/services/credentials-service";
import type { ICredential } from "@/shared/types/finance";

export const CREDENTIALS_QUERY_KEY = ["credentials"] as const;

export function useCredentialsQuery() {
  return useQuery({
    queryKey: CREDENTIALS_QUERY_KEY,
    queryFn: () => credentialsService.getCredentials(),
  });
}

export function useCredentialByIdQuery(id: string | null) {
  return useQuery({
    queryKey: [...CREDENTIALS_QUERY_KEY, id],
    queryFn: () => credentialsService.getCredentialById(id!),
    enabled: !!id,
    staleTime: 0,
  });
}

export function useAddCredential() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ICredential, "id" | "lastUpdated">) =>
      credentialsService.createCredential(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CREDENTIALS_QUERY_KEY });
    },
  });
}

export function useUpdateCredential() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<ICredential, "id" | "lastUpdated">> }) =>
      credentialsService.updateCredential(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: CREDENTIALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...CREDENTIALS_QUERY_KEY, id] });
    },
  });
}

export function useDeleteCredential() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => credentialsService.deleteCredential(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CREDENTIALS_QUERY_KEY });
    },
  });
}

