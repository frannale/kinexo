'use client'

import { useActionState, useState } from 'react'
import { crearTratamiento } from '@/app/actions/tratamientos'
import Link from 'next/link'

const inputClass = 'w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f1f3d] outline-none transition placeholder:text-[#94a3b8] focus:border-[#4a9af4] focus:ring-2 focus:ring-[#4a9af4]/10'
const labelClass = 'block text-sm font-semibold text-[#334155] mb-1.5'

interface Usuario {
  id: string
  nombre: string
  apellido: string
  rol: string
}

interface Lesion {
  id: string
  nombre: string
  zonaCorporal: string | null
}

interface Props {
  pacienteId: string
  pacienteNombre: string
  usuarios: Usuario[]
  lesiones: Lesion[]
}

export default function NuevoTratamientoForm({ pacienteId, pacienteNombre, usuarios, lesiones }: Props) {
  const [state, formAction, isPending] = useActionState(crearTratamiento, null)
  const [lesionesSeleccionadas, setLesiones] = useState<string[]>([])

  function toggleLesion(id: string) {
    setLesiones((prev) => prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id])
  }

  return (
    <form action={formAction} className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
      <input type="hidden" name="pacienteId" value={pacienteId} />
      {lesionesSeleccionadas.map((id) => (
        <input key={id} type="hidden" name="lesionIds" value={id} />
      ))}

      {state?.error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <p className="mb-6 text-sm text-[#64748b]">
        Paciente: <span className="font-semibold text-[#1a3050]">{pacienteNombre}</span>
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="nombre">Nombre del tratamiento *</label>
          <input id="nombre" name="nombre" type="text" required placeholder="Rehabilitación rodilla derecha" className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="kinesiologoId">Kinesiólogo responsable *</label>
          <select id="kinesiologoId" name="kinesiologoId" required className={inputClass}>
            <option value="">Seleccionar...</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.apellido}, {u.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="zonaCorporal">Zona corporal</label>
          <input id="zonaCorporal" name="zonaCorporal" type="text" placeholder="Rodilla, Lumbar, Hombro..." className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="fechaFinEstimada">Fecha fin estimada</label>
          <input id="fechaFinEstimada" name="fechaFinEstimada" type="date" className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="motivoConsulta">Motivo de consulta</label>
          <textarea id="motivoConsulta" name="motivoConsulta" rows={2} placeholder="Dolor en rodilla luego de actividad física..." className={`${inputClass} resize-none`} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="diagnostico">Diagnóstico</label>
          <textarea id="diagnostico" name="diagnostico" rows={2} placeholder="Condromalacia rotuliana grado II..." className={`${inputClass} resize-none`} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="observaciones">Observaciones</label>
          <textarea id="observaciones" name="observaciones" rows={2} placeholder="Notas adicionales..." className={`${inputClass} resize-none`} />
        </div>

        {lesiones.length > 0 && (
          <div className="sm:col-span-2">
            <label className={labelClass}>Lesiones asociadas</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {lesiones.map((l) => {
                const selected = lesionesSeleccionadas.includes(l.id)
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => toggleLesion(l.id)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition ${
                      selected
                        ? 'border-[#4a9af4] bg-[#eaf4ff] text-[#1a3050]'
                        : 'border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#4a9af4]/50'
                    }`}
                  >
                    <span className={`h-4 w-4 flex-shrink-0 rounded border-2 transition ${selected ? 'border-[#4a9af4] bg-[#4a9af4]' : 'border-[#e2e8f0]'}`}>
                      {selected && (
                        <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-0.5">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-medium leading-tight truncate">{l.nombre}</span>
                      {l.zonaCorporal && <span className="text-xs text-[#94a3b8]">{l.zonaCorporal}</span>}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <Link href={`/pacientes/${pacienteId}`} className="rounded-xl border border-[#e2e8f0] px-5 py-2.5 text-sm font-semibold text-[#64748b] transition hover:bg-[#f8fafc]">
          Cancelar
        </Link>
        <button type="submit" disabled={isPending} className="rounded-xl bg-[#4a9af4] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1a3050] disabled:opacity-60 cursor-pointer">
          {isPending ? 'Guardando...' : 'Crear tratamiento'}
        </button>
      </div>
    </form>
  )
}
