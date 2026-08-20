import { prisma } from '@/lib/prisma'
import { getTenant } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import NuevoTratamientoForm from './NuevoTratamientoForm'

export default async function NuevoTratamientoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const tenant = await getTenant()

  const [paciente, usuarios, lesiones] = await Promise.all([
    prisma.paciente.findUnique({ where: { id }, select: { id: true, nombre: true, apellido: true } }),
    tenant
      ? prisma.usuario.findMany({
          where: { centroId: tenant.centroId, activo: true },
          orderBy: { apellido: 'asc' },
          select: { id: true, nombre: true, apellido: true, rol: true },
        })
      : [],
    tenant
      ? prisma.lesion.findMany({
          where: { activo: true, OR: [{ centroId: tenant.centroId }, { centroId: null }] },
          orderBy: [{ zonaCorporal: 'asc' }, { nombre: 'asc' }],
          select: { id: true, nombre: true, zonaCorporal: true },
        })
      : [],
  ])

  if (!paciente) notFound()

  return (
    <>
      <Header
        title="Nuevo tratamiento"
        subtitle={`Para ${paciente.nombre} ${paciente.apellido}`}
      />
      <main className="flex-1 overflow-y-auto bg-[#f6fbff] p-8">
        <div className="mx-auto max-w-2xl">
          <NuevoTratamientoForm
            pacienteId={paciente.id}
            pacienteNombre={`${paciente.nombre} ${paciente.apellido}`}
            usuarios={usuarios}
            lesiones={lesiones}
          />
        </div>
      </main>
    </>
  )
}
