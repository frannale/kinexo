import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

const SEED_EMAIL = 'admin@demo.kinexo.ar'
const SEED_PASSWORD = 'Kinexo123!'

async function main() {
  console.log('Seeding...\n')

  // 1. Centro
  const centro = await prisma.centro.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      nombre: 'Centro Demo Kinexo',
      slug: 'demo',
      emailContacto: 'demo@kinexo.ar',
      telefono: '+54 11 0000-0000',
      direccion: 'Buenos Aires, Argentina',
    },
  })
  console.log(`✓ Centro: ${centro.nombre} (slug: ${centro.slug})`)

  // 2. Supabase auth user
  let authUserId: string
  const { data: list } = await supabaseAdmin.auth.admin.listUsers()
  const existing = list?.users?.find(u => u.email === SEED_EMAIL)

  if (existing) {
    authUserId = existing.id
    console.log(`✓ Auth user ya existe: ${SEED_EMAIL}`)
  } else {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: SEED_EMAIL,
      password: SEED_PASSWORD,
      email_confirm: true,
    })
    if (error) throw error
    authUserId = data.user.id
    console.log(`✓ Auth user creado: ${SEED_EMAIL}`)
  }

  // 3. Usuario en DB
  await prisma.usuario.upsert({
    where: { supabaseAuthId: authUserId },
    update: {},
    create: {
      centroId: centro.id,
      supabaseAuthId: authUserId,
      nombre: 'Admin',
      apellido: 'Demo',
      email: SEED_EMAIL,
      rol: 'ADMIN_CENTRO',
    },
  })
  console.log(`✓ Usuario admin sincronizado`)

  // 4. Pacientes de muestra
  const count = await prisma.paciente.count({ where: { centroId: centro.id } })
  if (count === 0) {
    await prisma.paciente.createMany({
      data: [
        { centroId: centro.id, nombre: 'María',  apellido: 'López',   email: 'maria@example.com',  telefono: '+54 11 1111-1111', documento: '30000001', fechaNacimiento: new Date('1985-03-12') },
        { centroId: centro.id, nombre: 'Carlos', apellido: 'García',  email: 'carlos@example.com', telefono: '+54 11 2222-2222', documento: '30000002', fechaNacimiento: new Date('1990-07-22') },
        { centroId: centro.id, nombre: 'Ana',    apellido: 'Ramírez', email: 'ana@example.com',    telefono: '+54 11 3333-3333', documento: '30000003', fechaNacimiento: new Date('1978-11-05') },
        { centroId: centro.id, nombre: 'Juan',   apellido: 'Peralta', email: 'juan@example.com',   telefono: '+54 11 4444-4444', documento: '30000004', fechaNacimiento: new Date('1995-01-30') },
        { centroId: centro.id, nombre: 'Laura',  apellido: 'Sosa',    email: 'laura@example.com',  telefono: '+54 11 5555-5555', documento: '30000005', fechaNacimiento: new Date('1988-09-18') },
      ],
    })
    console.log(`✓ 5 pacientes creados`)
  } else {
    console.log(`✓ ${count} pacientes ya existen`)
  }

  console.log(`
─────────────────────────────────────
Seed completo.

Para probar el panel localmente:
  URL:      http://demo.localhost:3000
  Email:    ${SEED_EMAIL}
  Password: ${SEED_PASSWORD}
─────────────────────────────────────`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
