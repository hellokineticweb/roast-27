import type { Metadata, Viewport } from 'next';
import { Cinzel, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { Navigation } from '@/components/ui/Navigation';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0d0a08',
};

export const metadata: Metadata = {
  title: 'ROAST / 27 — Specialty Coffee Atelier & 3D Experience',
  description:
    'Small-batch specialty coffee crafted around flavour, ritual and time. An immersive 3D cinematic journey from high-altitude volcanic terroir to your precision pour-over.',
  keywords: [
    'specialty coffee',
    '3D coffee experience',
    'single-origin micro-lot',
    'pour-over ritual',
    'roast 27',
    'cinematic product design',
  ],
  authors: [{ name: 'ROAST / 27 Creative Atelier' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/favicon.svg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#0d0a08] text-[#f5f0eb] antialiased selection:bg-[#e09f67] selection:text-[#0d0a08] flex flex-col font-sans">
        <CartProvider>
          <CustomCursor />
          <Navigation />
          <CartDrawer />
          <main className="flex-1 w-full relative">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
