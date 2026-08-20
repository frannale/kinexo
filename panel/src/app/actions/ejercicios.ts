'use server'

import { prisma } from '@/lib/prisma'
import { getTenant } from '@/lib/tenant'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function crearEjercicio(_prev: { error: string } | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const tenant = await getTenant()
  if (!tenant) return { error: 'Centro no encontrado' }

  const nombre = (formData.get('nombre') as string).trim()
  if (!nombre) return { error: 'El nombre es obligatorio' }

  try {
    await prisma.ejercicio.create({
      data: {
        centroId: tenant.centroId,
        nombre,
        descripcion: (formData.get('descripcion') as string).trim() || null,
        instrucciones: (formData.get('instrucciones') as string).trim() || null,
        zonaCorporal: (formData.get('zonaCorporal') as string).trim() || null,
        objetivo: (formData.get('objetivo') as string).trim() || null,
        dificultad: ((formData.get('dificultad') as string) || 'MEDIO') as 'BAJO' | 'MEDIO' | 'ALTO',
        equipamiento: (formData.get('equipamiento') as string).trim() || null,
        precauciones: (formData.get('precauciones') as string).trim() || null,
      },
    })
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Error al guardar' }
  }

  redirect('/ejercicios')
}
