'use client'

import { useState, useTransition } from 'react'
import { guardarSesion } from '@/app/actions/sesiones'

type Dificultad = 'BAJO' | 'MEDIO' | 'ALTO'
type NivelDificultadPercibida = 'FACIL' | 'ADECUADO' | 'DIFICIL'

interface Ejercicio {
  planEjercicioId: string
  nombre: string
  zonaCorporal: string | null
  dificultad: Dificultad
  series: number | null
  repeticiones: number | null
  duracionSegundos: number | null
  instrucciones: string | null
}

interface Props {
  pacienteNombre: string
  planId: string
  pacienteId: string
  ejercicios: Ejercicio[]
}

interface RegistroEjercicio {
  completado: boolean
  nivelDolor: number | null
  dificultadPercibida: NivelDificultadPercibida | null
}

const DIFICULTAD_LABEL: Record<Dificultad, string> = {
  BAJO: 'Básico',
  MEDIO: 'Intermedio',
  ALTO: 'Avanzado',
}

const DIFICULTAD_STYLE: Record<Dificultad, string> = {
  BAJO: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  MEDIO: 'bg-amber-50 text-amber-600 border-amber-100',
  ALTO: 'bg-rose-50 text-rose-600 border-rose-100',
}

const DOLOR_OPTIONS: { label: string; value: number }[] = [
  { label: 'Sin dolor', value: 0 },
  { label: 'Leve', value: 3 },
  { label: 'Moderado', value: 6 },
  { label: 'Fuerte', value: 9 },
]

const DIFICULTAD_OPTIONS: { label: string; value: NivelDificultadPercibida }[] = [
  { label: 'Fácil', value: 'FACIL' },
  { label: 'Bien', value: 'ADECUADO' },
  { label: 'Difícil', value: 'DIFICIL' },
]

function fechaHoyEspanol(): string {
  return new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export default function SesionView({ pacienteNombre, planId, pacienteId, ejercicios }: Props) {
  const [registros, setRegistros] = useState<Record<string, RegistroEjercicio>>(() =>
    Object.fromEntries(
      ejercicios.map((e) => [
        e.planEjercicioId,
        { completado: false, nivelDolor: null, dificultadPercibida: null },
      ])
    )
  )
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const completados = Object.values(registros).filter((r) => r.completado).length
  const total = ejercicios.length
  const progreso = total > 0 ? Math.round((completados / total) * 100) : 0

  function toggleCompletado(id: string) {
    setRegistros((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        completado: !prev[id].completado,
        nivelDolor: !prev[id].completado ? prev[id].nivelDolor : null,
        dificultadPercibida: !prev[id].completado ? prev[id].dificultadPercibida : null,
      },
    }))
  }

  function setDolor(id: string, value: number) {
    setRegistros((prev) => ({ ...prev, [id]: { ...prev[id], nivelDolor: value } }))
  }

  function setDificultad(id: string, value: NivelDificultadPercibida) {
    setRegistros((prev) => ({ ...prev, [id]: { ...prev[id], dificultadPercibida: value } }))
  }

  function handleSubmit() {
    setError(null)
    startTransition(async () => {
      const result = await guardarSesion(
        pacienteId,
        planId,
        ejercicios.map((e) => ({
          planEjercicioId: e.planEjercicioId,
          completado: registros[e.planEjercicioId].completado,
          nivelDolor: registros[e.planEjercicioId].nivelDolor,
          dificultadPercibida: registros[e.planEjercicioId].dificultadPercibida,
        }))
      )
      if ('error' in result) {
        setError(result.error)
      } else {
        setEnviado(true)
      }
    })
  }

  if (enviado) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center gap-4">
        <div className="rounded-full bg-emerald-50 p-6 mb-2">
          <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-[#1a3050]">¡Sesión completada!</h2>
        <p className="text-[#64748b]">
          Excelente trabajo, {pacienteNombre.split(' ')[0]}.
          <br />
          Tu kinesiólogo verá tu progreso.
        </p>
        <p className="text-sm font-semibold text-[#4a9af4] mt-2">
          {completados} de {total} ejercicios realizados
        </p>
      </div>
    )
  }

  if (total === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-10 shadow-sm">
          <p className="text-2xl mb-3">☀️</p>
          <p className="font-bold text-[#1a3050] text-lg mb-2">Día de descanso</p>
          <p className="text-[#64748b] text-sm">No tenés ejercicios programados para hoy.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#4a9af4] mb-1">
          {fechaHoyEspanol()}
        </p>
        <h1 className="text-2xl font-extrabold text-[#1a3050] leading-tight">
          ¿Qué hacemos hoy?
        </h1>
        <p className="text-[#64748b] mt-0.5">{pacienteNombre}</p>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-[#1a3050]">Progreso de hoy</span>
          <span className="text-sm font-bold text-[#4a9af4]">
            {completados} de {total} ejercicios
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-[#e2e8f0] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#4a9af4] transition-all duration-500 ease-out"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {/* Exercise cards */}
      <div className="flex flex-col gap-4">
        {ejercicios.map((ej, idx) => {
          const reg = registros[ej.planEjercicioId]
          const done = reg.completado

          return (
            <div
              key={ej.planEjercicioId}
              className={`rounded-2xl border bg-white shadow-sm transition-all duration-300 ${
                done ? 'border-emerald-200' : 'border-[#e2e8f0]'
              }`}
            >
              {/* Card header */}
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf4ff] text-xs font-extrabold text-[#4a9af4] mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-[#1a3050] text-base leading-snug">{ej.nombre}</h3>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-bold flex-shrink-0 ${DIFICULTAD_STYLE[ej.dificultad]}`}
                      >
                        {DIFICULTAD_LABEL[ej.dificultad]}
                      </span>
                    </div>

                    {ej.zonaCorporal && (
                      <p className="text-xs text-[#64748b] mb-2">{ej.zonaCorporal}</p>
                    )}

                    {/* Sets / reps / duration */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {ej.series && ej.repeticiones ? (
                        <span className="rounded-xl bg-[#f0f7ff] px-3 py-1.5 text-sm font-semibold text-[#1a3050]">
                          {ej.series} series × {ej.repeticiones} reps
                        </span>
                      ) : ej.series ? (
                        <span className="rounded-xl bg-[#f0f7ff] px-3 py-1.5 text-sm font-semibold text-[#1a3050]">
                          {ej.series} series
                        </span>
                      ) : null}

                      {ej.duracionSegundos ? (
                        <span className="rounded-xl bg-[#f0f7ff] px-3 py-1.5 text-sm font-semibold text-[#1a3050]">
                          {ej.duracionSegundos}s
                        </span>
                      ) : null}
                    </div>

                    {ej.instrucciones && (
                      <p className="text-sm text-[#64748b] leading-relaxed">{ej.instrucciones}</p>
                    )}
                  </div>
                </div>

                {/* Toggle button */}
                <button
                  onClick={() => toggleCompletado(ej.planEjercicioId)}
                  className={`mt-4 w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
                    done
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-[#f0f7ff] text-[#4a9af4] hover:bg-[#4a9af4] hover:text-white border border-[#4a9af4]/30'
                  }`}
                >
                  {done ? '✓ Completado' : 'Marcar como completado'}
                </button>
              </div>

              {/* Feedback section (visible when done) */}
              {done && (
                <div className="border-t border-emerald-100 px-5 pb-5 pt-4 flex flex-col gap-4">
                  {/* Pain */}
                  <div>
                    <p className="text-xs font-bold text-[#64748b] uppercase tracking-wide mb-2">
                      ¿Sentiste dolor?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {DOLOR_OPTIONS.map((op) => (
                        <button
                          key={op.value}
                          onClick={() => setDolor(ej.planEjercicioId, op.value)}
                          className={`rounded-xl py-2.5 text-sm font-semibold transition-all duration-150 border ${
                            reg.nivelDolor === op.value
                              ? 'bg-[#1a3050] text-white border-[#1a3050]'
                              : 'bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#4a9af4] hover:text-[#4a9af4]'
                          }`}
                        >
                          {op.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Perceived difficulty */}
                  <div>
                    <p className="text-xs font-bold text-[#64748b] uppercase tracking-wide mb-2">
                      ¿Cómo te resultó?
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {DIFICULTAD_OPTIONS.map((op) => (
                        <button
                          key={op.value}
                          onClick={() => setDificultad(ej.planEjercicioId, op.value)}
                          className={`rounded-xl py-2.5 text-sm font-semibold transition-all duration-150 border ${
                            reg.dificultadPercibida === op.value
                              ? 'bg-[#1a3050] text-white border-[#1a3050]'
                              : 'bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#4a9af4] hover:text-[#4a9af4]'
                          }`}
                        >
                          {op.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={completados === 0 || isPending}
        className="w-full rounded-xl bg-[#4a9af4] py-4 text-base font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#1a3050] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {isPending ? 'Guardando...' : 'Finalizar sesión'}
      </button>
    </div>
  )
}
