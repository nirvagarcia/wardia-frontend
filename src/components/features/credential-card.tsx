/**
 * Credential Card Component
 * Sortable card for displaying bank credentials.
 */

import React from "react";
import Image from "next/image";
import { Building2, Edit2, Trash2, ChevronDown, ChevronUp, Key, Shield } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { getBankLogo } from "@/lib/bank-logos";
import { CredentialField } from "./credential-field";
import type { IBankCredentials } from "@/types/finance";

interface CredentialCardProps {
  cred: IBankCredentials;
  isExpanded: boolean;
  isPasswordVisible: boolean;
  t: (key: string, vars?: Record<string, string | number>) => string;
  locale: string;
  onToggleExpand: () => void;
  onTogglePassword: () => void;
  onCopy: (text: string, fieldId: string) => void;
  copiedFields: Set<string>;
  onEdit: (cred: IBankCredentials) => void;
  onDeleteClick: (id: string, name: string) => void;
}

export function CredentialCard({
  cred,
  isExpanded,
  isPasswordVisible,
  t,
  locale,
  onToggleExpand,
  onTogglePassword,
  onCopy,
  copiedFields,
  onEdit,
  onDeleteClick,
}: CredentialCardProps): React.JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cred.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : transition + ", transform 0.2s ease, box-shadow 0.2s ease",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "card-surface rounded-2xl overflow-hidden transition-all hover:card-elevated",
        isDragging && "scale-105 shadow-2xl z-50 opacity-90"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="p-5 flex items-center justify-between bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-900">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex-1 flex items-center gap-4 text-left"
        >
          <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl ring-1 ring-black/[0.06] dark:ring-white/[0.06] shadow-md">
            {getBankLogo(cred.bankName) ? (
              <Image
                src={getBankLogo(cred.bankName)!}
                alt={cred.bankName}
                width={32}
                height={32}
                className="object-contain"
              />
            ) : (
              <Building2 className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">{cred.bankName}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{t("credentials.accessCredentials")}</p>
          </div>
        </button>

        <div className="flex items-center gap-1" onPointerDown={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(cred);
            }}
            className="p-1.5 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/50 rounded-lg transition-colors group"
            title={t("common.edit")}
          >
            <Edit2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(cred.id, cred.bankName);
            }}
            className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors group"
            title={t("common.delete")}
          >
            <Trash2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-red-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="p-1.5 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/50 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          className="px-5 pb-5 space-y-3 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-5 bg-white dark:bg-zinc-900"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <CredentialField
            label={t("credentials.username")}
            value={cred.username}
            fieldId={`username-${cred.id}`}
            onCopy={onCopy}
            copiedFields={copiedFields}
          />

          <CredentialField
            label={t("credentials.password")}
            value={cred.password}
            fieldId={`password-${cred.id}`}
            isPassword={true}
            isVisible={isPasswordVisible}
            onToggleVisibility={onTogglePassword}
            onCopy={onCopy}
            copiedFields={copiedFields}
          />

          {cred.digitalKey && (
            <CredentialField
              label={t("credentials.digitalKey")}
              value={cred.digitalKey}
              fieldId={`digitalKey-${cred.id}`}
              icon={<Key className="w-3 h-3" />}
              onCopy={onCopy}
              copiedFields={copiedFields}
            />
          )}

          {cred.securityToken && (
            <CredentialField
              label={t("credentials.securityToken")}
              value={cred.securityToken}
              fieldId={`securityToken-${cred.id}`}
              icon={<Shield className="w-3 h-3" />}
              onCopy={onCopy}
              copiedFields={copiedFields}
            />
          )}

          {cred.notes && (
            <div>
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1 block">
                {t("credentials.notes")}
              </label>
              <div className="px-3 py-2 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white cursor-text select-text">
                {cred.notes}
              </div>
            </div>
          )}

          <div className="text-xs text-zinc-500 dark:text-zinc-500 pt-2">
            {t("creditCard.lastUpdated")}: {cred.lastUpdated.toLocaleDateString(locale)}
          </div>
        </div>
      )}
    </div>
  );
}
