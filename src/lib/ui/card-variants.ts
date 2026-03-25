/**
 * Card Variants
 * Reusable Tailwind utility classes for cards.
 */

export const cardVariants = {
  // Base card surface (matches existing card-surface class)
  base: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm",

  // Elevated card (matches existing card-elevated class)
  elevated: "shadow-lg shadow-zinc-900/5 dark:shadow-zinc-950/20",

  // Interactive card
  interactive: "hover:shadow-md transition-shadow cursor-pointer",

  // Padding variants
  padding: {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
    xl: "p-8",
  },

  // Header with border
  header: "border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4 mb-4",

  // Footer with border
  footer: "border-t border-zinc-200/60 dark:border-zinc-800/60 pt-4 mt-4",
};

/**
 * Helper function to combine card classes
 */
export function getCardClasses(
  elevated = false,
  interactive = false,
  padding: keyof typeof cardVariants.padding = "md",
  className?: string
): string {
  const classes = [
    cardVariants.base,
    elevated && cardVariants.elevated,
    interactive && cardVariants.interactive,
    cardVariants.padding[padding],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return classes;
}

/**
 * Gradient Background Utilities
 */
export const gradientVariants = {
  subtle: "bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-900",
  cyan: "bg-gradient-to-br from-cyan-500 to-teal-500",
  purple: "bg-gradient-to-br from-purple-500 to-pink-500",
  amber: "bg-gradient-to-br from-amber-500 to-orange-500",
};
