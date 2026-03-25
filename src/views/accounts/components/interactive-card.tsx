"use client";

/**
 * Interactive Credit Card Component with 3D tilt effect.
 * Uses Framer Motion for smooth animations. Applied to specific element, not entire page.
 */

import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ICreditCard } from "@/shared/types/finance";
import { maskCreditCard } from "@/shared/utils/security";
import { cn } from "@/shared/utils/cn";

interface InteractiveCardProps {
  card: ICreditCard;
  disableInteractive?: boolean;
}

const cardNetworkGradients: Record<string, string> = {
  visa: "from-blue-600 to-blue-800",
  mastercard: "from-orange-600 to-red-700",
  amex: "from-teal-600 to-cyan-800",
  discover: "from-orange-500 to-amber-700",
};

export const InteractiveCard: React.FC<InteractiveCardProps> = ({ card, disableInteractive = false }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (disableInteractive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = (): void => {
    if (disableInteractive) return;
    x.set(0);
    y.set(0);
  };

  const gradient = cardNetworkGradients[card.network] || "from-gray-600 to-gray-800";

  return (
    <div className="perspective-1000">
      <motion.div
        className={cn(
          "relative w-full h-56 rounded-2xl p-6 shadow-2xl bg-gradient-to-br",
          disableInteractive ? "cursor-default" : "cursor-pointer",
          gradient
        )}
        style={{
          rotateX: disableInteractive ? 0 : rotateX,
          rotateY: disableInteractive ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={!disableInteractive ? handleMouseMove : undefined}
        onMouseLeave={!disableInteractive ? handleMouseLeave : undefined}
        whileHover={!disableInteractive ? { scale: 1.02 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
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

        <div className="mb-6">
          <p className="text-white font-mono text-lg tracking-widest">
            {maskCreditCard(card.cardNumber)}
          </p>
        </div>

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
      </motion.div>
    </div>
  );
};
