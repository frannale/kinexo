export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#f6fbff]">
      <p className="text-6xl font-extrabold text-[#e2e8f0]">404</p>
      <h1 className="mt-4 text-xl font-bold text-[#1a3050]">Centro no encontrado</h1>
      <p className="mt-2 text-sm text-[#94a3b8]">
        El subdominio no corresponde a ningún centro registrado.
      </p>
    </div>
  )
}
