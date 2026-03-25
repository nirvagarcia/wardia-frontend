/**
 * Loading State Components
 * Reusable loading indicators for different UI contexts
 */

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Simple spinning loader icon
 */
export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps): React.JSX.Element {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <Loader2
      className={cn("animate-spin text-cyan-500", sizeClasses[size], className)}
    />
  );
}

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

/**
 * Full loading state with spinner and optional message
 */
export function LoadingState({ message, fullScreen = false }: LoadingStateProps): React.JSX.Element {
  const Container = fullScreen ? "div" : React.Fragment;
  const containerProps = fullScreen
    ? { className: "min-h-screen bg-zinc-50/50 dark:bg-zinc-950 flex items-center justify-center" }
    : {};

  return (
    <Container {...containerProps}>
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <LoadingSpinner size="lg" />
        {message && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </Container>
  );
}

/**
 * Card skeleton loader for grid layouts
 */
export function CardSkeleton(): React.JSX.Element {
  return (
    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 animate-pulse">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-32" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-24" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-3/4" />
        </div>
      </div>
    </div>
  );
}

interface GridSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
}

/**
 * Grid of skeleton cards
 */
export function GridSkeleton({ count = 3, columns = 3 }: GridSkeletonProps): React.JSX.Element {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", columnClasses[columns])}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Inline loading indicator for buttons
 */
export function ButtonLoader(): React.JSX.Element {
  return <LoadingSpinner size="sm" className="mr-2" />;
}

/**
 * Simple text loading indicator
 */
export function TextLoader(): React.JSX.Element {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-zinc-500">
      <LoadingSpinner size="sm" />
      Loading...
    </span>
  );
}
