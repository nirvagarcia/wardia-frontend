import * as React from "react"

import { cn } from "@/shared/utils/cn"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        autoComplete="chrome-off"
        data-form-type="other"
        className={cn(
          "flex h-11 w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-base text-zinc-900 dark:text-white transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:outline-none focus-visible:border-cyan-500 dark:focus-visible:border-cyan-400 focus-visible:ring-4 focus-visible:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-600",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
