'use client'

import { useActionState, useState, useTransition } from 'react'
import { crearObjetivo, actualizarValorObjetivo } from '@/app/actions/objetivos'

const inputClass = 'w-full rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-sm text-[#0f1f3d] outline-none transition placeholder:text-[#94a3b8] focus:border-[#4a9af4] focus:ring-2 focus:ring-[#4a9af4]/10'

interface Objetivo {
  id: string
  descripcion: string
  indicadorNombre: string | null
  valorInicial: number | null
  valorActual: number | null
  valorObjetivo: number | null
  unidad: string | null
}

interface Props {
  tratamientoId: string
  pacienteId: string
  objetivos: Objetivo[]
}

function ProgressBar({ inicial, actual, objetivo }: { inicial: number; actual: number; objetivo: number }) {
  const range = objetivo - inicial || 1
  const progress = Math.min(Math.max(((actual - inicial) / range) * 100, 0), 100)
  return (
    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
      <div
        className="h-full rounded-full bg-[#4a9af4] transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

function ActualizarValorForm({ objetivo, pacienteId, tratamientoId }: { objetivo: Objetivo; pacienteId: string; tratamientoId: string }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(String(objetivo.valorActual ?? ''))
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const num = parseFloat(value)
    if (isNaN(num)) return
    startTransition(async () => {
      await actualizarValorObjetivo(objetivo.id, num, pacienteId, tratamientoId)
    })
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="mt-2 text-xs font-semibold text-[#4a9af4] hover:underline">
        Actualizar valor
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2">
      <input
        type="number"
        step="any"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-24 rounded-lg border border-[#e2e8f0] px-2 py-1 text-sm outline-none focus:border-[#4a9af4]"
      />
      {objetivo.unidad && <span className="text-xs text-[#94a3b8]">{objetivo.unidad}</span>}
      <button type="submit" disabled={isPending} className="rounded-lg bg-[#4a9af4] px-3 py-1 text-xs font-bold text-white hover:bg-[#1a3050] disabled:opacity-60">
        {isPending ? '...' : 'Guardar'}
      </button>
      <button type="button" onClick={() => setOpen(false)} className="text-xs text-[#94a3b8] hover:text-[#64748b]">
        Cancelar
      </button>
    </form>
  )
}

export default function ObjetivosSection({ tratamientoId, pacienteId, objetivos }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [state, formAction, isPending] = useActionState(crearObjetivo, null)

  return (
    <div className="mt-6 rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
        <h2 className="text-sm font-bold text-[#1a3050]">Objetivos del tratamiento</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl border border-[#4a9af4] px-3 py-1.5 text-xs font-bold text-[#4a9af4] transition hover:bg-[#eaf4ff]"
        >
          {showForm ? 'Cancelar' : '+ Nuevo objetivo'}
        </button>
      </div>

      <div className="px-6 py-5">
        {/* Lista de objetivos */}
        {objetivos.length === 0 && !showForm && (
          <p className="text-sm text-[#94a3b8]">No hay objetivos definidos aún.</p>
        )}

        {objetivos.length > 0 && (
          <div className="mb-5 flex flex-col gap-4">
            {objetivos.map((obj) => (
              <div key={obj.id} className="rounded-xl border border-[#f1f5f9] bg-[#f8fbff] p-4">
                <p className="text-sm font-semibold text-[#1a3050]">{obj.descripcion}</p>
                {obj.indicadorNombre && obj.valorObjetivo !== null && obj.valorInicial !== null && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-[#64748b]">
                      <span>{obj.indicadorNombre}</span>
                      <span>
                        {obj.valorActual ?? obj.valorInicial} → {obj.valorObjetivo}
                        {obj.unidad && <span className="ml-1 text-[#94a3b8]">{obj.unidad}</span>}
                      </span>
                    </div>
                    <ProgressBar
                      inicial={obj.valorInicial}
                      actual={obj.valorActual ?? obj.valorInicial}
                      objetivo={obj.valorObjetivo}
                    />
                    <ActualizarValorForm objetivo={obj} pacienteId={pacienteId} tratamientoId={tratamientoId} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Formulario */}
        {showForm && (
          <form action={formAction} className="rounded-xl border border-[#e2e8f0] bg-[#f8fbff] p-4">
            <input type="hidden" name="tratamientoId" value={tratamientoId} />
            <input type="hidden" name="pacienteId" value={pacienteId} />

            {state?.error && (
              <p className="mb-3 text-xs text-red-500">{state.error}</p>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-[#334155]">Descripción *</label>
                <input name="descripcion" type="text" required placeholder="Reducir dolor lumbar" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#334155]">Indicador</label>
                <input name="indicadorNombre" type="text" placeholder="Nivel de dolor" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#334155]">Unidad</label>
                <input name="unidad" type="text" placeholder="escala 0-10, kg, grados..." className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#334155]">Valor inicial</label>
                <input name="valorInicial" type="number" step="any" placeholder="7" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#334155]">Valor objetivo</label>
                <input name="valorObjetivo" type="number" step="any" placeholder="2" className={inputClass} />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-xl bg-[#4a9af4] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1a3050] disabled:opacity-60 cursor-pointer"
              >
                {isPending ? 'Guardando...' : 'Agregar objetivo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
