import { prisma } from '@/lib/prisma'
import { getTenant } from '@/lib/tenant'
import Header from '@/components/layout/Header'

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">{label}</span>
      <span className="text-sm text-[#334155]">{value || '—'}</span>
    </div>
  )
}

export default async function ConfiguracionPage() {
  const tenant = await getTenant()

  const centro = tenant
    ? await prisma.centro.findUnique({ where: { id: tenant.centroId } })
    : null

  return (
    <>
      <Header title="Configuración" subtitle="Datos del centro" />

      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="mx-auto max-w-2xl flex flex-col gap-6">

          {/* Datos del centro */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#1a3050]">Datos del centro</h2>
              <button
                disabled
                className="rounded-xl border border-[#e2e8f0] px-3 py-1.5 text-xs font-semibold text-[#64748b] opacity-50 cursor-not-allowed"
                title="Próximamente"
              >
                Editar
              </button>
            </div>

            {centro ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Nombre"    value={centro.nombre} />
                <Field label="Slug"      value={centro.slug} />
                <Field label="Email"     value={centro.emailContacto} />
                <Field label="Teléfono"  value={centro.telefono} />
                <Field label="Dirección" value={centro.direccion} />
                <Field label="Estado"    value={centro.activo ? 'Activo' : 'Inactivo'} />
              </div>
            ) : (
              <p className="text-sm text-[#94a3b8]">No se pudo cargar la información del centro.</p>
            )}
          </div>

          {/* Secciones próximas */}
          {[
            { title: 'Notificaciones',   desc: 'Configurar alertas automáticas y umbrales de adherencia' },
            { title: 'Integraciones',    desc: 'WhatsApp, email y app mobile para pacientes' },
            { title: 'Plan y facturación', desc: 'Gestión de suscripción y métodos de pago' },
          ].map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-dashed border-[#e2e8f0] bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-bold text-[#94a3b8]">{s.title}</p>
              <p className="mt-1 text-xs text-[#c4d4e8]">{s.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
