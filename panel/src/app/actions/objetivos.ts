'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function crearObjetivo(_prev: { error: string } | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const tratamientoId = formData.get('tratamientoId') as string
  const pacienteId    = formData.get('pacienteId') as string
  const descripcion   = (formData.get('descripcion') as string).trim()

  if (!descripcion) return { error: 'La descripción es obligatoria' }

  const parseNum = (key: string) => {
    const v = (formData.get(key) as string).trim()
    return v !== '' ? parseFloat(v) : null
  }

  try {
    await prisma.objetivoTratamiento.create({
      data: {
        tratamientoId,
        descripcion,
        indicadorNombre: (formData.get('indicadorNombre') as string).trim() || null,
        valorInicial:    parseNum('valorInicial'),
        valorActual:     parseNum('valorInicial'), // arranca igual al inicial
        valorObjetivo:   parseNum('valorObjetivo'),
        unidad:          (formData.get('unidad') as string).trim() || null,
      },
    })
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Error al guardar' }
  }

  redirect(`/pacientes/${pacienteId}/tratamientos/${tratamientoId}`)
}

export async function actualizarValorObjetivo(
  objetivoId: string,
  nuevoValor: number,
  pacienteId: string,
  tratamientoId: string,
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  try {
    await prisma.objetivoTratamiento.update({
      where: { id: objetivoId },
      data: { valorActual: nuevoValor },
    })
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Error al actualizar' }
  }

  redirect(`/pacientes/${pacienteId}/tratamientos/${tratamientoId}`)
}
