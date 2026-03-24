"use client";

/**
 * Debit Card Visual Component
 * Visual card representation for debit accounts matching credit card styling.
 */

import React from "react";
import { motion } from "framer-motion";
import { IAccount } from "@/types/finance";
import { maskAccountNumber } from "@/lib/security";
import { cn } from "@/lib/utils";

interface DebitCardVisualProps {
  account: IAccount;
}

export const DebitCardVisual: React.FC<DebitCardVisualProps> = ({ account }) => {
  return (
    <div className="perspective-1000">
      <motion.div
        className={cn(
          "relative w-full h-56 rounded-2xl p-6 shadow-2xl bg-gradient-to-br cursor-default",
          "from-emerald-600 to-teal-700"
        )}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex items-start justify-between mb-8">
          <div className="text-white/80 font-bold text-xl uppercase tracking-wider">
            Debit
          </div>
          <div className={cn(
            "w-12 h-8 rounded bg-white/20 backdrop-blur-sm",
            "flex items-center justify-center"
          )}>
            <div className="w-8 h-6 bg-gradient-to-br from-white/60 to-white/40 rounded" />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-white font-mono text-lg tracking-widest">
            {maskAccountNumber(account.accountNumber)}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/60 text-xs mb-1">Bank</p>
            <p className="text-white font-medium uppercase tracking-wide text-sm">
              {account.bankName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs mb-1">Type</p>
            <p className="text-white font-medium uppercase text-sm">
              {account.accountType}
            </p>
          </div>
        </div>

        <div className="absolute top-20 left-6 w-12 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded opacity-80" />
      </motion.div>
    </div>
  );
};
