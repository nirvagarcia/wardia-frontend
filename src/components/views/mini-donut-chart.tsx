/**
 * MiniDonutChart - Visual donut chart for financial breakdown.
 * Extracted from DashboardView for reusability.
 */

import React from "react";
import { PieChart } from "lucide-react";

interface MiniDonutChartProps {
  segments: Array<{ value: number; color: string; label: string }>;
}

export function MiniDonutChart({ segments }: MiniDonutChartProps): React.JSX.Element {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  const size = 120;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {segments.map((segment, i) => {
          const segmentLength = total > 0 ? (segment.value / total) * circumference : 0;
          
          // Calculate cumulative offset for this segment
          const cumulativeOffset = segments
            .slice(0, i)
            .reduce((sum, seg) => {
              const length = total > 0 ? (seg.value / total) * circumference : 0;
              return sum + length;
            }, 0);
          
          const dashOffset = circumference - cumulativeOffset;
          
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <PieChart className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
      </div>
    </div>
  );
}
