export default function ServiceListItemSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 rounded-2xl border border-border bg-white px-4 py-4">
      <div className="h-14 w-14 shrink-0 rounded-2xl bg-surface" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded bg-surface" />
        <div className="h-3 w-1/2 rounded bg-surface" />
        <div className="h-3 w-1/3 rounded bg-surface" />
      </div>
    </div>
  )
}
