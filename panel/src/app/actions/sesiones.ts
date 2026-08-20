'use server'

import { prisma } from '@/lib/prisma'

type NivelDificultadPercibida = 'FACIL' | 'ADECUADO' | 'DIFICIL'

interface RegistroInput {
  planEjercicioId: string
  completado: boolean
  nivelDolor: number | null
  dificultadPercibida: NivelDificultadPercibida | null
}

export async function guardarSesion(
  pacienteId: string,
  planId: string,
  registros: RegistroInput[]
): Promise<{ ok: true } | { error: string }> {
  try {
    await prisma.$transaction(async (tx) => {
      const sesion = await tx.sesionPaciente.create({
        data: {
          pacienteId,
          planId,
          fecha: new Date(),
        },
      })

      await tx.registroEjercicio.createMany({
        data: registros.map((r) => ({
          sesionId: sesion.id,
          planEjercicioId: r.planEjercicioId,
          completado: r.completado,
          nivelDolor: r.nivelDolor,
          dificultadPercibida: r.dificultadPercibida ?? undefined,
        })),
      })
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Error al guardar la sesión'
    return { error: msg }
  }

  return { ok: true }
}
