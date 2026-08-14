'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold text-[#334155]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@email.com"
          className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f1f3d] outline-none transition placeholder:text-[#94a3b8] focus:border-[#4a9af4] focus:ring-3 focus:ring-[#4a9af4]/10"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-semibold text-[#334155]">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f1f3d] outline-none transition placeholder:text-[#94a3b8] focus:border-[#4a9af4] focus:ring-3 focus:ring-[#4a9af4]/10"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-xl bg-[#4a9af4] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1a3050] disabled:opacity-60 cursor-pointer"
      >
        {isPending ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  )
}
