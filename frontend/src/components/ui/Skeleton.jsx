export function SkeletonBox({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-brand-100/80 ${className}`} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="card-base p-5">
      <SkeletonBox className="mb-4 h-40 w-full rounded-xl" />
      <SkeletonBox className="mb-2 h-4 w-3/4" />
      <SkeletonBox className="mb-4 h-4 w-1/2" />
      <SkeletonBox className="h-10 w-full rounded-xl" />
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-base p-5">
          <SkeletonBox className="mb-2 h-4 w-1/2" />
          <SkeletonBox className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}