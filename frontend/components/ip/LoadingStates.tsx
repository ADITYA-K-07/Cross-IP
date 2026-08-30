export function ResultSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div className="rounded-lg border border-border-technical bg-white p-5">
          <div className="skeleton-shimmer mx-auto h-24 w-36 rounded-full" />
          <div className="skeleton-shimmer mx-auto mt-4 h-8 w-16 rounded" />
          <div className="skeleton-shimmer mx-auto mt-3 h-4 w-28 rounded" />
        </div>
        <div className="rounded-lg border border-border-technical bg-white p-5">
          <div className="skeleton-shimmer h-5 w-44 rounded" />
          <div className="skeleton-shimmer mt-5 h-4 w-full rounded" />
          <div className="skeleton-shimmer mt-3 h-4 w-10/12 rounded" />
          <div className="skeleton-shimmer mt-3 h-4 w-8/12 rounded" />
        </div>
      </div>

      {[0, 1].map((item) => (
        <div key={item} className="rounded-lg border border-border-technical bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="w-full">
              <div className="skeleton-shimmer h-4 w-28 rounded" />
              <div className="skeleton-shimmer mt-3 h-5 w-8/12 rounded" />
              <div className="skeleton-shimmer mt-3 h-4 w-36 rounded" />
            </div>
            <div className="skeleton-shimmer h-8 w-24 rounded-full" />
          </div>
          <div className="skeleton-shimmer mt-5 h-4 w-full rounded" />
          <div className="skeleton-shimmer mt-3 h-4 w-9/12 rounded" />
        </div>
      ))}
    </div>
  );
}
