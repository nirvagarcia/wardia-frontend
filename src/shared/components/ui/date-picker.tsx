"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/shared/utils/cn"
import { Calendar } from "@/shared/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePicker({ 
  value, 
  onChange, 
  placeholder = "Pick a date",
  className,
  disabled = false
}: DatePickerProps) {
  const handleDateChange = (date: Date | undefined) => {
    if (date && onChange) {
      const normalizedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        12,
        0,
        0,
        0
      )
      onChange(normalizedDate)
    } else {
      onChange?.(date)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-11 w-full items-center rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-base text-zinc-900 dark:text-white transition-all shadow-sm hover:border-zinc-300 dark:hover:border-zinc-600 focus-visible:outline-none focus-visible:border-cyan-500 dark:focus-visible:border-cyan-400 focus-visible:ring-4 focus-visible:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50",
            !value && "text-zinc-400 dark:text-zinc-500",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
          <span className="flex-1 text-left">
            {value ? format(value, "PPP") : placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-0 shadow-xl" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
