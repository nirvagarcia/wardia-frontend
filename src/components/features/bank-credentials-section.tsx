"use client";

/**
 * Bank Credentials Section
 * Displays and manages banking credentials with secure copy-to-clipboard functionality
 */

import React, { useState } from "react";
import { usePreferencesStore } from "@/store/preferences-store";
import { getTranslation } from "@/lib/i18n";
import { Building2, Eye, EyeOff, Copy, Check,  Key, Shield, ChevronDown, ChevronUp, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { IBankCredentials } from "@/types/finance";

interface BankCredentialsSectionProps {
  credentials: IBankCredentials[];
  onEdit: (credential: IBankCredentials) => void;
  onDelete: (id: string) => void;
  onReorder?: (credentials: IBankCredentials[]) => void;
}

function SortableCredential({
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
}: {
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
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cred.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : transition + ", transform 0.2s ease, box-shadow 0.2s ease",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing transition-all",
        isDragging && "scale-105 shadow-2xl z-50 opacity-90"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="p-4 flex items-center justify-between hover:bg-zinc-200 dark:hover:bg-zinc-800/50 transition-colors">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex-1 flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">{cred.bankName}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {t("credentials.accessCredentials")}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(cred);
            }}
            className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors group"
            title={t("common.edit")}
          >
            <Edit2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400 group-hover:text-blue-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(cred.id, cred.bankName);
            }}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
            title={t("common.delete")}
          >
            <Trash2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400 group-hover:text-red-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="p-2 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-4" onPointerDown={(e) => e.stopPropagation()}>
          <div>
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1 block">
              {t("credentials.username")}
            </label>
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-mono text-zinc-900 dark:text-white">
                {cred.username}
              </div>
              <button
                onClick={() => onCopy(cred.username, `username-${cred.id}`)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  copiedFields.has(`username-${cred.id}`)
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                )}
                title={t("credentials.copy")}
              >
                {copiedFields.has(`username-${cred.id}`) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1 block">
              {t("credentials.password")}
            </label>
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-mono text-zinc-900 dark:text-white">
                {isPasswordVisible ? cred.password : "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"}
              </div>
              <button
                onClick={onTogglePassword}
                className="p-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg transition-colors"
                title={t("credentials.showHide")}
              >
                {isPasswordVisible ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => onCopy(cred.password, `password-${cred.id}`)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  copiedFields.has(`password-${cred.id}`)
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                )}
                title={t("credentials.copy")}
              >
                {copiedFields.has(`password-${cred.id}`) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {cred.digitalKey && (
            <div>
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1 block flex items-center gap-1">
                <Key className="w-3 h-3" />
                {t("credentials.digitalKey")}
              </label>
              <div className="flex gap-2">
                <div className="flex-1 px-3 py-2 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-mono text-zinc-900 dark:text-white">
                  {cred.digitalKey}
                </div>
                <button
                  onClick={() => onCopy(cred.digitalKey!, `digitalKey-${cred.id}`)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    copiedFields.has(`digitalKey-${cred.id}`)
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                  )}
                >
                  {copiedFields.has(`digitalKey-${cred.id}`) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {cred.securityToken && (
            <div>
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1 block flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {t("credentials.securityToken")}
              </label>
              <div className="flex gap-2">
                <div className="flex-1 px-3 py-2 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-mono text-zinc-900 dark:text-white">
                  {cred.securityToken}
                </div>
                <button
                  onClick={() => onCopy(cred.securityToken!, `securityToken-${cred.id}`)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    copiedFields.has(`securityToken-${cred.id}`)
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                  )}
                >
                  {copiedFields.has(`securityToken-${cred.id}`) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {cred.notes && (
            <div>
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1 block">
                {t("credentials.notes")}
              </label>
              <div className="px-3 py-2 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white">
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

export function BankCredentialsSection({ credentials, onEdit, onDelete, onReorder }: BankCredentialsSectionProps): React.JSX.Element {
  const { language } = usePreferencesStore();
  const t = (key: string, variables?: Record<string, string | number>) => getTranslation(language, key, variables);
  const locale = language === "es" ? "es-PE" : "en-US";

  const [expandedBank, setExpandedBank] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [copiedFields, setCopiedFields] = useState<Set<string>>(new Set());
  const [localCredentials, setLocalCredentials] = useState(credentials);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; credId: string | null; bankName: string }>({
    isOpen: false,
    credId: null,
    bankName: "",
  });

  React.useEffect(() => {
    setLocalCredentials(credentials);
  }, [credentials]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLocalCredentials((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        if (onReorder) {
          onReorder(newOrder);
        }
        return newOrder;
      });
    }
  };

  const togglePasswordVisibility = (credId: string) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(credId)) {
        newSet.delete(credId);
      } else {
        newSet.add(credId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedFields((prev) => new Set(prev).add(fieldId));
      setTimeout(() => {
        setCopiedFields((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldId);
          return newSet;
        });
      }, 2000);
    });
  };

  if (credentials.length === 0) {
    return (
      <div className="text-center py-8">
        <Shield className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          {t("credentials.noCredentials")}
        </p>
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localCredentials.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {localCredentials.map((cred) => (
              <SortableCredential
                key={cred.id}
                cred={cred}
                isExpanded={expandedBank === cred.id}
                isPasswordVisible={visiblePasswords.has(cred.id)}
                t={t}
                locale={locale}
                onToggleExpand={() => setExpandedBank(expandedBank === cred.id ? null : cred.id)}
                onTogglePassword={() => togglePasswordVisibility(cred.id)}
                onCopy={copyToClipboard}
                copiedFields={copiedFields}
                onEdit={onEdit}
                onDeleteClick={(id, name) => setConfirmDelete({ isOpen: true, credId: id, bankName: name })}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, credId: null, bankName: "" })}
        onConfirm={() => {
          if (confirmDelete.credId) {
            onDelete(confirmDelete.credId);
          }
          setConfirmDelete({ isOpen: false, credId: null, bankName: "" });
        }}
        title={t("credentials.deleteTitle")}
        message={t("credentials.deleteMessage", { bank: confirmDelete.bankName })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        variant="danger"
      />
    </>
  );
}
