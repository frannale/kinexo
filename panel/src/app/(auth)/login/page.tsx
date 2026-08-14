import LoginForm from './LoginForm'

export const metadata = { title: 'Ingresar — Kinexo' }

export default function LoginPage() {
  return (
    <main className="flex min-h-full items-center justify-center bg-[#f6fbff] px-4 py-12">
      {/* Decorative blur blobs */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[#4a9af4]/8 blur-[120px]"
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="text-3xl font-extrabold tracking-tight text-[#1a3050]">
            Kine<span className="text-[#4a9af4]">xo</span>
          </span>
          <p className="mt-2 text-sm text-[#64748b]">
            Ingresá a tu centro para continuar
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white px-8 py-8 shadow-sm">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-[#94a3b8]">
          ¿Problemas para ingresar? Contactá al administrador de tu centro.
        </p>
      </div>
    </main>
  )
}
