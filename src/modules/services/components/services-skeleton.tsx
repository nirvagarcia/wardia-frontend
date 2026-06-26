export function ServicesSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <header className="space-y-4">
        <div className="space-y-2">
          <div className="h-8 w-44 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
          <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        </div>
        <div className="h-48 rounded-2xl bg-zinc-200 dark:bg-zinc-700" />
      </header>

      <div className="flex gap-2 justify-end">
        <div className="h-9 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
        <div className="h-9 w-36 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
              <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
              <div className="h-5 w-14 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
            </div>
            <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
