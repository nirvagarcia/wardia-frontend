/**
 * SortableCreditCard - Draggable wrapper for CreditCardDisplay.
 * Extracted for modularity and reusability.
 */

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CreditCardDisplay } from "@/components/features/credit-card-display";
import { ICreditCard } from "@/types/finance";
import { cn } from "@/lib/utils";

interface SortableCreditCardProps {
  card: ICreditCard;
  onEdit: (card: ICreditCard) => void;
  onDelete: (id: string) => void;
}

export function SortableCreditCard({ 
  card, 
  onEdit, 
  onDelete 
}: SortableCreditCardProps): React.JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

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
      <CreditCardDisplay card={card} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
