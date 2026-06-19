"use client";

import React, { useState } from "react";
import { Building2, Wallet, CreditCard, LayoutGrid } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { BankCredentialCard } from "@/views/accounts/components/bank-credential-card";
import { CredentialFlipCard } from "@/views/accounts/components/credential-flip-card";
import { EmptyCredentialsState } from "./empty-state";
import type { ICredential, CredentialType } from "@/shared/types/finance";

interface BankCredentialsSectionProps {
  credentials: ICredential[];
  onEdit: (credential: ICredential) => void;
  onDelete: (id: string) => void;
}

type FilterType = "all" | CredentialType;

const FILTERS: { value: FilterType; label: string; Icon: React.ElementType }[] = [
  { value: "all",    label: "Todos",     Icon: LayoutGrid },
  { value: "bank",   label: "Bancarias", Icon: Building2 },
  { value: "debit",  label: "Debito",    Icon: Wallet },
  { value: "credit", label: "Credito",   Icon: CreditCard },
];

export function BankCredentialsSection({ credentials, onEdit, onDelete }: BankCredentialsSectionProps): React.JSX.Element {
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = filter === "all" ? credentials : credentials.filter((c) => c.type === filter);

  if (credentials.length === 0) return <EmptyCredentialsState />;

  return (
    <div className="space-y-4">
      {/* Filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(({ value, label, Icon }) => {
          const count = value === "all" ? credentials.length : credentials.filter((c) => c.type === value).length;
          const isActive = filter === value;
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-medium transition-all",
                isActive
                  ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive ? "text-cyan-600 dark:text-cyan-400" : "text-zinc-500 dark:text-zinc-400")} />
              {label}
              <span className={cn(
                "min-w-[1.1rem] h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center",
                isActive ? "bg-cyan-500 text-white" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-sm text-zinc-500 dark:text-zinc-400">
          No hay credenciales de este tipo.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((credential) =>
            credential.type === "bank" ? (
              <BankCredentialCard
                key={credential.id}
                credential={credential}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ) : (
              <CredentialFlipCard
                key={credential.id}
                credential={credential}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
