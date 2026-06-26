/**
 * CreditCardsTab Component
 * Displays and manages credit cards with drag-and-drop reordering
 */

import React from "react";
import { Wallet } from "lucide-react";
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
} from "@dnd-kit/sortable";
import type { ICreditCard } from "@/shared/types/finance";
import { SortableCreditCard } from "./sortable-credit-card";

interface CreditCardsTabProps {
  cards: ICreditCard[];
  onEdit: (card: ICreditCard) => void;
  onDelete: (id: string) => void;
  onReorder: (reordered: ICreditCard[]) => void;
  noCardsMessage: string;
  addFirstCardMessage: string;
  addCardLabel: string;
  onAddClick: () => void;
}

export function CreditCardsTab({
  cards,
  onEdit,
  onDelete,
  onReorder,
  noCardsMessage,
  addFirstCardMessage,
  addCardLabel,
  onAddClick,
}: CreditCardsTabProps): React.JSX.Element {
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
      const oldIndex = cards.findIndex((item) => item.id === active.id);
      const newIndex = cards.findIndex((item) => item.id === over.id);
      const reordered = arrayMove(cards, oldIndex, newIndex);
      onReorder(reordered);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <Wallet className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
          {noCardsMessage}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{addFirstCardMessage}</p>
        <button
          onClick={onAddClick}
          className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition-colors text-white"
        >
          {addCardLabel}
        </button>
      </div>
    );
  }

  return (
    <DndContext
      id="credit-cards-dnd"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <SortableCreditCard
              key={card.id}
              card={card}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
