import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cevop — Restaurant Management Software',
    short_name: 'Cevop',
    description: 'Restaurant operations platform. QR ordering, live service display, real-time staff management.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#00B3A6',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
