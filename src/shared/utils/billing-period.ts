/**
 * Billing Period Utilities
 * Handles custom billing cycle computation — allows users to define
 * their own "month" start day (e.g. pay day = 28th means their June
 * runs from May 28 to June 27).
 */

export interface BillingPeriod {
  start: Date;
  end: Date;  
}

/**
 * Compute the billing period that contains `referenceDate`.
 * When startDay=1, behaves identically to a calendar month.
 */
export function getBillingPeriod(startDay: number, referenceDate: Date): BillingPeriod {
  const day = referenceDate.getDate();
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth(); // 0-indexed

  let periodYear: number;
  let periodMonth: number;

  if (startDay === 1 || day >= startDay) {
    periodYear = year;
    periodMonth = month;
  } else {
    if (month === 0) {
      periodYear = year - 1;
      periodMonth = 11;
    } else {
      periodYear = year;
      periodMonth = month - 1;
    }
  }

  const start = new Date(periodYear, periodMonth, startDay);
  const end = new Date(periodYear, periodMonth + 1, startDay); // JS handles month overflow

  return { start, end };
}

/**
 * Navigate a billing period by `delta` months.
 * delta=-1 returns the previous period, +1 the next.
 */
export function navigateBillingPeriod(period: BillingPeriod, delta: number): BillingPeriod {
  const newStart = new Date(period.start);
  newStart.setMonth(newStart.getMonth() + delta);
  const newEnd = new Date(newStart);
  newEnd.setMonth(newEnd.getMonth() + 1);
  return { start: newStart, end: newEnd };
}

/**
 * Format a period as a human-readable label.
 * Calendar month (startDay=1): "Junio 2026"
 * Custom:                       "28 may – 27 jun 2026"
 */
export function formatPeriodLabel(
  period: BillingPeriod,
  locale: string,
  startDay: number,
): string {
  if (startDay === 1) {
    const raw = period.start.toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
    });
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  const lastDay = new Date(period.end);
  lastDay.setDate(lastDay.getDate() - 1);

  const startStr = period.start.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
  });
  const endStr = lastDay.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${startStr} – ${endStr}`;
}

/**
 * Convert a BillingPeriod to YYYY-MM-DD strings for API queries.
 */
export function periodToApiParams(period: BillingPeriod): {
  startDate: string;
  endDate: string;
} {
  function fmt(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  return { startDate: fmt(period.start), endDate: fmt(period.end) };
}
