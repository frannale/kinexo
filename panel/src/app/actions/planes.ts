'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function crearPlan(_prev: { error: string } | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const tratamientoId = formData.get('tratamientoId') as string
  const pacienteId = formData.get('pacienteId') as string
  const nombre = (formData.get('nombre') as string).trim()

  if (!nombre) return { error: 'El nombre del plan es obligatorio' }

  try {
    await prisma.plan.updateMany({
      where: { tratamientoId, estado: 'ACTIVO' },
      data: { estado: 'ARCHIVADO', motivoCambio: 'Reemplazado por nuevo plan' },
    })

    const str = (key: string) => (formData.get(key) as string | null)?.trim() || null

    await prisma.plan.create({
      data: {
        tratamientoId,
        nombre,
        objetivo: str('objetivo'),
        frecuenciaSemanal: str('frecuenciaSemanal') ? parseInt(formData.get('frecuenciaSemanal') as string) : null,
        instrucciones: str('instrucciones'),
        recomendaciones: str('recomendaciones'),
      },
    })
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Error al guardar el plan' }
  }

  redirect(`/pacientes/${pacienteId}/tratamientos/${tratamientoId}`)
}

export async function agregarEjercicioAPlan(_prev: { error: string } | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const planId = formData.get('planId') as string
  const tratamientoId = formData.get('tratamientoId') as string
  const pacienteId = formData.get('pacienteId') as string
  const ejercicioId = formData.get('ejercicioId') as string

  if (!ejercicioId) return { error: 'Seleccioná un ejercicio' }

  const diasSemana = formData.getAll('diasSemana') as string[]

  try {
    const agg = await prisma.planEjercicio.aggregate({
      where: { planId },
      _max: { orden: true },
    })

    await prisma.planEjercicio.create({
      data: {
        planId,
        ejercicioId,
        series: (formData.get('series') as string) ? parseInt(formData.get('series') as string) : null,
        repeticiones: (formData.get('repeticiones') as string) ? parseInt(formData.get('repeticiones') as string) : null,
        duracionSegundos: (formData.get('duracionSegundos') as string) ? parseInt(formData.get('duracionSegundos') as string) : null,
        frecuenciaSemanal: (formData.get('frecuenciaSemanal') as string) ? parseInt(formData.get('frecuenciaSemanal') as string) : null,
        diasSemana,
        orden: (agg._max.orden ?? 0) + 1,
        instruccionesEspecificas: (formData.get('instruccionesEspecificas') as string).trim() || null,
      },
    })
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Error al agregar ejercicio' }
  }

  redirect(`/pacientes/${pacienteId}/tratamientos/${tratamientoId}`)
}

export async function quitarEjercicioDePlan(planEjercicioId: string, pacienteId: string, tratamientoId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  try {
    await prisma.planEjercicio.update({
      where: { id: planEjercicioId },
      data: { activo: false },
    })
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Error al quitar ejercicio' }
  }

  redirect(`/pacientes/${pacienteId}/tratamientos/${tratamientoId}`)
}
