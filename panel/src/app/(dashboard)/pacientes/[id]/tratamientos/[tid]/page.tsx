import { prisma } from '@/lib/prisma'
import { getTenant } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import NuevoPlanForm from './NuevoPlanForm'
import AgregarEjercicioForm from './AgregarEjercicioForm'
import ObjetivosSection from './ObjetivosSection'

const estadoStyle: Record<string, string> = {
  ACTIVO:     'bg-green-50 text-green-600 border-green-100',
  PAUSADO:    'bg-amber-50 text-amber-600 border-amber-100',
  FINALIZADO: 'bg-slate-50 text-slate-500 border-slate-100',
}

const dificultadLabel: Record<string, string> = { BAJO: 'Básico', MEDIO: 'Intermedio', ALTO: 'Avanzado' }

export default async function TratamientoPage({
  params,
}: {
  params: Promise<{ id: string; tid: string }>
}) {
  const { id: pacienteId, tid } = await params
  const tenant = await getTenant()

  const [tratamiento, ejerciciosLibrary] = await Promise.all([
    prisma.tratamiento.findUnique({
      where: { id: tid },
      include: {
        paciente: { select: { id: true, nombre: true, apellido: true } },
        kinesiologo: { select: { nombre: true, apellido: true } },
        lesiones: { select: { id: true, nombre: true, zonaCorporal: true } },
        objetivos: {
          orderBy: { creadoEn: 'asc' },
          select: {
            id: true,
            descripcion: true,
            indicadorNombre: true,
            valorInicial: true,
            valorActual: true,
            valorObjetivo: true,
            unidad: true,
          },
        },
        evaluaciones: {
          orderBy: { fecha: 'desc' },
          take: 5,
          select: {
            id: true,
            fecha: true,
            nivelDolor: true,
            zonaCorporal: true,
            diagnostico: true,
            sintomas: true,
            movilidad: true,
            fuerza: true,
            funcionalidad: true,
            limitaciones: true,
            observacionesProfesional: true,
            kinesiologo: { select: { nombre: true, apellido: true } },
          },
        },
        planes: {
          where: { estado: 'ACTIVO' },
          orderBy: { creadoEn: 'desc' },
          take: 1,
          include: {
            planEjercicios: {
              where: { activo: true },
              orderBy: { orden: 'asc' },
              include: { ejercicio: { select: { nombre: true, zonaCorporal: true, dificultad: true } } },
            },
          },
        },
      },
    }),
    tenant
      ? prisma.ejercicio.findMany({
          where: {
            activo: true,
            OR: [{ centroId: tenant.centroId }, { centroId: null }],
          },
          orderBy: { nombre: 'asc' },
          select: { id: true, nombre: true, zonaCorporal: true, dificultad: true },
        })
      : [],
  ])

  if (!tratamiento) notFound()

  const plan = tratamiento.planes[0] ?? null

  return (
    <>
      <Header
        title={tratamiento.nombre}
        subtitle={`${tratamiento.paciente.nombre} ${tratamiento.paciente.apellido}`}
      />

      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="mb-4 flex items-center gap-4">
          <Link href={`/pacientes/${pacienteId}`} className="text-xs font-semibold text-[#4a9af4] hover:underline">
            ← Volver a la ficha
          </Link>
          {plan && (
            <Link
              href={`/sesion/${pacienteId}`}
              target="_blank"
              className="ml-auto rounded-xl border border-[#4a9af4] px-3 py-1.5 text-xs font-bold text-[#4a9af4] transition hover:bg-[#eaf4ff]"
            >
              Ver sesión del paciente ↗
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Info del tratamiento */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm lg:col-span-1">
            <h2 className="mb-4 text-sm font-bold text-[#1a3050]">Información</h2>
            <div className="flex flex-col gap-3 text-sm">
              <Row label="Estado">
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${estadoStyle[tratamiento.estado]}`}>
                  {tratamiento.estado}
                </span>
              </Row>
              <Row label="Kinesiólogo">
                {tratamiento.kinesiologo.apellido}, {tratamiento.kinesiologo.nombre}
              </Row>
              {tratamiento.zonaCorporal && <Row label="Zona">{tratamiento.zonaCorporal}</Row>}
              {tratamiento.motivoConsulta && <Row label="Motivo">{tratamiento.motivoConsulta}</Row>}
              {tratamiento.diagnostico && <Row label="Diagnóstico">{tratamiento.diagnostico}</Row>}
              <Row label="Inicio">{new Date(tratamiento.fechaInicio).toLocaleDateString('es-AR')}</Row>
              {tratamiento.fechaFinEstimada && (
                <Row label="Fin estimado">{new Date(tratamiento.fechaFinEstimada).toLocaleDateString('es-AR')}</Row>
              )}
            </div>

            {tratamiento.lesiones.length > 0 && (
              <div className="mt-5 pt-4 border-t border-[#f1f5f9]">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#94a3b8]">Lesiones</p>
                <div className="flex flex-wrap gap-1.5">
                  {tratamiento.lesiones.map((l) => (
                    <span
                      key={l.id}
                      className="rounded-full border border-[#e2e8f0] bg-[#f8fbff] px-3 py-1 text-xs font-semibold text-[#1a3050]"
                    >
                      {l.nombre}
                      {l.zonaCorporal && <span className="ml-1 text-[#94a3b8]">· {l.zonaCorporal}</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Plan activo */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm lg:col-span-2">
            <div className="border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-sm font-bold text-[#1a3050]">
                {plan ? `Plan activo: ${plan.nombre}` : 'Sin plan asignado'}
              </h2>
              {plan?.objetivo && (
                <p className="mt-0.5 text-xs text-[#64748b]">Objetivo: {plan.objetivo}</p>
              )}
              {plan?.frecuenciaSemanal && (
                <p className="text-xs text-[#94a3b8]">{plan.frecuenciaSemanal} sesiones por semana</p>
              )}
            </div>

            <div className="px-6 py-5">
              {/* Ejercicios del plan */}
              {plan && plan.planEjercicios.length > 0 ? (
                <div className="mb-4 flex flex-col gap-2">
                  {plan.planEjercicios.map((pe, idx) => (
                    <div key={pe.id} className="flex items-center gap-3 rounded-xl border border-[#f1f5f9] bg-[#f8fbff] px-4 py-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf4ff] text-xs font-extrabold text-[#4a9af4]">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#1a3050] truncate">{pe.ejercicio.nombre}</p>
                        <p className="text-xs text-[#94a3b8]">
                          {[
                            pe.series && pe.repeticiones && `${pe.series}×${pe.repeticiones}`,
                            pe.duracionSegundos && `${pe.duracionSegundos}s`,
                            pe.diasSemana.length > 0 && pe.diasSemana.join(' '),
                          ].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <span className="text-xs text-[#94a3b8]">{dificultadLabel[pe.ejercicio.dificultad]}</span>
                    </div>
                  ))}
                </div>
              ) : plan ? (
                <p className="mb-4 text-sm text-[#94a3b8]">Plan sin ejercicios aún. Agregá el primero.</p>
              ) : (
                <p className="mb-4 text-sm text-[#94a3b8]">Creá el primer plan para este tratamiento.</p>
              )}

              {/* Agregar ejercicio */}
              {plan && (
                <AgregarEjercicioForm
                  planId={plan.id}
                  tratamientoId={tid}
                  pacienteId={pacienteId}
                  ejercicios={ejerciciosLibrary}
                />
              )}

              {/* Crear plan */}
              <div className="mt-6 border-t border-[#f1f5f9] pt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">
                  {plan ? 'Crear nuevo plan (archiva el actual)' : 'Crear plan'}
                </p>
                <NuevoPlanForm
                  tratamientoId={tid}
                  pacienteId={pacienteId}
                  tieneplanActivo={!!plan}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Objetivos */}
        <ObjetivosSection
          tratamientoId={tid}
          pacienteId={pacienteId}
          objetivos={tratamiento.objetivos}
        />

        {/* Evaluaciones */}
        <div className="mt-6 rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
            <h2 className="text-sm font-bold text-[#1a3050]">Evaluaciones clínicas</h2>
            <Link
              href={`/pacientes/${pacienteId}/tratamientos/${tid}/evaluaciones/nueva`}
              className="rounded-xl bg-[#4a9af4] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#1a3050]"
            >
              + Nueva evaluación
            </Link>
          </div>

          <div className="px-6 py-5">
            {tratamiento.evaluaciones.length === 0 ? (
              <p className="text-sm text-[#94a3b8]">No hay evaluaciones registradas aún.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {tratamiento.evaluaciones.map((ev) => (
                  <div key={ev.id} className="rounded-xl border border-[#f1f5f9] bg-[#f8fbff] p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-xs font-bold text-[#1a3050]">
                        {new Date(ev.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      {ev.nivelDolor !== null && (
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${ev.nivelDolor <= 2 ? 'border-green-100 bg-green-50 text-green-700' : ev.nivelDolor <= 5 ? 'border-amber-100 bg-amber-50 text-amber-700' : 'border-red-100 bg-red-50 text-red-700'}`}>
                          Dolor {ev.nivelDolor}/10
                        </span>
                      )}
                      {ev.zonaCorporal && (
                        <span className="rounded-full border border-[#e2e8f0] bg-white px-2.5 py-0.5 text-xs text-[#64748b]">
                          {ev.zonaCorporal}
                        </span>
                      )}
                      <span className="ml-auto text-xs text-[#94a3b8]">
                        {ev.kinesiologo.apellido}, {ev.kinesiologo.nombre}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                      {ev.diagnostico && <EvalRow label="Diagnóstico" value={ev.diagnostico} />}
                      {ev.sintomas && <EvalRow label="Síntomas" value={ev.sintomas} />}
                      {ev.movilidad && <EvalRow label="Movilidad" value={ev.movilidad} />}
                      {ev.fuerza && <EvalRow label="Fuerza" value={ev.fuerza} />}
                      {ev.funcionalidad && <EvalRow label="Funcionalidad" value={ev.funcionalidad} />}
                      {ev.limitaciones && <EvalRow label="Limitaciones" value={ev.limitaciones} />}
                    </div>
                    {ev.observacionesProfesional && (
                      <p className="mt-2 text-xs italic text-[#64748b]">{ev.observacionesProfesional}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

function EvalRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold text-[#94a3b8]">{label}: </span>
      <span className="text-[#334155]">{value}</span>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-[#94a3b8]">{label}</span>
      <span className="font-medium text-[#334155]">{children}</span>
    </div>
  )
}
