import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Guia Local',
        short_name: 'GuiaLocal',
        description: 'Descubra a cidade pelos olhos de quem vive nela.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ea580c', // O laranja que estamos usando (orange-600)
        icons: [
            {
                src: '/icon.png', // O arquivo que você colocou em public ou app
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
