import { prisma } from '@/lib/prisma'
import { getTenant } from '@/lib/tenant'
import Header from '@/components/layout/Header'

const rolLabel: Record<string, string> = {
  ADMIN_CENTRO:   'Admin',
  KINESIOLOGO:    'Kinesiólogo',
  RECEPCIONISTA:  'Recepcionista',
}

const rolStyle: Record<string, string> = {
  ADMIN_CENTRO:  'bg-purple-50 text-purple-600 border-purple-100',
  KINESIOLOGO:   'bg-blue-50   text-blue-600   border-blue-100',
  RECEPCIONISTA: 'bg-slate-50  text-slate-500  border-slate-100',
}

export default async function KinesiologosPage() {
  const tenant = await getTenant()

  const usuarios = tenant
    ? await prisma.usuario.findMany({
        where: { centroId: tenant.centroId, activo: true },
        orderBy: { apellido: 'asc' },
      })
    : []

  return (
    <>
      <Header
        title="Equipo"
        subtitle={`${usuarios.length} miembro${usuarios.length !== 1 ? 's' : ''} del centro`}
      />

      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="mb-6 flex justify-end">
          <button
            disabled
            className="rounded-xl bg-[#4a9af4] px-4 py-2.5 text-sm font-bold text-white opacity-50 cursor-not-allowed"
            title="Próximamente"
          >
            + Invitar miembro
          </button>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm overflow-hidden">
          {usuarios.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center">
              <p className="text-sm text-[#94a3b8]">Sin miembros registrados</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-left text-xs font-bold uppercase tracking-wide text-[#64748b]">
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {usuarios.map((u) => {
                  const initials = `${u.nombre[0]}${u.apellido[0]}`.toUpperCase()
                  return (
                    <tr key={u.id} className="hover:bg-[#f8fbff] transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf4ff] text-xs font-bold text-[#4a9af4]">
                            {initials}
                          </div>
                          <span className="font-semibold text-[#1a3050]">
                            {u.apellido}, {u.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#64748b]">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${rolStyle[u.rol] ?? ''}`}>
                          {rolLabel[u.rol] ?? u.rol}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  )
}
