export default function Loading() {
  return (
    <>
      <div className="flex h-16 flex-shrink-0 items-center border-b border-[#e2e8f0] bg-white px-8">
        <div className="h-4 w-44 animate-pulse rounded-lg bg-[#f1f5f9]" />
      </div>
      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="mb-4 h-4 w-32 animate-pulse rounded-lg bg-[#e2e8f0]" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <div className="mb-4 h-4 w-24 animate-pulse rounded-lg bg-[#f1f5f9]" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-2.5 w-16 animate-pulse rounded bg-[#f1f5f9]" />
                  <div className="h-3.5 w-32 animate-pulse rounded bg-[#f1f5f9]" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm lg:col-span-2">
            <div className="border-b border-[#e2e8f0] px-6 py-4">
              <div className="h-4 w-40 animate-pulse rounded-lg bg-[#f1f5f9]" />
            </div>
            <div className="space-y-3 px-6 py-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-[#f1f5f9] bg-[#f8fbff] px-4 py-3">
                  <div className="h-6 w-6 flex-shrink-0 animate-pulse rounded-full bg-[#e2e8f0]" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-48 animate-pulse rounded bg-[#f1f5f9]" />
                    <div className="h-3 w-32 animate-pulse rounded bg-[#f1f5f9]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
