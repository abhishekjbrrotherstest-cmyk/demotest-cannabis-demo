import { SkeletonList } from '../ui/Skeleton';

export default function AdminPage({ title, subtitle, loading = false, error, children, actions }) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-800">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-brand-600">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {error && <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {loading ? <SkeletonList count={4} /> : children}
    </div>
  );
}