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

      {/* Bell placeholder so layout can absolutely position NotificationsBell here */}
      <div className="h-9 w-9" />
    </header>
  )
}
