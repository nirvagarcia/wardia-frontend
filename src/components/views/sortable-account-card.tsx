/**
 * SortableAccountCard - Draggable wrapper for AccountCard.
 * Extracted for modularity and reusability.
 */

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AccountCard } from "@/components/features/account-card";
import { IAccount } from "@/types/finance";
import { cn } from "@/lib/utils";

interface SortableAccountCardProps {
  account: IAccount;
  onEdit: (account: IAccount) => void;
  onDelete: (id: string) => void;
}

export function SortableAccountCard({ 
  account, 
  onEdit, 
  onDelete 
}: SortableAccountCardProps): React.JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: account.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : transition + ", transform 0.2s ease, box-shadow 0.2s ease",
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "relative cursor-grab active:cursor-grabbing transition-all",
        isDragging && "scale-105 shadow-2xl z-50 opacity-90"
      )}
      {...attributes}
      {...listeners}
    >
      <AccountCard account={account} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
