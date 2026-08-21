import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTenant } from '@/lib/tenant'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/layout/Sidebar'
import NotificationsBell from '@/components/layout/NotificationsBell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const tenant = await getTenant()

  const unreadCount = tenant
    ? await prisma.alerta.count({ where: { centroId: tenant.centroId, leida: false } })
    : 0

  return (
    <div className="flex h-full">
      <Sidebar
        centroNombre={tenant?.centroNombre ?? 'Mi centro'}
        userEmail={user.email ?? ''}
      />

      {/* Main */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Bell — fixed in header row top-right of main area */}
        <div className="absolute right-8 top-3.5 z-40">
          <NotificationsBell initialCount={unreadCount} />
        </div>
        {children}
      </div>
    </div>
  )
}
