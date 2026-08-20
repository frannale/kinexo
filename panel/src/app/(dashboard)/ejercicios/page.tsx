import { prisma } from '@/lib/prisma'
import { getTenant } from '@/lib/tenant'
import Header from '@/components/layout/Header'
import Link from 'next/link'

const dificultadStyle: Record<string, string> = {
  BAJO:  'bg-emerald-50 text-emerald-600 border-emerald-100',
  MEDIO: 'bg-amber-50   text-amber-600   border-amber-100',
  ALTO:  'bg-rose-50    text-rose-600    border-rose-100',
}
const dificultadLabel: Record<string, string> = {
  BAJO: 'Básico', MEDIO: 'Intermedio', ALTO: 'Avanzado',
}

export default async function EjerciciosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const tenant = await getTenant()
  const { q } = await searchParams

  const ejercicios = tenant
    ? await prisma.ejercicio.findMany({
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
      })
    : []

  return (
    <>
      <Header
        title="Ejercicios"
        subtitle={`${ejercicios.length} ejercicio${ejercicios.length !== 1 ? 's' : ''} en la biblioteca`}
      />

      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <form className="flex-1 max-w-sm">
            <input
              name="q"
              defaultValue={q}
              type="search"
              placeholder="Buscar por nombre o zona corporal..."
              className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm outline-none placeholder:text-[#94a3b8] focus:border-[#4a9af4] focus:ring-2 focus:ring-[#4a9af4]/10"
            />
          </form>
          <Link
            href="/ejercicios/nuevo"
            className="rounded-xl bg-[#4a9af4] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1a3050]"
          >
            + Nuevo ejercicio
          </Link>
        </div>

        {ejercicios.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#e2e8f0] bg-white text-center">
            <p className="text-sm font-semibold text-[#94a3b8]">
              {q ? 'Sin resultados' : 'La biblioteca está vacía'}
            </p>
            {!q && (
              <Link href="/ejercicios/nuevo" className="mt-2 text-xs font-semibold text-[#4a9af4] hover:underline">
                Agregar el primero
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ejercicios.map((e) => (
              <div key={e.id} className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="font-bold text-[#1a3050] leading-snug">{e.nombre}</h3>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold flex-shrink-0 ${dificultadStyle[e.dificultad]}`}>
                    {dificultadLabel[e.dificultad]}
                  </span>
                </div>
                {e.zonaCorporal && (
                  <p className="mb-2 text-xs font-semibold text-[#4a9af4]">{e.zonaCorporal}</p>
                )}
                {e.descripcion && (
                  <p className="text-sm text-[#64748b] line-clamp-2">{e.descripcion}</p>
                )}
                {e.equipamiento && (
                  <p className="mt-2 text-xs text-[#94a3b8]">Equipo: {e.equipamiento}</p>
                )}
                <div className="mt-3 pt-3 border-t border-[#f1f5f9]">
                  <span className="text-xs text-[#c4d4e8]">
                    {e.centroId ? 'Tu biblioteca' : 'Biblioteca general'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
