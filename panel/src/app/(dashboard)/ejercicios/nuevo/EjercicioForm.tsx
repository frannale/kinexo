'use client'

import { useActionState } from 'react'
import { crearEjercicio } from '@/app/actions/ejercicios'
import Link from 'next/link'

const inputClass = 'w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f1f3d] outline-none transition placeholder:text-[#94a3b8] focus:border-[#4a9af4] focus:ring-2 focus:ring-[#4a9af4]/10'
const labelClass = 'block text-sm font-semibold text-[#334155] mb-1.5'

export default function EjercicioForm() {
  const [state, formAction, isPending] = useActionState(crearEjercicio, null)

  return (
    <form action={formAction} className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
      {state?.error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="nombre">Nombre *</label>
          <input id="nombre" name="nombre" type="text" required placeholder="Sentadilla con banda" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="zonaCorporal">Zona corporal</label>
          <input id="zonaCorporal" name="zonaCorporal" type="text" placeholder="Rodilla, Lumbar, Hombro..." className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="dificultad">Dificultad</label>
          <select id="dificultad" name="dificultad" className={inputClass}>
            <option value="BAJO">Básico</option>
            <option value="MEDIO" selected>Intermedio</option>
            <option value="ALTO">Avanzado</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="descripcion">Descripción</label>
          <textarea id="descripcion" name="descripcion" rows={2} placeholder="Breve descripción del ejercicio..." className={`${inputClass} resize-none`} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="instrucciones">Instrucciones de ejecución</label>
          <textarea id="instrucciones" name="instrucciones" rows={4} placeholder="1. Pararse con los pies al ancho de hombros&#10;2. Bajar lentamente..." className={`${inputClass} resize-none`} />
        </div>

        <div>
          <label className={labelClass} htmlFor="objetivo">Objetivo</label>
          <input id="objetivo" name="objetivo" type="text" placeholder="Fortalecer cuádriceps" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="equipamiento">Equipamiento</label>
          <input id="equipamiento" name="equipamiento" type="text" placeholder="Banda elástica, mancuerna..." className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="precauciones">Precauciones</label>
          <textarea id="precauciones" name="precauciones" rows={2} placeholder="No realizar si hay dolor agudo..." className={`${inputClass} resize-none`} />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <Link href="/ejercicios" className="rounded-xl border border-[#e2e8f0] px-5 py-2.5 text-sm font-semibold text-[#64748b] transition hover:bg-[#f8fafc]">
          Cancelar
        </Link>
        <button type="submit" disabled={isPending} className="rounded-xl bg-[#4a9af4] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1a3050] disabled:opacity-60 cursor-pointer">
          {isPending ? 'Guardando...' : 'Guardar ejercicio'}
        </button>
      </div>
    </form>
  )
}
