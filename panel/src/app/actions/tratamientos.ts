'use server'

import { prisma } from '@/lib/prisma'
import { getTenant } from '@/lib/tenant'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function crearTratamiento(_prev: { error: string } | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const tenant = await getTenant()
  if (!tenant) return { error: 'Centro no encontrado' }

  const pacienteId = formData.get('pacienteId') as string
  const kinesiologoId = formData.get('kinesiologoId') as string
  const nombre = (formData.get('nombre') as string).trim()

  if (!nombre) return { error: 'El nombre es obligatorio' }
  if (!kinesiologoId) return { error: 'Seleccioná un kinesiólogo responsable' }

  const lesionIds = formData.getAll('lesionIds') as string[]

  let tratamientoId: string
  try {
    const t = await prisma.tratamiento.create({
      data: {
        centroId: tenant.centroId,
        pacienteId,
        kinesiologoId,
        nombre,
        motivoConsulta: (formData.get('motivoConsulta') as string).trim() || null,
        diagnostico: (formData.get('diagnostico') as string).trim() || null,
        zonaCorporal: (formData.get('zonaCorporal') as string).trim() || null,
        fechaFinEstimada: (formData.get('fechaFinEstimada') as string)
          ? new Date(formData.get('fechaFinEstimada') as string)
          : null,
        observaciones: (formData.get('observaciones') as string).trim() || null,
        lesiones: lesionIds.length > 0
          ? { connect: lesionIds.map((id) => ({ id })) }
          : undefined,
      },
    })
    tratamientoId = t.id
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Error al guardar' }
  }

  redirect(`/pacientes/${pacienteId}/tratamientos/${tratamientoId}`)
}
