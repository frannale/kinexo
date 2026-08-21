export default function Loading() {
  return (
    <>
      {/* Header skeleton */}
      <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-[#e2e8f0] bg-white px-8">
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-36 animate-pulse rounded-lg bg-[#f1f5f9]" />
          <div className="h-3 w-24 animate-pulse rounded-lg bg-[#f1f5f9]" />
        </div>
      </div>

      {/* Content skeleton */}
      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="mb-6 h-8 w-48 animate-pulse rounded-xl bg-[#e2e8f0]" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
              <div className="mb-4 h-4 w-3/4 animate-pulse rounded-lg bg-[#f1f5f9]" />
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded-lg bg-[#f1f5f9]" />
                <div className="h-3 w-5/6 animate-pulse rounded-lg bg-[#f1f5f9]" />
                <div className="h-3 w-4/6 animate-pulse rounded-lg bg-[#f1f5f9]" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
