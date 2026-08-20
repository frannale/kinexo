'use client'

import { useActionState } from 'react'
import { crearEvaluacion } from '@/app/actions/evaluaciones'
import Link from 'next/link'

const inputClass = 'w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f1f3d] outline-none transition placeholder:text-[#94a3b8] focus:border-[#4a9af4] focus:ring-2 focus:ring-[#4a9af4]/10'
const labelClass = 'block text-sm font-semibold text-[#334155] mb-1.5'

interface Props {
  tratamientoId: string
  pacienteId: string
}

const DOLOR_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function dolorColor(n: number) {
  if (n <= 2) return 'bg-green-50 border-green-200 text-green-700'
  if (n <= 5) return 'bg-amber-50 border-amber-200 text-amber-700'
  return 'bg-red-50 border-red-200 text-red-700'
}

export default function NuevaEvaluacionForm({ tratamientoId, pacienteId }: Props) {
  const [state, formAction, isPending] = useActionState(crearEvaluacion, null)

  return (
    <form action={formAction} className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
      <input type="hidden" name="tratamientoId" value={tratamientoId} />
      <input type="hidden" name="pacienteId" value={pacienteId} />

      {state?.error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Nivel de dolor */}
        <div className="sm:col-span-2">
          <label className={labelClass}>Nivel de dolor (0–10)</label>
          <div className="flex flex-wrap gap-2">
            {DOLOR_OPTIONS.map((n) => (
              <label key={n} className="cursor-pointer">
                <input type="radio" name="nivelDolor" value={n} className="sr-only peer" />
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-bold transition peer-checked:ring-2 peer-checked:ring-[#4a9af4] ${dolorColor(n)}`}>
                  {n}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="zonaCorporal">Zona corporal</label>
          <input id="zonaCorporal" name="zonaCorporal" type="text" placeholder="Rodilla, Lumbar..." className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="diagnostico">Diagnóstico</label>
          <input id="diagnostico" name="diagnostico" type="text" placeholder="Condromalacia grado II..." className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="antecedentes">Antecedentes</label>
          <textarea id="antecedentes" name="antecedentes" rows={2} placeholder="Cirugía previa, patologías de base..." className={`${inputClass} resize-none`} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="sintomas">Síntomas referidos</label>
          <textarea id="sintomas" name="sintomas" rows={2} placeholder="Dolor al subir escaleras, rigidez matutina..." className={`${inputClass} resize-none`} />
        </div>

        <div>
          <label className={labelClass} htmlFor="movilidad">Movilidad</label>
          <textarea id="movilidad" name="movilidad" rows={2} placeholder="Flexión 90°, extensión limitada..." className={`${inputClass} resize-none`} />
        </div>

        <div>
          <label className={labelClass} htmlFor="fuerza">Fuerza</label>
          <textarea id="fuerza" name="fuerza" rows={2} placeholder="Cuádriceps 4/5, isquios 5/5..." className={`${inputClass} resize-none`} />
        </div>

        <div>
          <label className={labelClass} htmlFor="funcionalidad">Funcionalidad</label>
          <textarea id="funcionalidad" name="funcionalidad" rows={2} placeholder="Marcha normal, dificultad en cuestas..." className={`${inputClass} resize-none`} />
        </div>

        <div>
          <label className={labelClass} htmlFor="limitaciones">Limitaciones</label>
          <textarea id="limitaciones" name="limitaciones" rows={2} placeholder="No puede correr, evita sentadillas..." className={`${inputClass} resize-none`} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="observacionesProfesional">Observaciones del profesional</label>
          <textarea id="observacionesProfesional" name="observacionesProfesional" rows={3} placeholder="Evolución favorable, se intensifica el trabajo de fuerza..." className={`${inputClass} resize-none`} />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <Link
          href={`/pacientes/${pacienteId}/tratamientos/${tratamientoId}`}
          className="rounded-xl border border-[#e2e8f0] px-5 py-2.5 text-sm font-semibold text-[#64748b] transition hover:bg-[#f8fafc]"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-[#4a9af4] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1a3050] disabled:opacity-60 cursor-pointer"
        >
          {isPending ? 'Guardando...' : 'Guardar evaluación'}
        </button>
      </div>
    </form>
  )
}
