import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { extractSlug } from '@/lib/tenant'

// Rutas accesibles sin sesión iniciada
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── 1. Crear cliente Supabase (Edge-compatible, sin Prisma) ──────────────
  // Necesario para refrescar el token de sesión en cada request.
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Propaga las cookies al request y al response
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca el token si está por vencer (no usar getSession — es inseguro en server)
  const { data: { user } } = await supabase.auth.getUser()

  // ── 2. Resolver tenant por subdominio ────────────────────────────────────
  const host = request.headers.get('host') ?? ''
  const slug = extractSlug(host)

  // Sin subdominio → es el dominio raíz, dejamos pasar (p. ej. la landing)
  if (!slug) {
    return response
  }

  // Consultar el centro por slug usando el cliente Supabase (funciona en Edge)
  // Requiere política RLS: centros son legibles por el rol anon si activo = true
  const { data: centro, error } = await supabase
    .from('centros')
    .select('id, nombre, slug, activo')
    .eq('slug', slug)
    .eq('activo', true)
    .single()

  // Centro no encontrado o inactivo → 404
  if (error || !centro) {
    return NextResponse.rewrite(new URL('/not-found', request.url))
  }

  // ── 3. Control de acceso ─────────────────────────────────────────────────
  const isPublicRoute = PUBLIC_ROUTES.some(r => pathname.startsWith(r))

  if (!user && !isPublicRoute) {
    // No autenticado accediendo a ruta protegida → login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (user && pathname === '/login') {
    // Ya autenticado intentando entrar al login → dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // ── 4. Inyectar info del tenant en headers para Server Components ────────
  response.headers.set('x-centro-id',     centro.id)
  response.headers.set('x-centro-slug',   centro.slug)
  response.headers.set('x-centro-nombre', centro.nombre)

  return response
}

export const config = {
  matcher: [
    // Excluye archivos estáticos y rutas internas de Next.js
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
