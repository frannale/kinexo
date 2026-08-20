'use server'

import { prisma } from '@/lib/prisma'
import { getTenant } from '@/lib/tenant'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function crearPaciente(_prev: { error: string } | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const tenant = await getTenant()
  if (!tenant) return { error: 'Centro no encontrado' }

  const nombre = (formData.get('nombre') as string).trim()
  const apellido = (formData.get('apellido') as string).trim()

  if (!nombre || !apellido) return { error: 'Nombre y apellido son obligatorios' }

  const email = (formData.get('email') as string).trim() || null
  const telefono = (formData.get('telefono') as string).trim() || null
  const documento = (formData.get('documento') as string).trim() || null
  const fechaRaw = formData.get('fechaNacimiento') as string
  const informacionRelevante = (formData.get('informacionRelevante') as string).trim() || null

  let pacienteId: string
  try {
    const paciente = await prisma.paciente.create({
      data: {
        centroId: tenant.centroId,
        nombre,
        apellido,
        email,
        telefono,
        documento,
        fechaNacimiento: fechaRaw ? new Date(fechaRaw) : null,
        informacionRelevante,
      },
    })
    pacienteId = paciente.id
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Error al guardar'
    if (msg.includes('unique')) return { error: 'Ya existe un paciente con ese documento' }
    return { error: msg }
  }

  redirect(`/pacientes/${pacienteId}`)
}
