export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-stone-100">
      <div className="aspect-square bg-stone-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-shimmer" />
      </div>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-stone-200 rounded-full w-3/4 overflow-hidden relative">
          <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-shimmer" />
        </div>
        <div className="h-4 bg-stone-200 rounded-full w-1/2" />
        <div className="h-10 bg-stone-200 rounded-xl mt-2" />
      </div>
    </div>
  )
}
