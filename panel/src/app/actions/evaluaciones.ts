'use server'

import { prisma } from '@/lib/prisma'
import { getTenant } from '@/lib/tenant'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function crearEvaluacion(_prev: { error: string } | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const tenant = await getTenant()
  if (!tenant) return { error: 'Centro no encontrado' }

  const usuario = await prisma.usuario.findFirst({
    where: { supabaseAuthId: user.id, centroId: tenant.centroId },
    select: { id: true },
  })
  if (!usuario) return { error: 'Usuario no encontrado' }

  const tratamientoId = formData.get('tratamientoId') as string
  const pacienteId    = formData.get('pacienteId') as string
  const nivelDolorRaw = formData.get('nivelDolor') as string

  try {
    await prisma.evaluacion.create({
      data: {
        tratamientoId,
        kinesiologoId: usuario.id,
        nivelDolor:    nivelDolorRaw !== '' ? parseInt(nivelDolorRaw) : null,
        zonaCorporal:  (formData.get('zonaCorporal') as string).trim() || null,
        diagnostico:   (formData.get('diagnostico') as string).trim() || null,
        antecedentes:  (formData.get('antecedentes') as string).trim() || null,
        sintomas:      (formData.get('sintomas') as string).trim() || null,
        movilidad:     (formData.get('movilidad') as string).trim() || null,
        fuerza:        (formData.get('fuerza') as string).trim() || null,
        funcionalidad: (formData.get('funcionalidad') as string).trim() || null,
        limitaciones:  (formData.get('limitaciones') as string).trim() || null,
        observacionesProfesional: (formData.get('observacionesProfesional') as string).trim() || null,
      },
    })
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Error al guardar' }
  }

  redirect(`/pacientes/${pacienteId}/tratamientos/${tratamientoId}`)
}
