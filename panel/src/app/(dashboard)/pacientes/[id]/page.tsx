import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Link from 'next/link'

function calcularEdad(fecha: Date | null): string {
  if (!fecha) return '—'
  const hoy = new Date()
  const edad = hoy.getFullYear() - fecha.getFullYear()
  const m = hoy.getMonth() - fecha.getMonth()
  return `${m < 0 || (m === 0 && hoy.getDate() < fecha.getDate()) ? edad - 1 : edad} años`
}

const estadoStyles: Record<string, string> = {
  ACTIVO:     'bg-green-50 text-green-600 border-green-100',
  PAUSADO:    'bg-amber-50 text-amber-600 border-amber-100',
  FINALIZADO: 'bg-slate-50 text-slate-500 border-slate-100',
}

export default async function PacienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const paciente = await prisma.paciente.findUnique({
    where: { id },
    include: {
      tratamientos: {
        orderBy: { creadoEn: 'desc' },
        include: { kinesiologo: { select: { nombre: true, apellido: true } } },
      },
    },
  })

  if (!paciente) notFound()

  const initials = `${paciente.nombre[0]}${paciente.apellido[0]}`.toUpperCase()

  return (
    <>
      <Header
        title={`${paciente.nombre} ${paciente.apellido}`}
        subtitle="Ficha del paciente"
      />

      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="mb-4">
          <Link
            href="/pacientes"
            className="text-xs font-semibold text-[#4a9af4] hover:underline"
          >
            ← Volver a pacientes
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Info principal */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm lg:col-span-1">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf4ff] text-lg font-extrabold text-[#4a9af4]">
                {initials}
              </div>
              <div>
                <p className="font-bold text-[#1a3050]">
                  {paciente.nombre} {paciente.apellido}
                </p>
                <p className="text-xs text-[#94a3b8]">{calcularEdad(paciente.fechaNacimiento)}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <Row label="DNI" value={paciente.documento} />
              <Row label="Email" value={paciente.email} />
              <Row label="Teléfono" value={paciente.telefono} />
              <Row
                label="Nacimiento"
                value={
                  paciente.fechaNacimiento
                    ? paciente.fechaNacimiento.toLocaleDateString('es-AR')
                    : null
                }
              />
              {paciente.contactoEmergenciaNombre && (
                <Row
                  label="Emergencia"
                  value={`${paciente.contactoEmergenciaNombre} ${paciente.contactoEmergenciaTel ?? ''}`}
                />
              )}
            </div>

            {paciente.informacionRelevante && (
              <div className="mt-5 rounded-xl bg-[#f8fbff] p-4">
                <p className="mb-1 text-xs font-bold text-[#64748b] uppercase tracking-wide">
                  Info relevante
                </p>
                <p className="text-sm text-[#334155]">{paciente.informacionRelevante}</p>
              </div>
            )}
          </div>

          {/* Tratamientos */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-sm font-bold text-[#1a3050]">Tratamientos</h2>
              <Link
                href={`/pacientes/${paciente.id}/tratamientos/nuevo`}
                className="rounded-xl bg-[#4a9af4] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#1a3050]"
              >
                + Nuevo tratamiento
              </Link>
            </div>

            {paciente.tratamientos.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-center">
                <p className="text-sm text-[#94a3b8]">Sin tratamientos registrados</p>
              </div>
            ) : (
              <div className="divide-y divide-[#f1f5f9]">
                {paciente.tratamientos.map((t) => (
                  <div key={t.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm text-[#1a3050]">{t.nombre}</p>
                        {t.motivoConsulta && (
                          <p className="mt-0.5 text-xs text-[#64748b]">{t.motivoConsulta}</p>
                        )}
                        <p className="mt-1 text-xs text-[#94a3b8]">
                          {t.kinesiologo.nombre} {t.kinesiologo.apellido} ·{' '}
                          {new Date(t.fechaInicio).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${estadoStyles[t.estado] ?? ''}`}
                      >
                        {t.estado}
                      </span>
                    </div>
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

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-[#94a3b8]">{label}</span>
      <span className="font-medium text-[#334155] text-right">{value ?? '—'}</span>
    </div>
  )
}
