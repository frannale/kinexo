import Header from '@/components/layout/Header'
import NuevoPacienteForm from './NuevoPacienteForm'

export default function NuevoPacientePage() {
  return (
    <>
      <Header title="Nuevo paciente" subtitle="Completar los datos del paciente" />
      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="mx-auto max-w-2xl">
          <NuevoPacienteForm />
        </div>
      </main>
    </>
  )
}
