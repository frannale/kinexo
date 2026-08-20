import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import SesionView from './SesionView'

const DIA_SEMANA: Record<number, string> = {
  0: 'DOM',
  1: 'LUN',
  2: 'MAR',
  3: 'MIE',
  4: 'JUE',
  5: 'VIE',
  6: 'SAB',
}

export default async function SesionPage({
  params,
}: {
  params: Promise<{ pacienteId: string }>
}) {
  const { pacienteId } = await params

  const paciente = await prisma.paciente.findUnique({
    where: { id: pacienteId, activo: true },
    include: {
      tratamientos: {
        where: { estado: 'ACTIVO' },
        orderBy: { creadoEn: 'desc' },
        take: 1,
        include: {
          planes: {
            where: { estado: 'ACTIVO' },
            orderBy: { creadoEn: 'desc' },
            take: 1,
            include: {
              planEjercicios: {
                where: { activo: true },
                orderBy: { orden: 'asc' },
                include: { ejercicio: true },
              },
            },
          },
        },
      },
    },
  })

  if (!paciente) notFound()

  const tratamiento = paciente.tratamientos[0]
  const plan = tratamiento?.planes[0]

  if (!plan) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-10 shadow-sm">
          <p className="text-2xl mb-3">🏋️</p>
          <p className="font-bold text-[#1a3050] text-lg mb-2">Sin plan asignado</p>
          <p className="text-[#64748b] text-sm">
            No tenés un plan asignado aún.
            <br />
            Tu kinesiólogo lo configurará pronto.
          </p>
        </div>
      </div>
    )
  }

  const hoy = new Date()
  const diaHoy = DIA_SEMANA[hoy.getDay()]

  const ejerciciosHoy = plan.planEjercicios.filter((pe) => {
    if (!pe.diasSemana || pe.diasSemana.length === 0) return true
    return pe.diasSemana.includes(diaHoy)
  })

  return (
    <SesionView
      pacienteNombre={`${paciente.nombre} ${paciente.apellido}`}
      planId={plan.id}
      pacienteId={paciente.id}
      ejercicios={ejerciciosHoy.map((pe) => ({
        planEjercicioId: pe.id,
        nombre: pe.ejercicio.nombre,
        zonaCorporal: pe.ejercicio.zonaCorporal ?? null,
        dificultad: pe.ejercicio.dificultad,
        series: pe.series ?? null,
        repeticiones: pe.repeticiones ?? null,
        duracionSegundos: pe.duracionSegundos ?? null,
        instrucciones: pe.instruccionesEspecificas ?? pe.ejercicio.instrucciones ?? null,
      }))}
    />
  )
}
