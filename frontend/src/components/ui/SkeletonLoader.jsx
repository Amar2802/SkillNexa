export const CardSkeleton = () => (
  <div className="snx-card space-y-4 animate-pulse">
    <div className="snx-skeleton-text h-6 w-2/3" />
    <div className="space-y-2">
      <div className="snx-skeleton-text" />
      <div className="snx-skeleton-text w-5/6" />
    </div>
    <div className="flex gap-2">
      <div className="snx-skeleton h-8 w-20 rounded" />
      <div className="snx-skeleton h-8 w-20 rounded" />
    </div>
  </div>
);

export const ListSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => <CardSkeleton key={i} />)}
  </div>
);

export const StatsSkeleton = () => (
  <div className="snx-grid-auto">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="snx-stat space-y-3 animate-pulse">
        <div className="snx-skeleton-text h-4 w-20" />
        <div className="snx-skeleton h-10 w-1/2 rounded" />
      </div>
    ))}
  </div>
);

export const TableSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4 animate-pulse">
        <div className="snx-skeleton h-12 w-12 rounded" />
        <div className="flex-1 space-y-2">
          <div className="snx-skeleton-text h-4 w-1/3" />
          <div className="snx-skeleton-text h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);
