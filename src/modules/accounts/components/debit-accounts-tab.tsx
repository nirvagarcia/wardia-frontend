/**
 * DebitAccountsTab Component
 * Displays and manages debit accounts with drag-and-drop reordering
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
import type { IAccount } from "@/shared/types/finance";
import { SortableAccountCard } from "./sortable-account-card";

interface DebitAccountsTabProps {
  accounts: IAccount[];
  onEdit: (account: IAccount) => void;
  onDelete: (id: string) => void;
  onReorder: (reordered: IAccount[]) => void;
  noAccountsMessage: string;
  addFirstMessage: string;
  addAccountLabel: string;
  onAddClick: () => void;
}

export function DebitAccountsTab({
  accounts,
  onEdit,
  onDelete,
  onReorder,
  noAccountsMessage,
  addFirstMessage,
  addAccountLabel,
  onAddClick,
}: DebitAccountsTabProps): React.JSX.Element {
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
      const oldIndex = accounts.findIndex((item) => item.id === active.id);
      const newIndex = accounts.findIndex((item) => item.id === over.id);
      const reordered = arrayMove(accounts, oldIndex, newIndex);
      onReorder(reordered);
    }
  };

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <Wallet className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
          {noAccountsMessage}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{addFirstMessage}</p>
        <button
          onClick={onAddClick}
          className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition-colors text-white"
        >
          {addAccountLabel}
        </button>
      </div>
    );
  }

  return (
    <DndContext
      id="accounts-dnd"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={accounts.map((acc) => acc.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.map((account) => (
            <SortableAccountCard
              key={account.id}
              account={account}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
