import { Metadata, Viewport } from 'next';
import Layout from '@/layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}

const META = {
    TITLE: 'Pintar Zonasi',
    DESCRIPTION: 'Pintar Zonasi : Aplikasi untuk sistem zonasi sekolah yang lebih transparan.',
    URL: '',
    IMAGES: []
};

export const metadata: Metadata = {
    title: META.TITLE,
    description: META.DESCRIPTION,
    robots: { index: false, follow: false },
    openGraph: {
        type: 'website',
        title: META.TITLE,
        url: META.URL,
        description: META.DESCRIPTION,
        images: META.IMAGES,
        ttl: 604800
    },
    icons: {
        icon: '/favicon.ico'
    }
};

export const viewport: Viewport = {
    initialScale: 1,
    width: 'device-width'
};

export default function AppLayout({ children }: AppLayoutProps) {
    return <Layout>{children}</Layout>;
}
