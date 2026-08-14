interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-[#e2e8f0] bg-white px-8">
      <div>
        <h1 className="text-lg font-bold text-[#1a3050]">{title}</h1>
        {subtitle && <p className="text-xs text-[#94a3b8]">{subtitle}</p>}
      </div>

      {/* Bell */}
      <button className="relative rounded-xl p-2 text-[#94a3b8] transition hover:bg-[#f8fafc] hover:text-[#1a3050] cursor-pointer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {/* Indicador de alertas */}
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-400" />
      </button>
    </header>
  )
}
