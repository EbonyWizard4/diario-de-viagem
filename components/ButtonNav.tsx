// src/components/BottomNav.tsx
'use client';

import { useState, useEffect } from 'react'; // Adicionado useEffect
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, PlusSquare, Map, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CreateActionMenu from '@/components/CreateActionMenu';
import { db } from '@/lib/firebase'; // Importe o seu db
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'; // Importe os métodos do Firestore

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Criamos o estado de visitas aqui dentro também
  const [visitas, setVisitas] = useState<any[]>([]);

  const isActive = (path: string) => pathname === path ? 'text-orange-600' : 'text-gray-400';

  // Função para buscar visitas apenas quando necessário
  const fetchVisitas = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'checkins'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVisitas(docs);
    } catch (error) {
      console.error("Erro ao buscar visitas para o menu:", error);
    }
  };

  const handlePlusClick = async () => {
    if (loading) return;
    if (!user) {
      router.push('/perfil');
      return;
    }
    
    // Antes de abrir o menu, buscamos as visitas atualizadas
    await fetchVisitas();
    setIsMenuOpen(true);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {/* ... SEUS LINKS (HOME, BUSCA...) ... */}
        <Link href="/" className="flex flex-col items-center gap-1">
          <Home className={`${isActive('/')} w-6 h-6 transition-colors`} />
        </Link>

        <Link href="/busca" className="flex flex-col items-center gap-1">
          <Search className={`${isActive('/busca')} w-6 h-6 transition-colors`} />
        </Link>

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

      <CreateActionMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        visitas={visitas} // Agora 'visitas' existe no estado deste componente!
      />
    </>
  );
}