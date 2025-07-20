import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond, Caveat, Press_Start_2P } from 'next/font/google';
import './globals.css';

// Initialize fonts
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const caveat = Caveat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-caveat',
  display: 'swap',
});

const pressStart2P = Press_Start_2P({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-press-start-2p',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kalianïa - Digital Sanctuary',
  description: 'A multi-world digital portfolio experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true} className={`${inter.variable} ${cormorantGaramond.variable} ${caveat.variable} ${pressStart2P.variable}`}>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}