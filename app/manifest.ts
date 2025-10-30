import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Coda - AI-Powered Student Organizer',
    short_name: 'Coda',
    description: 'Organize your day, plan your tasks, and get AI-powered advice',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0f12',
    theme_color: '#9b87f5',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

