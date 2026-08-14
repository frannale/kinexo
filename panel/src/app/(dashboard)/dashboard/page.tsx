import Header from '@/components/layout/Header'

// ── Stat card ────────────────────────────────────────────────────────────────
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

// ── Badge ────────────────────────────────────────────────────────────────────
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

// ── Mock data ─────────────────────────────────────────────────────────────────
const pacientes = [
  { initials: 'ML', nombre: 'María López',   zona: 'Hombro',  dia: 14, adherencia: 94, estado: 'ok'     },
  { initials: 'CG', nombre: 'Carlos García', zona: 'Rodilla', dia: 8,  adherencia: 60, estado: 'warn'   },
  { initials: 'AR', nombre: 'Ana Ramírez',   zona: 'Lumbar',  dia: 21, adherencia: 45, estado: 'danger' },
  { initials: 'JP', nombre: 'Juan Peralta',  zona: 'Tobillo', dia: 5,  adherencia: 88, estado: 'ok'     },
  { initials: 'LS', nombre: 'Laura Sosa',    zona: 'Cervical',dia: 17, adherencia: 72, estado: 'warn'   },
]

const actividad = [
  { color: 'bg-green-400',  texto: 'María completó "Movilidad de hombro"',      tiempo: 'hace 8 min' },
  { color: 'bg-red-400',    texto: 'Ana reportó dolor 7/10 en "Extensión lumbar"', tiempo: 'hace 22 min' },
  { color: 'bg-amber-400',  texto: 'Carlos sin actividad desde el martes',       tiempo: 'hace 3 días' },
  { color: 'bg-green-400',  texto: 'Juan completó su sesión completa',           tiempo: 'hace 4 días' },
  { color: 'bg-amber-400',  texto: 'Laura completó 2 de 4 ejercicios',           tiempo: 'hace 4 días' },
]

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" subtitle="Resumen del estado de tus pacientes hoy" />

      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Pacientes activos"     value="24"   sub="↑ 2 esta semana" />
          <StatCard label="Adherencia promedio"   value="78%"  sub="Últimos 7 días" />
          <StatCard label="Alertas pendientes"    value="3"    sub="Requieren atención" accent />
          <StatCard label="Tratamientos activos"  value="19"   sub="5 finalizan este mes" />
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Pacientes */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-sm font-bold text-[#1a3050]">Pacientes activos</h2>
              <a href="/pacientes" className="text-xs font-semibold text-[#4a9af4] hover:underline">
                Ver todos
              </a>
            </div>
            <div className="divide-y divide-[#f1f5f9]">
              {pacientes.map((p) => (
                <div key={p.nombre} className="flex items-center gap-4 px-6 py-3.5">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf4ff] text-xs font-bold text-[#4a9af4]">
                    {p.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-[#1a3050]">{p.nombre}</p>
                    <p className="text-xs text-[#94a3b8]">{p.zona} · Día {p.dia}</p>
                  </div>
                  <Badge
                    label={p.estado === 'danger' ? 'Alerta' : `${p.adherencia}%`}
                    type={p.estado as 'ok' | 'warn' | 'danger'}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
            <div className="border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-sm font-bold text-[#1a3050]">Actividad reciente</h2>
            </div>
            <div className="divide-y divide-[#f1f5f9]">
              {actividad.map((a, i) => (
                <div key={i} className="flex items-start gap-4 px-6 py-4">
                  <span className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${a.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#334155]">{a.texto}</p>
                    <p className="mt-0.5 text-xs text-[#94a3b8]">{a.tiempo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
