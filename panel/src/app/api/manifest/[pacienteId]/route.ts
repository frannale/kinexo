export async function GET(
  _req: Request,
  { params }: { params: Promise<{ pacienteId: string }> }
) {
  const { pacienteId } = await params

  return Response.json({
    name: 'Kinexo',
    short_name: 'Kinexo',
    description: 'Tu rutina de kinesiología',
    start_url: `/sesion/${pacienteId}`,
    display: 'standalone',
    background_color: '#f6fbff',
    theme_color: '#4a9af4',
    icons: [
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  })
}
