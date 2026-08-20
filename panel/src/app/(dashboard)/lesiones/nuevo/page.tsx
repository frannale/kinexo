import Header from '@/components/layout/Header'
import LesionForm from './LesionForm'

export default function NuevaLesionPage() {
  return (
    <>
      <Header title="Nueva lesión" subtitle="Agregar al catálogo del centro" />
      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="mx-auto max-w-lg">
          <LesionForm />
        </div>
      </main>
    </>
  )
}
