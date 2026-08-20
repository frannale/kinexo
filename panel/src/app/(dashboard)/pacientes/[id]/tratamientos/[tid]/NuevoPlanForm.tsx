'use client'

import { useActionState } from 'react'
import { crearPlan } from '@/app/actions/planes'

const inputClass = 'w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm text-[#0f1f3d] outline-none transition placeholder:text-[#94a3b8] focus:border-[#4a9af4] focus:ring-2 focus:ring-[#4a9af4]/10'
const labelClass = 'block text-xs font-bold text-[#64748b] uppercase tracking-wide mb-1.5'

interface Props {
  tratamientoId: string
  pacienteId: string
  tieneplanActivo: boolean
}

export default function NuevoPlanForm({ tratamientoId, pacienteId, tieneplanActivo }: Props) {
  const [state, formAction, isPending] = useActionState(crearPlan, null)

  return (
    <form action={formAction} className="mt-4 rounded-xl border border-dashed border-[#e2e8f0] bg-[#f8fbff] p-5">
      <input type="hidden" name="tratamientoId" value={tratamientoId} />
      <input type="hidden" name="pacienteId" value={pacienteId} />

      {tieneplanActivo && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          El plan activo se archivará y se creará uno nuevo.
        </div>
      )}

      {state?.error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="planNombre">Nombre del plan *</label>
          <input id="planNombre" name="nombre" type="text" required placeholder="Plan semana 1-4" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="planObjetivo">Objetivo</label>
          <input id="planObjetivo" name="objetivo" type="text" placeholder="Reducir dolor, ganar movilidad..." className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="planFrecuencia">Sesiones por semana</label>
          <input id="planFrecuencia" name="frecuenciaSemanal" type="number" min="1" max="7" placeholder="3" className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="planInstrucciones">Instrucciones generales</label>
          <textarea id="planInstrucciones" name="instrucciones" rows={2} placeholder="Recordar hidratarse, respetar los tiempos de descanso..." className={`${inputClass} resize-none`} />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button type="submit" disabled={isPending} className="rounded-xl bg-[#4a9af4] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#1a3050] disabled:opacity-60 cursor-pointer">
          {isPending ? 'Creando...' : tieneplanActivo ? 'Crear nuevo plan' : 'Crear primer plan'}
        </button>
      </div>
    </form>
  )
}
