import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BottomNav from '@/components/ButtonNav';
import "./globals.css";

// src/app/layout.tsx
import { AuthProvider } from '@/context/AuthContext';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. O que fica no Metadata (Informações de busca)
export const metadata: Metadata = {
  title: 'Meu Perfil | Guia Local',
  description: 'Seu guia de roteiros locais',
};

// 2. O que vai para o Viewport (Configurações do dispositivo/tela)
export const viewport: Viewport = {
  themeColor: '#ea580c', // Isso deixa a barra do navegador laranja no Android
  // Evita zoom indesejado em inputs
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
