import Layout from '@/layout/layout';
import { Metadata, Viewport } from 'next'; 

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Pintar Zonasi',
    description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
    robots: { index: false, follow: false },
    openGraph: {
        type: 'website',
        title: 'PrimeReact SAKAI-REACT',
        url: 'https://sakai.primereact.org/',
        description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
        images: ['https://www.primefaces.org/static/social/sakai-react.png'],
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
