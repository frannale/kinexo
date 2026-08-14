import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTenant } from '@/lib/tenant'
import Sidebar from '@/components/layout/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Doble check de auth (el middleware ya redirige, esto es defensa en profundidad)
  if (!user) redirect('/login')

  const tenant = await getTenant()

  return (
    <div className="flex h-full">
      <Sidebar
        centroNombre={tenant?.centroNombre ?? 'Mi centro'}
        userEmail={user.email ?? ''}
      />

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
