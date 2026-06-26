export function AccountsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <header className="space-y-2">
        <div className="h-8 w-36 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
        <div className="h-4 w-56 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-700" />
      </div>

      <div className="flex gap-2">
        <div className="h-9 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        <div className="h-9 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        <div className="h-9 w-28 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4" />
              </div>
              <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
