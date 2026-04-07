// src/components/BottomNav.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, PlusSquare, Map, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // Importando seu hook de Auth
import CreateActionMenu from '@/components/CreateActionMenu'; // O novo componente que vamos criar

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth(); // Pegando o status do usuário
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path ? 'text-orange-600' : 'text-gray-400';

  // Lógica centralizada de clique
  const handlePlusClick = () => {
    if (loading) return; // Se ainda estiver carregando, não faz nada
    if (!user) {
      // Se não estiver logado, manda pro perfil/login
      router.push('/perfil');
      return;
    }
    // Se estiver logado, abre o menu
    setIsMenuOpen(true);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        
        <Link href="/" className="flex flex-col items-center gap-1">
          <Home className={`${isActive('/')} w-6 h-6 transition-colors`} />
        </Link>

        <Link href="/busca" className="flex flex-col items-center gap-1">
          <Search className={`${isActive('/busca')} w-6 h-6 transition-colors`} />
        </Link>

        {/* Botão Central com a lógica de Auth */}
        <div className="relative -mt-10">
          <button 
            onClick={handlePlusClick}
            className="bg-orange-600 p-3 rounded-2xl shadow-orange-200 shadow-lg border-4 border-white active:scale-95 transition-transform"
          >
            <PlusSquare className="text-white w-7 h-7" />
          </button>
        </div>

        <Link href="/desafios" className="flex flex-col items-center gap-1">
          <Map className={`${isActive('/desafios')} w-6 h-6 transition-colors`} />
        </Link>

        <Link href="/perfil" className="flex flex-col items-center gap-1">
          <User className={`${isActive('/perfil')} w-6 h-6 transition-colors`} />
        </Link>
      </nav>

      {/* Componente Desacoplado */}
      <CreateActionMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </>
  );
}