# Kinexo — Panel de administración

Panel web multi-tenant para centros de kinesiología. Permite gestionar pacientes, tratamientos, planes de ejercicio y hacer seguimiento clínico en tiempo real.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **Prisma 7** con driver adapter `@prisma/adapter-pg` (sin Prisma Accelerate)
- **Supabase** — auth (`@supabase/ssr`) + PostgreSQL
- **Tailwind CSS 4**
- **TypeScript**

## Arquitectura multi-tenant

Cada centro es un tenant identificado por su subdominio: `demo.kinexo.ar`, `centro.kinexo.ar`.

El archivo `src/proxy.ts` (equivalente al middleware de Next.js 16) resuelve el tenant a partir del subdominio, valida la sesión de Supabase y le inyecta los headers `x-centro-id`, `x-centro-slug` y `x-centro-nombre` a cada request. Los Server Components los leen vía `src/lib/tenant.ts`.

## Estructura del proyecto

```
panel/
├── prisma/
│   ├── schema.prisma       # Modelos: Centro, Usuario, Paciente, Tratamiento, Plan, Ejercicio, Evaluacion...
│   └── seed.ts             # Crea centro "demo" + usuario admin + pacientes de prueba
├── src/
│   ├── proxy.ts            # Middleware de tenant y auth (Next.js 16)
│   ├── lib/
│   │   ├── prisma.ts       # Cliente Prisma singleton con pg.Pool
│   │   ├── tenant.ts       # getTenant() — lee headers del proxy
│   │   └── supabase/       # Clientes Supabase (server / client)
│   ├── app/
│   │   ├── (auth)/login/   # Página de login
│   │   ├── (dashboard)/    # Panel admin (requiere auth + tenant)
│   │   │   ├── dashboard/
│   │   │   ├── pacientes/
│   │   │   ├── ejercicios/
│   │   │   ├── lesiones/
│   │   │   ├── kinesiologos/
│   │   │   └── configuracion/
│   │   ├── (paciente)/     # Vista del paciente (sesión de ejercicios)
│   │   │   └── sesion/[pacienteId]/
│   │   └── actions/        # Server Actions (pacientes, tratamientos, planes, evaluaciones, objetivos...)
│   └── components/
│       └── layout/         # Header, Sidebar, SidebarItem
└── public/
```

## Variables de entorno

Crear `.env.local` en `panel/`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
DATABASE_URL=postgresql://postgres.<project>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:<password>@db.<project>.supabase.co:5432/postgres
```

> La DB de Supabase en el plan gratuito es IPv6-only. El `DATABASE_URL` del pooler (puerto 6543, `pgbouncer=true`) es el que funciona en runtime. El `DIRECT_URL` se usa solo para migraciones (si tenés acceso IPv6).

## Desarrollo local

```bash
cd panel
npm install
npm run dev
```

Accedé como `demo.localhost:3000` para cargar el tenant de prueba.

Para que el subdominio funcione en local, `localhost` ya es reconocido por el proxy — no necesitás editar `/etc/hosts`.

## Schema y migraciones

Se usa `prisma db push` en lugar de `prisma migrate dev` (Supabase free tier no tiene shadow DB). Para cambios de schema en producción, ejecutar el SQL directamente en el SQL Editor de Supabase y luego regenerar el cliente:

```bash
npx prisma generate
```

## Seed

```bash
npm run seed
```

Crea:
- Centro "demo" (slug: `demo`)
- Usuario admin (`admin@demo.kinexo.ar` / `Kinexo123!`) en Supabase Auth + tabla `usuarios`
- 5 pacientes de prueba

## Deploy (Vercel)

- **Root Directory**: `panel`
- **Framework Preset**: Next.js
- **Build Command**: `next build` (el `postinstall` corre `prisma generate` automáticamente)
- Agregar todas las variables de entorno en Vercel → Settings → Environment Variables

## Módulos implementados

| Módulo | Ruta |
|--------|------|
| Dashboard | `/dashboard` |
| Pacientes | `/pacientes` |
| Ficha paciente | `/pacientes/[id]` |
| Nuevo tratamiento | `/pacientes/[id]/tratamientos/nuevo` |
| Tratamiento + plan | `/pacientes/[id]/tratamientos/[tid]` |
| Nueva evaluación clínica | `/pacientes/[id]/tratamientos/[tid]/evaluaciones/nueva` |
| Ejercicios | `/ejercicios` |
| Lesiones | `/lesiones` |
| Kinesiólogos | `/kinesiologos` |
| Configuración | `/configuracion` |
| Sesión del paciente | `/sesion/[pacienteId]` |
