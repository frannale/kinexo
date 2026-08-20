import { prisma } from '@/lib/prisma'
import { getTenant } from '@/lib/tenant'
import Header from '@/components/layout/Header'
import Link from 'next/link'

function StatCard({
  label, value, sub, accent = false,
}: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-[#64748b]">{label}</p>
      <p className={`mt-1 text-3xl font-extrabold tracking-tight ${accent ? 'text-red-500' : 'text-[#1a3050]'}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-[#94a3b8]">{sub}</p>
    </div>
  )
}

function Badge({ label, type }: { label: string; type: 'ok' | 'warn' | 'danger' }) {
  const styles = {
    ok:     'bg-green-50  text-green-600  border-green-100',
    warn:   'bg-amber-50  text-amber-600  border-amber-100',
    danger: 'bg-red-50    text-red-500    border-red-100',
  }
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${styles[type]}`}>
      {label}
    </span>
  )
}

export default async function DashboardPage() {
  const tenant = await getTenant()

  const [pacientesCount, alertasCount, tratamientosCount, pacientesRecientes] = tenant
    ? await Promise.all([
        prisma.paciente.count({ where: { centroId: tenant.centroId, activo: true } }),
        prisma.alerta.count({ where: { centroId: tenant.centroId, resuelta: false } }),
        prisma.tratamiento.count({ where: { centroId: tenant.centroId, estado: 'ACTIVO' } }),
        prisma.paciente.findMany({
          where: { centroId: tenant.centroId, activo: true },
          orderBy: { creadoEn: 'desc' },
          take: 5,
          include: {
            tratamientos: {
              where: { estado: 'ACTIVO' },
              take: 1,
              orderBy: { fechaInicio: 'desc' },
            },
          },
        }),
      ])
    : [0, 0, 0, []]

  return (
    <>
      <Header title="Dashboard" subtitle="Resumen del estado de tus pacientes" />

      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Pacientes activos"    value={String(pacientesCount)}    sub="Total en el centro" />
          <StatCard label="Adherencia promedio"  value="—"                          sub="Próximamente" />
          <StatCard label="Alertas pendientes"   value={String(alertasCount)}       sub="Sin resolver" accent={alertasCount > 0} />
          <StatCard label="Tratamientos activos" value={String(tratamientosCount)}  sub="En curso" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Pacientes recientes */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-sm font-bold text-[#1a3050]">Últimos pacientes</h2>
              <Link href="/pacientes" className="text-xs font-semibold text-[#4a9af4] hover:underline">
                Ver todos
              </Link>
            </div>

            {pacientesRecientes.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-center">
                <p className="text-sm text-[#94a3b8]">Sin pacientes aún</p>
                <Link href="/pacientes/nuevo" className="mt-1 text-xs font-semibold text-[#4a9af4] hover:underline">
                  Agregar el primero
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#f1f5f9]">
                {pacientesRecientes.map((p) => {
                  const initials = `${p.nombre[0]}${p.apellido[0]}`.toUpperCase()
                  const tratamiento = p.tratamientos[0]
                  const badgeType = tratamiento ? 'ok' : 'warn'
                  return (
                    <div key={p.id} className="flex items-center gap-4 px-6 py-3.5">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf4ff] text-xs font-bold text-[#4a9af4]">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold text-[#1a3050]">
                          {p.nombre} {p.apellido}
                        </p>
                        <p className="text-xs text-[#94a3b8]">
                          {tratamiento ? tratamiento.nombre : 'Sin tratamiento activo'}
                        </p>
                      </div>
                      <Badge
                        label={tratamiento ? 'Activo' : 'Sin plan'}
                        type={badgeType}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Alertas */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
            <div className="border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-sm font-bold text-[#1a3050]">Alertas pendientes</h2>
            </div>
            <div className="flex h-40 flex-col items-center justify-center text-center px-6">
              {alertasCount === 0 ? (
                <p className="text-sm text-[#94a3b8]">Sin alertas pendientes</p>
              ) : (
                <p className="text-sm font-semibold text-red-500">
                  {alertasCount} alerta{alertasCount !== 1 ? 's' : ''} sin resolver
                </p>
              )}
              <p className="mt-1 text-xs text-[#c4d4e8]">Módulo de alertas próximamente</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
