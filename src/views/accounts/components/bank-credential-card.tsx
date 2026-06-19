"use client";

import { useState } from "react";
import { Building2, Copy, Eye, EyeOff, Pencil, Trash2, Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { credentialsService } from "@/shared/services/credentials-service";
import type { ICredential } from "@/shared/types/finance";

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    });
  }
  return { copied, copy };
}

interface BankCredentialCardProps {
  credential: ICredential;
  onEdit: (c: ICredential) => void;
  onDelete: (id: string) => void;
}

export function BankCredentialCard({ credential, onEdit, onDelete }: BankCredentialCardProps) {
  const { copy, copied } = useCopy();
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  async function handleReveal() {
    if (revealedPassword) {
      setRevealedPassword(null);
      return;
    }
    setIsRevealing(true);
    try {
      const full = await credentialsService.getCredentialById(credential.id);
      setRevealedPassword(full.password ?? null);
    } finally {
      setIsRevealing(false);
    }
  }

  const displayPassword = revealedPassword ?? credential.password ?? "***";

  return (
    <div className="group rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 flex flex-col gap-3 hover:border-cyan-400 dark:hover:border-cyan-500 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-9 h-9 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
            {credential.credentialName || credential.bankName}
          </p>
          {credential.credentialName && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{credential.bankName}</p>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(credential)}
            className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            title="Editar"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(credential.id)}
            className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-2 text-xs">
        {credential.username && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-zinc-500 dark:text-zinc-400 flex-shrink-0">Usuario</span>
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-mono text-zinc-800 dark:text-zinc-200 truncate">{credential.username}</span>
              <button
                onClick={() => copy(credential.username!)}
                className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 flex-shrink-0"
              >
                {copied === credential.username ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <span className="text-zinc-500 dark:text-zinc-400 flex-shrink-0">Contraseña</span>
          <div className="flex items-center gap-1 min-w-0">
            <span className={cn("font-mono text-zinc-800 dark:text-zinc-200 truncate", !revealedPassword && "tracking-widest")}>
              {revealedPassword ? displayPassword : "•••••••"}
            </span>
            <button
              onClick={() => revealedPassword && copy(revealedPassword)}
              disabled={!revealedPassword}
              className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 flex-shrink-0 disabled:opacity-30"
            >
              {copied === revealedPassword ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            </button>
            <button
              onClick={handleReveal}
              disabled={isRevealing}
              className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 flex-shrink-0 disabled:opacity-50"
              title={revealedPassword ? "Ocultar" : "Revelar"}
            >
              {isRevealing ? (
                <span className="w-3 h-3 border border-zinc-400 border-t-transparent rounded-full animate-spin block" />
              ) : revealedPassword ? (
                <EyeOff className="w-3 h-3" />
              ) : (
                <Eye className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      {credential.description && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate border-t border-zinc-100 dark:border-zinc-800 pt-2">
          {credential.description}
        </p>
      )}
    </div>
  );
}
