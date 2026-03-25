/**
 * Input Variants
 * Reusable Tailwind utility classes for form inputs.
 */

export const inputVariants = {
  // Base input classes
  base: "w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2",

  // State variants
  default:
    "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:border-cyan-500 focus:ring-cyan-500/20",
  error:
    "bg-white dark:bg-zinc-900 border-red-500 dark:border-red-500 text-zinc-900 dark:text-white focus:border-red-500 focus:ring-red-500/20",
  success:
    "bg-white dark:bg-zinc-900 border-green-500 dark:border-green-500 text-zinc-900 dark:text-white focus:border-green-500 focus:ring-green-500/20",
  disabled: "bg-zinc-100 dark:bg-zinc-800 cursor-not-allowed opacity-60",

  // Label classes
  label: "text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block",

  // Error message
  errorMessage: "text-sm text-red-500 dark:text-red-400 mt-1",

  // Helper text
  helperText: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
};

/**
 * Helper function to combine input classes
 */
export function getInputClasses(state: "default" | "error" | "success" | "disabled" = "default", className?: string): string {
  const classes = [inputVariants.base, inputVariants[state], className].filter(Boolean).join(" ");

  return classes;
}

/**
 * Select/Dropdown Variants
 */
export const selectVariants = {
  base: "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:border-cyan-500 focus:ring-cyan-500/20 transition-colors appearance-none cursor-pointer",
  icon: "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400",
};
