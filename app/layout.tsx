import type { Metadata } from 'next';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({ variable: '--font-serif', subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'] });
const sans = Montserrat({ variable: '--font-sans-custom', subsets: ['latin'], weight: ['400', '500', '600'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://fabiola-jaime-2027.fizzycreek6.chatgpt.site'),
  title: 'Fabiola & Jaime | 13 de marzo de 2027',
  description: 'Acompáñanos a celebrar nuestro matrimonio el 13 de marzo de 2027.',
  openGraph: {
    title: 'Fabiola & Jaime | 13 de marzo de 2027',
    description: 'Acompáñanos a celebrar nuestro matrimonio.',
    type: 'website',
    images: [{ url: '/og.png', width: 1536, height: 1024, alt: 'Invitación de matrimonio de Fabiola & Jaime' }],
  },
  twitter: { card: 'summary_large_image', title: 'Fabiola & Jaime', description: '13 de marzo de 2027', images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${serif.variable} ${sans.variable}`}>{children}</body></html>;
}
