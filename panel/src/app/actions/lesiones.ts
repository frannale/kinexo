'use server'

import { prisma } from '@/lib/prisma'
import { getTenant } from '@/lib/tenant'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function crearLesion(_prev: { error: string } | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const tenant = await getTenant()
  if (!tenant) return { error: 'Centro no encontrado' }

  const nombre = (formData.get('nombre') as string).trim()
  if (!nombre) return { error: 'El nombre es obligatorio' }

  try {
    await prisma.lesion.create({
      data: {
        centroId: tenant.centroId,
        nombre,
        descripcion: (formData.get('descripcion') as string).trim() || null,
        zonaCorporal: (formData.get('zonaCorporal') as string).trim() || null,
      },
    })
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Error al guardar' }
  }

  redirect('/lesiones')
}
