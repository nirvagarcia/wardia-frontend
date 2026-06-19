export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <header className="space-y-2">
        <div className="h-8 w-40 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
        <div className="h-4 w-56 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 h-36 rounded-2xl bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-700" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
          <div className="h-5 w-36 bg-zinc-200 dark:bg-zinc-700 rounded" />
          <div className="flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-3 flex-1 bg-zinc-200 dark:bg-zinc-700 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-3">
          <div className="h-5 w-44 bg-zinc-200 dark:bg-zinc-700 rounded" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3" />
              </div>
              <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-3">
        <div className="h-5 w-40 bg-zinc-200 dark:bg-zinc-700 rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-1.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4" />
            </div>
            <div className="h-4 w-14 bg-zinc-200 dark:bg-zinc-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
