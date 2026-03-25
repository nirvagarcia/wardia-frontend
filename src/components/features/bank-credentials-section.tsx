"use client";

/**
 * Bank Credentials Section
 * Displays and manages banking credentials with secure copy-to-clipboard functionality
 */

import React, { useState, useEffect, useCallback } from "react";
import { usePreferencesStore } from "@/store/preferences-store";
import { getTranslation } from "@/lib/i18n";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { CredentialCard } from "./credential-card";
import { EmptyCredentialsState } from "./empty-credentials-state";
import type { IBankCredentials } from "@/types/finance";


interface BankCredentialsSectionProps {
  credentials: IBankCredentials[];
  onEdit: (credential: IBankCredentials) => void;
  onDelete: (id: string) => void;
  onReorder?: (credentials: IBankCredentials[]) => void;
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

  useEffect(() => {
    setLocalCredentials(credentials);
  }, [credentials]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLocalCredentials((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        if (onReorder) onReorder(newOrder);
        return newOrder;
      });
    }
  }, [onReorder]);

  const togglePasswordVisibility = useCallback((credId: string) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(credId)) {
        newSet.delete(credId);
      } else {
        newSet.add(credId);
      }
      return newSet;
    });
  }, []);

  const copyToClipboard = useCallback((text: string, fieldId: string) => {
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
  }, []);

  const handleDeleteClick = useCallback((id: string, name: string) => {
    setConfirmDelete({ isOpen: true, credId: id, bankName: name });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (confirmDelete.credId) {
      onDelete(confirmDelete.credId);
      setConfirmDelete({ isOpen: false, credId: null, bankName: "" });
    }
  }, [confirmDelete.credId, onDelete]);

  if (credentials.length === 0) {
    return <EmptyCredentialsState t={t} />;
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={localCredentials.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {localCredentials.map((cred) => (
              <CredentialCard
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
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, credId: null, bankName: "" })}
        title={t("credentials.confirmDelete")}
        message={t("credentials.deleteWarning", { bank: confirmDelete.bankName })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        onConfirm={handleConfirmDelete}
        variant="danger"
      />
    </>
  );
}

         