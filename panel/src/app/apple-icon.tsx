import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: '#4a9af4',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '36px',
      }}
    >
      <span
        style={{
          color: 'white',
          fontSize: 72,
          fontWeight: 900,
          fontFamily: 'sans-serif',
          letterSpacing: '-2px',
        }}
      >
        Kx
      </span>
    </div>,
    { ...size }
  )
}
