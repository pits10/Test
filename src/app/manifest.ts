import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Travel DB - ホテル・店舗管理',
    short_name: 'Travel DB',
    description: '出張ホテルと会食店を蓄積・検索・可視化するPWAアプリ',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
