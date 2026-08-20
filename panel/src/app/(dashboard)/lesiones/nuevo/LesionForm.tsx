'use client'

import { useActionState } from 'react'
import { crearLesion } from '@/app/actions/lesiones'
import Link from 'next/link'

const inputClass = 'w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f1f3d] outline-none transition placeholder:text-[#94a3b8] focus:border-[#4a9af4] focus:ring-2 focus:ring-[#4a9af4]/10'
const labelClass = 'block text-sm font-semibold text-[#334155] mb-1.5'

export default function LesionForm() {
  const [state, formAction, isPending] = useActionState(crearLesion, null)

  return (
    <form action={formAction} className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
      {state?.error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div>
          <label className={labelClass} htmlFor="nombre">Nombre *</label>
          <input id="nombre" name="nombre" type="text" required placeholder="Tendinitis rotuliana" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="zonaCorporal">Zona corporal</label>
          <input id="zonaCorporal" name="zonaCorporal" type="text" placeholder="Rodilla, Hombro, Lumbar..." className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="descripcion">Descripción</label>
          <textarea id="descripcion" name="descripcion" rows={3} placeholder="Breve descripción clínica..." className={`${inputClass} resize-none`} />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <Link href="/lesiones" className="rounded-xl border border-[#e2e8f0] px-5 py-2.5 text-sm font-semibold text-[#64748b] transition hover:bg-[#f8fafc]">
          Cancelar
        </Link>
        <button type="submit" disabled={isPending} className="rounded-xl bg-[#4a9af4] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1a3050] disabled:opacity-60 cursor-pointer">
          {isPending ? 'Guardando...' : 'Guardar lesión'}
        </button>
      </div>
    </form>
  )
}
