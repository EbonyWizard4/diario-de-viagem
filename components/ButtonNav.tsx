// src/components/BottomNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Para saber em qual página estamos
import { Home, Search, PlusSquare, Map, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  // Função simples para verificar se a rota está ativa e mudar a cor
  const isActive = (path: string) => pathname === path ? 'text-orange-600' : 'text-gray-400';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      
      {/* Home */}
      <Link href="/" className="flex flex-col items-center gap-1">
        <Home className={`${isActive('/')} w-6 h-6 transition-colors`} />
      </Link>

      {/* Busca/Explorar */}
      <Link href="/busca" className="flex flex-col items-center gap-1">
        <Search className={`${isActive('/busca')} w-6 h-6 transition-colors`} />
      </Link>

      {/* Botão Central de Criar (Destaque do Figma) */}
      <div className="relative -mt-10">
        <button className="bg-orange-600 p-3 rounded-2xl shadow-orange-200 shadow-lg border-4 border-white active:scale-95 transition-transform">
          <PlusSquare className="text-white w-7 h-7" />
        </button>
      </div>

      {/* Mapa (Pode ser uma página futura) */}
      <Link href="/" className="flex flex-col items-center gap-1">
        <Map className={`${isActive('/mapa')} w-6 h-6 transition-colors`} />
      </Link>

      {/* Perfil */}
      <Link href="/perfil" className="flex flex-col items-center gap-1">
        <User className={`${isActive('/perfil')} w-6 h-6 transition-colors`} />
      </Link>

    </nav>
  );
}