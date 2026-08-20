import { headers } from 'next/headers'

export type TenantInfo = {
  centroId: string
  centroSlug: string
  centroNombre: string
}

// Lee la info del tenant desde los headers que inyecta el middleware.
// Solo disponible en Server Components y Route Handlers.
export async function getTenant(): Promise<TenantInfo | null> {
  const headersList = await headers()

  const centroId    = headersList.get('x-centro-id')
  const centroSlug  = headersList.get('x-centro-slug')
  const centroNombre = headersList.get('x-centro-nombre')

  if (!centroId || !centroSlug || !centroNombre) return null

  return { centroId, centroSlug, centroNombre }
}

// Extrae el subdominio del hostname.
// Funciona en producción (centro.kinexo.ar) y en local (centro.localhost:3000).
export function extractSlug(host: string): string | null {
  // Soporte para dominio configurable (producción: kinexo.ar, staging: kinexo-admin.vercel.app)
  const appDomains = (process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'kinexo.ar')
    .split(',')
    .map(d => d.trim())

  for (const domain of appDomains) {
    if (host.endsWith(`.${domain}`)) {
      return host.slice(0, host.lastIndexOf(`.${domain}`)).split(':')[0]
    }
  }

  if (host.includes('.localhost')) {
    return host.split('.localhost')[0]
  }

  return null
}
