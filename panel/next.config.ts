import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Permite que los headers inyectados por el middleware sean accesibles
  // en Server Components vía next/headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'x-centro-id',     value: '' },
          { key: 'x-centro-slug',   value: '' },
          { key: 'x-centro-nombre', value: '' },
        ],
      },
    ]
  },
}

export default nextConfig
