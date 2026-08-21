import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 60, // segundos que el cliente reutiliza una página ya visitada
    },
  },
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
