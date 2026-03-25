/**
 * Badge Variants
 * Reusable Tailwind utility classes for badges and tags.
 */

export const badgeVariants = {
  base: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",

  variant: {
    default: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
    cyan: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  },

  size: {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  },
};

/**
 * Helper function to combine badge classes
 */
export function getBadgeClasses(
  variant: keyof typeof badgeVariants.variant = "default",
  size: keyof typeof badgeVariants.size = "md",
  className?: string
): string {
  const classes = [badgeVariants.base, badgeVariants.variant[variant], badgeVariants.size[size], className]
    .filter(Boolean)
    .join(" ");

  return classes;
}

/**
 * Status Indicator Variants
 */
export const statusVariants = {
  active: "w-2 h-2 rounded-full bg-green-500 animate-pulse",
  inactive: "w-2 h-2 rounded-full bg-zinc-400",
  pending: "w-2 h-2 rounded-full bg-amber-500 animate-pulse",
  error: "w-2 h-2 rounded-full bg-red-500",
};
