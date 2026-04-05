import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BottomNav from '@/components/ButtonNav';
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Guia Local',
  description: 'Seu guia de roteiros locais',
  themeColor: '#ea580c', // Isso deixa a barra do navegador laranja no Android
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1', // Evita zoom indesejado em inputs

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      <BottomNav />
    </html>
  );
}
