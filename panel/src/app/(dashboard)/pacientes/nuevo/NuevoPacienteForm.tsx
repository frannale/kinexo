'use client'

import { useActionState } from 'react'
import { crearPaciente } from '@/app/actions/pacientes'
import Link from 'next/link'

const inputClass =
  'w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f1f3d] outline-none transition placeholder:text-[#94a3b8] focus:border-[#4a9af4] focus:ring-2 focus:ring-[#4a9af4]/10'

const labelClass = 'block text-sm font-semibold text-[#334155] mb-1.5'

export default function NuevoPacienteForm() {
  const [state, formAction, isPending] = useActionState(crearPaciente, null)

  return (
    <form action={formAction} className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
      {state?.error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="nombre">Nombre *</label>
          <input id="nombre" name="nombre" type="text" required placeholder="María" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="apellido">Apellido *</label>
          <input id="apellido" name="apellido" type="text" required placeholder="López" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="documento">DNI / Documento</label>
          <input id="documento" name="documento" type="text" placeholder="30000000" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="fechaNacimiento">Fecha de nacimiento</label>
          <input id="fechaNacimiento" name="fechaNacimiento" type="date" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="paciente@email.com" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="telefono">Teléfono</label>
          <input id="telefono" name="telefono" type="tel" placeholder="+54 11 0000-0000" className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="informacionRelevante">Información relevante</label>
          <textarea
            id="informacionRelevante"
            name="informacionRelevante"
            rows={3}
            placeholder="Antecedentes médicos, alergias, observaciones..."
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <Link
          href="/pacientes"
          className="rounded-xl border border-[#e2e8f0] px-5 py-2.5 text-sm font-semibold text-[#64748b] transition hover:bg-[#f8fafc]"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-[#4a9af4] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1a3050] disabled:opacity-60 cursor-pointer"
        >
          {isPending ? 'Guardando...' : 'Guardar paciente'}
        </button>
      </div>
    </form>
  )
}
