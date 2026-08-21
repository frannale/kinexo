'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { getAlertasNoLeidas, marcarAlertaLeida, marcarTodasLeidas } from '@/app/actions/alertas'
import Link from 'next/link'

type Alerta = Awaited<ReturnType<typeof getAlertasNoLeidas>>[number]

const tipoLabel: Record<string, string> = {
  BAJA_ADHERENCIA: 'Baja adherencia',
  SIN_ACTIVIDAD:   'Sin actividad',
  DOLOR_ALTO:      'Dolor alto',
  PERSONALIZADA:   'Aviso',
}

const tipoStyle: Record<string, string> = {
  BAJA_ADHERENCIA: 'bg-amber-50 text-amber-700 border-amber-100',
  SIN_ACTIVIDAD:   'bg-slate-50 text-slate-600 border-slate-200',
  DOLOR_ALTO:      'bg-red-50 text-red-600 border-red-100',
  PERSONALIZADA:   'bg-blue-50 text-blue-600 border-blue-100',
}

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 60)  return 'hace un momento'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`
  return `hace ${Math.floor(diff / 86400)} días`
}

interface Props {
  initialCount: number
}

export default function NotificationsBell({ initialCount }: Props) {
  const [open, setOpen] = useState(false)
  const [alertas, setAlertas] = useState<Alerta[] | null>(null)
  const [count, setCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)

  // Cierra el panel al clickear fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function handleOpen() {
    setOpen((v) => !v)
    if (!alertas) {
      startTransition(async () => {
        const data = await getAlertasNoLeidas()
        setAlertas(data)
        setCount(data.length)
      })
    }
  }

  function handleMarkOne(id: string) {
    startTransition(async () => {
      await marcarAlertaLeida(id)
      setAlertas((prev) => prev?.filter((a) => a.id !== id) ?? null)
      setCount((c) => Math.max(0, c - 1))
    })
  }

  function handleMarkAll() {
    startTransition(async () => {
      await marcarTodasLeidas()
      setAlertas([])
      setCount(0)
    })
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative rounded-xl p-2 text-[#94a3b8] transition hover:bg-[#f8fafc] hover:text-[#1a3050] cursor-pointer"
        aria-label="Notificaciones"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {count > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-400 text-[9px] font-bold text-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-2xl border border-[#e2e8f0] bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-4">
            <span className="text-sm font-bold text-[#1a3050]">
              Notificaciones
              {count > 0 && (
                <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-500">
                  {count} sin leer
                </span>
              )}
            </span>
            {count > 0 && (
              <button
                onClick={handleMarkAll}
                disabled={isPending}
                className="text-xs font-semibold text-[#4a9af4] hover:underline disabled:opacity-50 cursor-pointer"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {/* Lista */}
          <div className="max-h-[480px] overflow-y-auto">
            {!alertas && isPending ? (
              <div className="flex flex-col gap-3 p-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-xl border border-[#f1f5f9] p-4">
                    <div className="mb-2 h-3 w-24 animate-pulse rounded bg-[#f1f5f9]" />
                    <div className="h-3 w-full animate-pulse rounded bg-[#f1f5f9]" />
                  </div>
                ))}
              </div>
            ) : alertas?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 text-[#cbd5e1]" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <p className="text-sm font-medium text-[#94a3b8]">Sin notificaciones pendientes</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-[#f8fbff]">
                {alertas?.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 px-5 py-4 hover:bg-[#f8fbff]">
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex items-center gap-2 flex-wrap">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${tipoStyle[a.tipo]}`}>
                          {tipoLabel[a.tipo]}
                        </span>
                        <Link
                          href={`/pacientes/${a.paciente.id}/tratamientos/${a.tratamiento.id}`}
                          className="text-xs font-semibold text-[#4a9af4] hover:underline truncate"
                          onClick={() => setOpen(false)}
                        >
                          {a.paciente.nombre} {a.paciente.apellido}
                        </Link>
                      </div>
                      <p className="text-xs text-[#334155] leading-relaxed">{a.descripcion}</p>
                      <p className="mt-1 text-[10px] text-[#94a3b8]">{timeAgo(a.creadoEn)}</p>
                    </div>
                    <button
                      onClick={() => handleMarkOne(a.id)}
                      disabled={isPending}
                      title="Marcar como leída"
                      className="mt-0.5 flex-shrink-0 rounded-lg p-1 text-[#94a3b8] hover:bg-[#eaf4ff] hover:text-[#4a9af4] transition disabled:opacity-50 cursor-pointer"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
