import { prisma } from '@/lib/prisma'
import { getTenant } from '@/lib/tenant'
import Header from '@/components/layout/Header'
import Link from 'next/link'

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const tenant = await getTenant()
  const { q } = await searchParams

  const pacientes = tenant
    ? await prisma.paciente.findMany({
        where: {
          centroId: tenant.centroId,
          activo: true,
          ...(q
            ? {
                OR: [
                  { nombre: { contains: q, mode: 'insensitive' } },
                  { apellido: { contains: q, mode: 'insensitive' } },
                  { email: { contains: q, mode: 'insensitive' } },
                  { documento: { contains: q, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
        orderBy: { apellido: 'asc' },
      })
    : []

  return (
    <>
      <Header
        title="Pacientes"
        subtitle={`${pacientes.length} paciente${pacientes.length !== 1 ? 's' : ''} activo${pacientes.length !== 1 ? 's' : ''}`}
      />

      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <form className="flex-1 max-w-sm">
            <input
              name="q"
              defaultValue={q}
              type="search"
              placeholder="Buscar por nombre, email o documento..."
              className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm text-[#0f1f3d] outline-none placeholder:text-[#94a3b8] focus:border-[#4a9af4] focus:ring-2 focus:ring-[#4a9af4]/10"
            />
          </form>
          <Link
            href="/pacientes/nuevo"
            className="rounded-xl bg-[#4a9af4] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1a3050]"
          >
            + Nuevo paciente
          </Link>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm overflow-hidden">
          {pacientes.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center">
              <p className="text-sm font-semibold text-[#94a3b8]">
                {q ? 'Sin resultados para esa búsqueda' : 'No hay pacientes aún'}
              </p>
              {!q && (
                <Link
                  href="/pacientes/nuevo"
                  className="mt-2 text-xs font-semibold text-[#4a9af4] hover:underline"
                >
                  Agregar el primero
                </Link>
              )}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-left text-xs font-bold uppercase tracking-wide text-[#64748b]">
                  <th className="px-6 py-3">Paciente</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Teléfono</th>
                  <th className="px-6 py-3">Documento</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {pacientes.map((p) => {
                  const initials = `${p.nombre[0]}${p.apellido[0]}`.toUpperCase()
                  return (
                    <tr key={p.id} className="hover:bg-[#f8fbff] transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf4ff] text-xs font-bold text-[#4a9af4]">
                            {initials}
                          </div>
                          <span className="font-semibold text-[#1a3050]">
                            {p.apellido}, {p.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#64748b]">{p.email ?? '—'}</td>
                      <td className="px-6 py-4 text-[#64748b]">{p.telefono ?? '—'}</td>
                      <td className="px-6 py-4 text-[#64748b]">{p.documento ?? '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/pacientes/${p.id}`}
                          className="text-xs font-semibold text-[#4a9af4] hover:underline"
                        >
                          Ver ficha
                        </Link>
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
