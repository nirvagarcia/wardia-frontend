/**
 * StatBar - Horizontal stat bar for quick financial insight.
 * Extracted from DashboardView for reusability.
 */

import React from "react";

interface StatBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

export function StatBar({ label, value, total, color }: StatBarProps): React.JSX.Element {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
        <span className="font-semibold text-zinc-900 dark:text-white">{percentage.toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-zinc-200/80 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
