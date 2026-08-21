'use client'

import { useState, useEffect, useRef } from 'react'

export default function InstallBanner() {
  const [visible, setVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const deferredPrompt = useRef<any>(null)

  useEffect(() => {
    const ua = navigator.userAgent
    const ios = /iPhone|iPad|iPod/.test(ua) && !/CriOS|FxiOS/.test(ua)
    const android = /Android/.test(ua)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    const dismissed = localStorage.getItem('install-dismissed') === '1'

    if (isStandalone || dismissed) return

    if (ios) {
      setIsIOS(true)
      setVisible(true)
      return
    }

    if (android) {
      const handler = (e: Event) => {
        e.preventDefault()
        deferredPrompt.current = e
        setVisible(true)
      }
      window.addEventListener('beforeinstallprompt', handler)
      return () => window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  function dismiss() {
    setVisible(false)
    setShowGuide(false)
    localStorage.setItem('install-dismissed', '1')
  }

  async function handleInstall() {
    const prompt = deferredPrompt.current
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') dismiss()
  }

  if (!visible) return null

  if (isIOS && showGuide) {
    return (
      <div className="mb-5 rounded-2xl border border-[#4a9af4]/20 bg-[#eaf4ff] p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-[#1a3050]">Agregar a pantalla de inicio</p>
          <button onClick={dismiss} className="text-[#94a3b8] hover:text-[#64748b] text-lg leading-none cursor-pointer">✕</button>
        </div>
        <ol className="flex flex-col gap-2.5 text-sm text-[#334155]">
          <li className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#4a9af4] text-[10px] font-bold text-white">1</span>
            Tocá el botón <strong>Compartir</strong>
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[#4a9af4]/30 bg-white text-[#4a9af4]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
            </span>
          </li>
          <li className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#4a9af4] text-[10px] font-bold text-white">2</span>
            Elegí <strong>"Agregar a pantalla de inicio"</strong>
          </li>
          <li className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#4a9af4] text-[10px] font-bold text-white">3</span>
            Tocá <strong>Agregar</strong>
          </li>
        </ol>
      </div>
    )
  }

  return (
    <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#4a9af4] text-sm font-bold text-white">
          Kx
        </div>
        <div>
          <p className="text-sm font-bold text-[#1a3050]">Acceso rápido</p>
          <p className="text-xs text-[#64748b]">Agregá Kinexo a tu pantalla de inicio</p>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        {isIOS ? (
          <button
            onClick={() => setShowGuide(true)}
            className="rounded-xl bg-[#4a9af4] px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
          >
            ¿Cómo?
          </button>
        ) : (
          <button
            onClick={handleInstall}
            className="rounded-xl bg-[#4a9af4] px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
          >
            Instalar
          </button>
        )}
        <button
          onClick={dismiss}
          className="p-1 text-[#94a3b8] hover:text-[#64748b] cursor-pointer"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
