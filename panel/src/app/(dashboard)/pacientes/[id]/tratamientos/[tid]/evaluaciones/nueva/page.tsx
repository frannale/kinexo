import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Link from 'next/link'
import NuevaEvaluacionForm from './NuevaEvaluacionForm'

export default async function NuevaEvaluacionPage({
  params,
}: {
  params: Promise<{ id: string; tid: string }>
}) {
  const { id: pacienteId, tid } = await params

  const tratamiento = await prisma.tratamiento.findUnique({
    where: { id: tid },
    select: {
      id: true,
      nombre: true,
      paciente: { select: { nombre: true, apellido: true } },
    },
  })

  if (!tratamiento) notFound()

  return (
    <>
      <Header
        title="Nueva evaluación"
        subtitle={`${tratamiento.nombre} · ${tratamiento.paciente.nombre} ${tratamiento.paciente.apellido}`}
      />
      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="mb-4">
          <Link
            href={`/pacientes/${pacienteId}/tratamientos/${tid}`}
            className="text-xs font-semibold text-[#4a9af4] hover:underline"
          >
            ← Volver al tratamiento
          </Link>
        </div>
        <div className="mx-auto max-w-2xl">
          <NuevaEvaluacionForm tratamientoId={tid} pacienteId={pacienteId} />
        </div>
      </main>
    </>
  )
}
