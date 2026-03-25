"use client";

/**
 * Debit Card Visual Component
 * Visual card representation for debit accounts matching credit card styling.
 */

import React from "react";
import { motion } from "framer-motion";
import { IAccount } from "@/shared/types/finance";
import { maskAccountNumber } from "@/shared/utils/security";
import { cn } from "@/shared/utils/cn";

interface DebitCardVisualProps {
  account: IAccount;
}

const getBankGradient = (bankName: string): string => {
  const bank = bankName.toLowerCase();
  if (bank.includes("bcp") || bank.includes("crédito del perú")) {
    return "from-blue-600 via-blue-700 to-blue-800"; // BCP Blue
  } else if (bank.includes("interbank")) {
    return "from-emerald-600 via-emerald-700 to-green-700"; // Interbank Green
  } else if (bank.includes("bbva")) {
    return "from-blue-700 via-blue-800 to-indigo-900"; // BBVA Dark Blue
  } else if (bank.includes("scotiabank")) {
    return "from-red-600 via-red-700 to-red-800"; // Scotiabank Red
  }
  return "from-slate-600 via-slate-700 to-slate-800"; // Default Gray
};

export const DebitCardVisual: React.FC<DebitCardVisualProps> = ({ account }) => {
  const networkDisplay = account.network.toUpperCase();
  const gradientClasses = getBankGradient(account.bankName);

  return (
    <div className="perspective-1000">
      <motion.div
        className={cn(
          "relative w-full h-56 rounded-2xl p-6 shadow-2xl bg-gradient-to-br cursor-default",
          gradientClasses
        )}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex items-start justify-between mb-8">
          <div className="text-white/90 font-bold text-xl uppercase tracking-wider drop-shadow-lg">
            {networkDisplay}
          </div>
          <div className={cn(
            "w-12 h-8 rounded bg-white/20 backdrop-blur-sm",
            "flex items-center justify-center shadow-lg"
          )}>
            <div className="w-8 h-6 bg-gradient-to-br from-white/60 to-white/40 rounded" />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-white font-mono text-lg tracking-widest drop-shadow-md">
            {maskAccountNumber(account.accountNumber)}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/70 text-xs mb-1 font-medium">Expires</p>
            <p className="text-white font-mono text-sm drop-shadow-md">
              {String(account.expiryMonth).padStart(2, "0")}/{String(account.expiryYear).slice(-2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1 font-medium">CVV</p>
            <p className="text-white font-mono text-sm drop-shadow-md">•••</p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs mb-1 font-medium">Bank</p>
            <p className="text-white font-semibold uppercase tracking-wide text-xs drop-shadow-md">
              {account.bankName.split(' ')[0]}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
