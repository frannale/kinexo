import Header from '@/components/layout/Header'

export default function EjerciciosPage() {
  return (
    <>
      <Header title="Ejercicios" subtitle="Biblioteca de ejercicios del centro" />
      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#e2e8f0] bg-white text-center">
          <p className="text-sm font-semibold text-[#94a3b8]">Próximamente</p>
          <p className="mt-1 text-xs text-[#c4d4e8]">La biblioteca de ejercicios estará disponible en breve.</p>
        </div>
      </main>
    </>
  )
}
