'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext'
import Image from 'next/image';
import { Settings, MapPin, Award, Heart, LogOut, ChevronRight } from 'lucide-react';
import { ROUTES_MOCK } from '@/constants/mockData';
import Link from 'next/link';
// Exemplo de função de Login para usar no componente
import { signInWithPopup } from "firebase/auth";
import { db, auth, googleProvider } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import VisitCard from '@/components/VisitCard';

export default function PerfilPage() {
  const favoritos = ROUTES_MOCK.slice(0, 2);

  // 1. Pegamos o 'loading' do AuthContext
  const { user, loginComGoogle, logout, loading: authLoading } = useAuth();

  // 2. Criamos o estado das visitas com o nome correto
  const [loadingVisitas, setLoadingVisitas] = useState(true);
  const [visitas, setVisitas] = useState<any[]>([]);
  const [exibirTodos, setExibirTodos] = useState(false); // Estado para o botão "Mostrar Mais"

  // Lógica para as 3 melhores e mais recentes
  // Primeiro, ordenamos por nota (descendente) e depois por data (que já vem do Firebase)
  const visitasExibidas = exibirTodos
    ? visitas
    : [...visitas]
      .sort((a, b) => b.rating - a.rating) // Prioriza nota maior
      .slice(0, 3); // Pega apenas as 3 primeiras

  useEffect(() => {
    // Se o Auth ainda está carregando ou se não tem usuário, não faz nada
    // Usamos 'authLoading' para não confundir com o outro loading
    if (authLoading || !user) return;

    setLoadingVisitas(true);

    const q = query(
      collection(db, 'checkins'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVisitas(docs);
        setLoadingVisitas(false);
      },
      (error) => {
        console.error("Erro na busca:", error);
        setLoadingVisitas(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]); // Dependências atualizadas

  // 1. Enquanto o Firebase descobre se você está logado ou não
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-500 font-bold animate-pulse">Sincronizando seu perfil...</p>
      </div>
    );
  }

  // 2. Se o loading acabou e realmente não tem ninguém logado
  if (!user) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-center">
        <h2 className="text-2xl font-black mb-4">Bem-vindo ao Guia Local</h2>
        <p className="text-gray-500 mb-8 text-sm">Faça login para salvar seus roteiros e ganhar medalhas!</p>
        <button
          onClick={loginComGoogle}
          className="flex items-center gap-3 bg-white border border-gray-200 px-6 py-3 rounded-2xl shadow-sm font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
        >
          <Image src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} priority />
          Entrar com Google
        </button>
      </main>
    );
  }

  // 3. Se chegou aqui, temos usuário e podemos renderizar a página principal
  return (
    <main className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header do Perfil */}
      <header className="bg-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div className="relative">
            <div className="relative w-24 h-24 rounded-3xl bg-orange-100 overflow-hidden border-4 border-white shadow-md">
              {user.photoURL ? (
                <Image src={user.photoURL} alt={user.displayName || ""} fill className="rounded-3xl border-4 border-white shadow-md object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              ) : (
                <div className="w-full h-full rounded-3xl bg-orange-100 flex items-center justify-center text-3xl">👤</div>
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 bg-orange-600 text-white p-2 rounded-xl shadow-lg border-2 border-white">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Nível 5
            </span>
            <p className="text-xs text-gray-400 mt-1 font-bold">1.250 XP</p>
          </div>
        </div>

        <h2 className="text-2xl font-black text-gray-900">{user.displayName}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3" /> São Paulo, SP
        </p>
        <button
          onClick={logout}
          className="mt-6 flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 px-4 py-2 rounded-xl"
        >
          <LogOut className="w-4 h-4" /> Sair da conta
        </button>
      </header>

      {/* Grid de Stats Rápidos */}
      <section className="grid grid-cols-2 gap-4 px-6 -mt-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Roteiros</p>
          <p className="text-xl font-black text-gray-900">12</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Medalhas</p>
          <p className="text-xl font-black text-gray-900">4</p>
        </div>
      </section>

      {/* Seção de Conquistas */}
      <section className="px-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Award className="text-orange-600 w-5 h-5" /> Conquistas
          </h3>
          <button className="text-xs font-bold text-orange-600">Ver todas</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {['🍕', '🎨', '🚲', '🏙️'].map((emoji, i) => (
            <div key={i} className="min-w-[70px] aspect-square bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-gray-100">
              {emoji}
            </div>
          ))}
        </div>
      </section>

      {/* Roteiros Favoritos */}
      <section className="px-6 mt-8">
        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Heart className="text-red-500 w-5 h-5 fill-red-500" /> Meus Favoritos
        </h3>
        <div className="space-y-4">
          {favoritos.map((rota) => (
            <Link href={`/roteiro/${rota.id}`} key={rota.id} className="flex bg-white p-3 rounded-2xl border border-gray-100 shadow-sm gap-4 active:scale-[0.98] transition-transform">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                <Image src={rota.imageUrl} alt={rota.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              </div>
              <div className="flex flex-col justify-center overflow-hidden">
                <h4 className="font-bold text-gray-900 text-sm truncate">{rota.title}</h4>
                <p className="text-[10px] text-gray-400 font-medium">Por {rota.author}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-[8px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase">
                    {rota.tags[0]}
                  </span>
                </div>
              </div>
              <div className="flex items-center ml-auto">
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Card de Visitas Recentes */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-4 px-6">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 uppercase text-xs tracking-widest">
            <MapPin className="text-orange-600 w-5 h-5" /> Minhas Experiências
          </h3>
          {!exibirTodos && visitas.length > 3 && (
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
              TOP 3
            </span>
          )}
        </div>

        {authLoading ? (
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-64 bg-gray-200 rounded-[32px]" />
            <div className="h-64 bg-gray-200 rounded-[32px]" />
          </div>
        ) : loadingVisitas ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-[32px]" />
            ))}
          </div>
        ) : visitasExibidas.length > 0 ? (
          <>
            {visitasExibidas.map((visita) => (
              <VisitCard
                key={visita.id}
                placeName={visita.placeName}
                comment={visita.comment}
                rating={visita.rating}
                photoUrl={visita.photoUrl}
                date={visita.timestamp}
              />
            ))}
            {/* Botão Mostrar Mais / Ver Menos */}
            {visitas.length > 3 && (
              <button
                onClick={() => setExibirTodos(!exibirTodos)}
                className="w-full py-4 mt-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {exibirTodos ? "Ver menos" : `Mostrar mais (${visitas.length - 3} restantes)`}
                <ChevronRight className={`w-4 h-4 transition-transform ${exibirTodos ? 'rotate-90' : ''}`} />
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="italic">Nenhuma visita registrada ainda.</p>
            <p className="text-sm">Bora explorar a cidade?</p>
          </div>
        )}
      </section>

      {/* Botão de Sair no final */}
      <section className="px-6 mt-12 mb-10">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 font-bold rounded-2xl border border-red-100 active:scale-95 transition-all"
        >
          <LogOut className="w-4 h-4" /> Sair da conta
        </button>
      </section>
    </main>
  );
}