'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarItemProps {
  href: string
  label: string
  icon: React.ReactNode
}

export default function SidebarItem({ href, label, icon }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
        isActive
          ? 'bg-[#eaf4ff] text-[#4a9af4]'
          : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#1a3050]'
      }`}
    >
      <span className={`flex-shrink-0 ${isActive ? 'text-[#4a9af4]' : 'text-[#94a3b8]'}`}>
        {icon}
      </span>
      {label}
    </Link>
  )
}
