import type { Metadata } from 'next';
import { Outfit, IBM_Plex_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'AutoLeads | Automatizacion de leads con IA',
  description:
    'Demo de pipeline de IA que clasifica, puntua y responde leads inmobiliarios automaticamente. Por Federico Cione.',
  openGraph: {
    title: 'AutoLeads — Automatizacion de leads con IA',
    description:
      'Pipeline de IA para clasificar y responder leads inmobiliarios. Demo publica.',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'AutoLeads — Automatizacion de leads con IA',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${ibmPlexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
