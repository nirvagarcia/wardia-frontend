"use client";

/**
 * Interactive Credit Card Component with 3D tilt effect.
 * Uses Framer Motion for smooth animations. Applied to specific element, not entire page.
 */

import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ICreditCard } from "@/types/finance";
import { maskCreditCard } from "@/lib/security";
import { cn } from "@/lib/utils";

interface InteractiveCardProps {
  card: ICreditCard;
}

const cardNetworkGradients: Record<string, string> = {
  visa: "from-blue-600 to-blue-800",
  mastercard: "from-orange-600 to-red-700",
  amex: "from-teal-600 to-cyan-800",
  discover: "from-orange-500 to-amber-700",
};

export const InteractiveCard: React.FC<InteractiveCardProps> = ({ card }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = (): void => {
    x.set(0);
    y.set(0);
  };

  const gradient = cardNetworkGradients[card.network] || "from-gray-600 to-gray-800";

  return (
    <div className="perspective-1000">
      <motion.div
        className={cn(
          "relative w-full h-56 rounded-2xl p-6 shadow-2xl cursor-pointer",
          "bg-gradient-to-br",
          gradient
        )}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Card Network Logo */}
        <div className="flex items-start justify-between mb-8">
          <div className="text-white/80 font-bold text-xl uppercase tracking-wider">
            {card.network}
          </div>
          <div className={cn(
            "w-12 h-8 rounded bg-white/20 backdrop-blur-sm",
            "flex items-center justify-center"
          )}>
            <div className="w-8 h-6 bg-gradient-to-br from-white/60 to-white/40 rounded" />
          </div>
        </div>

        {/* Card Number */}
        <div className="mb-6">
          <p className="text-white font-mono text-lg tracking-widest">
            {maskCreditCard(card.cardNumber)}
          </p>
        </div>

        {/* Cardholder Name & Expiry */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/60 text-xs mb-1">Cardholder</p>
            <p className="text-white font-medium uppercase tracking-wide text-sm">
              {card.cardholderName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs mb-1">Expires</p>
            <p className="text-white font-mono">
              {String(card.expiryMonth).padStart(2, "0")}/{String(card.expiryYear).slice(-2)}
            </p>
          </div>
        </div>

        {/* Chip effect */}
        <div className="absolute top-20 left-6 w-12 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded opacity-80" />
      </motion.div>
    </div>
  );
};
