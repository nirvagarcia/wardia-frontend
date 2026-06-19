export function TransactionsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <header className="space-y-2">
        <div className="h-8 w-44 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
        <div className="h-4 w-60 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
      </header>

      <div className="h-36 rounded-2xl bg-zinc-200 dark:bg-zinc-700" />

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
          <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
          <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
          <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        </div>
      </div>

      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-2/5" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4" />
              </div>
              <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
