'use server'

import { prisma } from '@/lib/prisma'
import { getTenant } from '@/lib/tenant'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAlertasNoLeidas() {
  const tenant = await getTenant()
  if (!tenant) return []

  return prisma.alerta.findMany({
    where: { centroId: tenant.centroId, leida: false },
    orderBy: { creadoEn: 'desc' },
    take: 30,
    select: {
      id: true,
      tipo: true,
      descripcion: true,
      leida: true,
      resuelta: true,
      creadoEn: true,
      paciente:    { select: { id: true, nombre: true, apellido: true } },
      tratamiento: { select: { id: true, nombre: true } },
    },
  })
}

export async function marcarAlertaLeida(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await prisma.alerta.update({ where: { id }, data: { leida: true } })
  revalidatePath('/', 'layout')
}

export async function marcarTodasLeidas() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const tenant = await getTenant()
  if (!tenant) return

  await prisma.alerta.updateMany({
    where: { centroId: tenant.centroId, leida: false },
    data: { leida: true },
  })
  revalidatePath('/', 'layout')
}
