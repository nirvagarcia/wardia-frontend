/**
 * Date Utilities
 * Common date manipulation and formatting functions
 */

/**
 * Calculate days between now and a target date
 * Returns negative number if date is in the past
 */
export function getDaysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Format date for display
 */
export function formatDate(date: Date, locale: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is within a range
 */
export function isWithinRange(
  date: Date,
  startDate: Date | null,
  endDate: Date | null
): boolean {
  if (startDate && date < startDate) return false;
  if (endDate && date > endDate) return false;
  return true;
}

/**
 * Get start of day (00:00:00)
 */
export function startOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * Get end of day (23:59:59)
 */
export function endOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

/**
 * Get date key for grouping (YYYY-MM-DD format)
 */
export function getDateKey(date: Date): string {
  const isoString = date.toISOString();
  const datePart = isoString.split("T")[0];
  return datePart ?? "";
}
