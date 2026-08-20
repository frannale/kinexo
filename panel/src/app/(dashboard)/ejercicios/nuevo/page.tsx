import Header from '@/components/layout/Header'
import EjercicioForm from './EjercicioForm'

export default function NuevoEjercicioPage() {
  return (
    <>
      <Header title="Nuevo ejercicio" subtitle="Agregar a la biblioteca del centro" />
      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="mx-auto max-w-2xl">
          <EjercicioForm />
        </div>
      </main>
    </>
  )
}
