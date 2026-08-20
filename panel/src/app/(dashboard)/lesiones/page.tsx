import { prisma } from '@/lib/prisma'
import { getTenant } from '@/lib/tenant'
import Header from '@/components/layout/Header'
import Link from 'next/link'

export default async function LesionesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const tenant = await getTenant()
  const { q } = await searchParams

  const lesiones = tenant
    ? await prisma.lesion.findMany({
        where: {
          activo: true,
          AND: [
            { OR: [{ centroId: tenant.centroId }, { centroId: null }] },
            ...(q
              ? [{ OR: [
                  { nombre: { contains: q, mode: 'insensitive' as const } },
                  { zonaCorporal: { contains: q, mode: 'insensitive' as const } },
                ]}]
              : []),
          ],
        },
        orderBy: [{ centroId: 'asc' }, { nombre: 'asc' }],
        include: { _count: { select: { tratamientos: true } } },
      })
    : []

  const globales = lesiones.filter((l) => l.centroId === null)
  const propias  = lesiones.filter((l) => l.centroId !== null)

  return (
    <>
      <Header
        title="Lesiones"
        subtitle={`${lesiones.length} lesión${lesiones.length !== 1 ? 'es' : ''} en el catálogo`}
      />

      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <form className="flex-1 max-w-sm">
            <input
              name="q"
              defaultValue={q}
              type="search"
              placeholder="Buscar por nombre o zona..."
              className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm outline-none placeholder:text-[#94a3b8] focus:border-[#4a9af4] focus:ring-2 focus:ring-[#4a9af4]/10"
            />
          </form>
          <Link
            href="/lesiones/nuevo"
            className="rounded-xl bg-[#4a9af4] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1a3050]"
          >
            + Nueva lesión
          </Link>
        </div>

        <div className="flex flex-col gap-8">
          {propias.length > 0 && (
            <Section title="Del centro" lesiones={propias} />
          )}
          <Section title="Catálogo general" lesiones={globales} empty={lesiones.length === 0} busqueda={q} />
        </div>
      </main>
    </>
  )
}

function Section({
  title,
  lesiones,
  empty,
  busqueda,
}: {
  title: string
  lesiones: Array<{ id: string; nombre: string; zonaCorporal: string | null; descripcion: string | null; centroId: string | null; _count: { tratamientos: number } }>
  empty?: boolean
  busqueda?: string
}) {
  if (lesiones.length === 0 && !empty) return null

  return (
    <div>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#94a3b8]">{title}</h2>
      {lesiones.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-[#e2e8f0] bg-white">
          <p className="text-sm text-[#94a3b8]">
            {busqueda ? 'Sin resultados para esa búsqueda' : 'No hay lesiones en el catálogo'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] text-left text-xs font-bold uppercase tracking-wide text-[#64748b]">
                <th className="px-6 py-3">Lesión</th>
                <th className="px-6 py-3">Zona</th>
                <th className="px-6 py-3">Descripción</th>
                <th className="px-6 py-3 text-right">Usos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {lesiones.map((l) => (
                <tr key={l.id} className="hover:bg-[#f8fbff] transition">
                  <td className="px-6 py-3.5 font-semibold text-[#1a3050]">{l.nombre}</td>
                  <td className="px-6 py-3.5">
                    {l.zonaCorporal ? (
                      <span className="rounded-full bg-[#eaf4ff] px-2.5 py-0.5 text-xs font-semibold text-[#4a9af4]">
                        {l.zonaCorporal}
                      </span>
                    ) : <span className="text-[#c4d4e8]">—</span>}
                  </td>
                  <td className="px-6 py-3.5 text-[#64748b] max-w-xs truncate">{l.descripcion ?? '—'}</td>
                  <td className="px-6 py-3.5 text-right text-[#94a3b8]">
                    {l._count.tratamientos > 0 ? (
                      <span className="font-semibold text-[#1a3050]">{l._count.tratamientos}</span>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
