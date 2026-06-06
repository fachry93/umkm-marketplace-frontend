export function UmkmSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-stone-100">
      <div className="h-20 bg-stone-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-shimmer" />
      </div>
      <div className="p-3 space-y-2">
        <div className="h-3 bg-stone-200 rounded-full w-2/3" />
        <div className="h-3 bg-stone-200 rounded-full w-1/3" />
        <div className="h-3 bg-stone-200 rounded-full w-1/2" />
      </div>
    </div>
  )
}
