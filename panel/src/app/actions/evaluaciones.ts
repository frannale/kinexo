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

  const str = (key: string) => (formData.get(key) as string | null)?.trim() || null

  try {
    await prisma.evaluacion.create({
      data: {
        tratamientoId,
        kinesiologoId: usuario.id,
        nivelDolor:    nivelDolorRaw ? parseInt(nivelDolorRaw) : null,
        zonaCorporal:  str('zonaCorporal'),
        diagnostico:   str('diagnostico'),
        antecedentes:  str('antecedentes'),
        sintomas:      str('sintomas'),
        movilidad:     str('movilidad'),
        fuerza:        str('fuerza'),
        funcionalidad: str('funcionalidad'),
        limitaciones:  str('limitaciones'),
        observacionesProfesional: str('observacionesProfesional'),
      },
    })
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Error al guardar' }
  }

  redirect(`/pacientes/${pacienteId}/tratamientos/${tratamientoId}`)
}
