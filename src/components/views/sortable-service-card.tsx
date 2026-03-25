/**
 * SortableServiceCard - Draggable wrapper for service cards.
 * Extracted for modularity and reusability.
 */

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { ISubscription } from "@/types/finance";
import { ServiceCardContent } from "./service-card-content";

interface SortableServiceCardProps {
  sub: ISubscription;
  daysUntil: number;
  isDueSoon: boolean;
  locale: string;
  formatCurrency: (amount: { value: number; currency: string }) => string;
  getFrequencyLabel: (freq: string) => string;
  getStatusLabel: (status: string) => string;
  onEdit: (service: ISubscription) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
}

export function SortableServiceCard(props: SortableServiceCardProps): React.JSX.Element {
  const { sub, isDueSoon } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sub.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging
      ? transition
      : transition + ", transform 0.2s ease, box-shadow 0.2s ease",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "card-surface rounded-xl p-4 transition-all duration-200 cursor-grab active:cursor-grabbing group",
        isDueSoon && "ring-1 ring-teal-500/30",
        isDragging && "scale-105 card-elevated z-50 opacity-90"
      )}
      {...attributes}
      {...listeners}
    >
      <ServiceCardContent {...props} />
    </div>
  );
}
