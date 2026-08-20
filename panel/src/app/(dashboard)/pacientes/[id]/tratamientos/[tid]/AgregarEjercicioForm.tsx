'use client'

import { useActionState, useState } from 'react'
import { agregarEjercicioAPlan } from '@/app/actions/planes'

const inputClass = 'w-full rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-sm text-[#0f1f3d] outline-none transition focus:border-[#4a9af4] focus:ring-2 focus:ring-[#4a9af4]/10'
const labelClass = 'block text-xs font-bold text-[#64748b] uppercase tracking-wide mb-1.5'

const DIAS = [
  { key: 'LUN', label: 'L' },
  { key: 'MAR', label: 'M' },
  { key: 'MIE', label: 'X' },
  { key: 'JUE', label: 'J' },
  { key: 'VIE', label: 'V' },
  { key: 'SAB', label: 'S' },
  { key: 'DOM', label: 'D' },
]

interface Ejercicio {
  id: string
  nombre: string
  zonaCorporal: string | null
  dificultad: string
}

interface Props {
  planId: string
  tratamientoId: string
  pacienteId: string
  ejercicios: Ejercicio[]
}

export default function AgregarEjercicioForm({ planId, tratamientoId, pacienteId, ejercicios }: Props) {
  const [state, formAction, isPending] = useActionState(agregarEjercicioAPlan, null)
  const [diasSeleccionados, setDias] = useState<string[]>([])
  const [abierto, setAbierto] = useState(false)

  function toggleDia(dia: string) {
    setDias((prev) => prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia])
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-[#4a9af4]/40 px-4 py-2.5 text-sm font-semibold text-[#4a9af4] transition hover:bg-[#eaf4ff]"
      >
        + Agregar ejercicio
      </button>
    )
  }

  return (
    <form action={formAction} className="mt-3 rounded-xl border border-[#e2e8f0] bg-[#f8fbff] p-5">
      <input type="hidden" name="planId" value={planId} />
      <input type="hidden" name="tratamientoId" value={tratamientoId} />
      <input type="hidden" name="pacienteId" value={pacienteId} />
      {diasSeleccionados.map((d) => (
        <input key={d} type="hidden" name="diasSemana" value={d} />
      ))}

      {state?.error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="ejercicioId">Ejercicio *</label>
          <select id="ejercicioId" name="ejercicioId" required className={inputClass}>
            <option value="">Seleccionar ejercicio...</option>
            {ejercicios.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}{e.zonaCorporal ? ` — ${e.zonaCorporal}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="series">Series</label>
          <input id="series" name="series" type="number" min="1" placeholder="3" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="repeticiones">Repeticiones</label>
          <input id="repeticiones" name="repeticiones" type="number" min="1" placeholder="12" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="duracionSegundos">Duración (seg)</label>
          <input id="duracionSegundos" name="duracionSegundos" type="number" min="1" placeholder="30" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="ejFrecuencia">Veces por semana</label>
          <input id="ejFrecuencia" name="frecuenciaSemanal" type="number" min="1" max="7" placeholder="3" className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Días de la semana</label>
          <div className="flex gap-2">
            {DIAS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleDia(key)}
                className={`h-9 w-9 rounded-lg text-xs font-bold transition ${
                  diasSeleccionados.includes(key)
                    ? 'bg-[#4a9af4] text-white'
                    : 'bg-white border border-[#e2e8f0] text-[#94a3b8] hover:border-[#4a9af4] hover:text-[#4a9af4]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="instruccionesEspecificas">Instrucciones para este paciente</label>
          <textarea id="instruccionesEspecificas" name="instruccionesEspecificas" rows={2} placeholder="Override de instrucciones específico para este paciente..." className={`${inputClass} resize-none`} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button type="button" onClick={() => setAbierto(false)} className="rounded-xl border border-[#e2e8f0] px-4 py-2 text-sm font-semibold text-[#64748b] transition hover:bg-white">
          Cancelar
        </button>
        <button type="submit" disabled={isPending} className="rounded-xl bg-[#4a9af4] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#1a3050] disabled:opacity-60 cursor-pointer">
          {isPending ? 'Agregando...' : 'Agregar al plan'}
        </button>
      </div>
    </form>
  )
}
