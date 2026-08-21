export default function Loading() {
  return (
    <>
      <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-[#e2e8f0] bg-white px-8">
        <div className="h-4 w-28 animate-pulse rounded-lg bg-[#f1f5f9]" />
        <div className="h-9 w-36 animate-pulse rounded-xl bg-[#f1f5f9]" />
      </div>
      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="border-b border-[#e2e8f0] px-6 py-4">
            <div className="h-4 w-48 animate-pulse rounded-lg bg-[#f1f5f9]" />
          </div>
          <div className="divide-y divide-[#f1f5f9]">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="h-9 w-9 flex-shrink-0 animate-pulse rounded-full bg-[#f1f5f9]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-40 animate-pulse rounded-lg bg-[#f1f5f9]" />
                  <div className="h-3 w-28 animate-pulse rounded-lg bg-[#f1f5f9]" />
                </div>
                <div className="h-6 w-20 animate-pulse rounded-full bg-[#f1f5f9]" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
