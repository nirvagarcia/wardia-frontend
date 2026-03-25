/**
 * Button Variants
 * Reusable Tailwind utility classes for buttons.
 */

export const buttonVariants = {
  // Base classes for all buttons
  base: "rounded-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2",

  // Size variants
  size: {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  },

  // Style variants
  variant: {
    primary: "bg-cyan-500 hover:bg-cyan-600 text-white shadow-md shadow-cyan-500/20 focus:ring-cyan-500",
    secondary:
      "bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white",
    outline:
      "border-2 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 focus:ring-red-500",
    ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
    success: "bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/20 focus:ring-green-500",
  },

  // State variants
  disabled: "opacity-50 cursor-not-allowed",
  loading: "relative pointer-events-none opacity-70",
};

/**
 * Helper function to combine button classes
 */
export function getButtonClasses(
  variant: keyof typeof buttonVariants.variant = "primary",
  size: keyof typeof buttonVariants.size = "md",
  disabled = false,
  loading = false,
  className?: string
): string {
  const classes = [
    buttonVariants.base,
    buttonVariants.size[size],
    buttonVariants.variant[variant],
    disabled && buttonVariants.disabled,
    loading && buttonVariants.loading,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return classes;
}
