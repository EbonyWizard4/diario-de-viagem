// desafios/page.tsx

'use client';

import { useEffect, useState, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import RouteCard from '@/components/RouteCard';
import { Search } from 'lucide-react';

export default function HomePage() {
  const [rotasProximas, setRotasProximas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [busca, setBusca] = useState('');

  // --- LÓGICA DE LOCALIZAÇÃO ---
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  useEffect(() => {
    async function fetchRotas() {
      setLoading(true);
      try {
        const q = query(collection(db, 'routes'), limit(20));
        const snap = await getDocs(q);
        const logicRotas = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRotasProximas(logicRotas);
      } catch (e) {
        console.error("Erro ao buscar rotas:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchRotas();
  }, [userLocation]);

  // --- LÓGICA DINÂMICA: EXTRAIR BAIRROS ÚNICOS ---
  const bairrosDinamicos = useMemo(() => {
    const listaBairros = rotasProximas
      .map(r => r.bairro)
      .filter((b): b is string => !!b); // Remove nulos ou vazios
    return Array.from(new Set(listaBairros)).sort(); // Remove duplicatas e ordena
  }, [rotasProximas]);

  // --- LÓGICA DE FILTRO ---
  const rotasFiltradas = useMemo(() => {
    return rotasProximas.filter(rota => {
      const termo = busca.toLowerCase();
      return (
        rota.title?.toLowerCase().includes(termo) ||
        rota.bairro?.toLowerCase().includes(termo) ||
        rota.description?.toLowerCase().includes(termo)
      );
    });
  }, [busca, rotasProximas]);

  return (
    <main className="flex flex-col min-h-screen bg-white pb-24">
      {/* Cabeçalho */}
      <header className="p-6 pb-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-orange-600 font-bold text-sm uppercase tracking-wider mb-1">Roteiro</h1>
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              O que explorar hoje? 🗺️
            </h2>
          </div>
        </div>
      </header>

      {/* Barra de Busca */}
      <div className="relative mb-8 px-6">
        <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar bairro, cidade ou tipo..."
          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* Bairros Dinâmicos (Vindos da Base) */}
      <section className="mb-8 px-6">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4">Bairros Populares</h3>
        <div className="flex flex-wrap gap-2">
          {/* Botão para limpar filtro */}
          <button
            onClick={() => setBusca('')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${busca === '' ? 'bg-orange-600 text-white border-orange-600' : 'bg-gray-50 text-gray-600 border-gray-100'
              }`}
          >
            Todos
          </button>

          {bairrosDinamicos.map((bairro) => (
            <button
              key={bairro}
              onClick={() => setBusca(bairro)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${busca === bairro ? 'bg-orange-600 text-white border-orange-600' : 'bg-gray-50 text-gray-600 border-gray-100'
                }`}
            >
              {bairro}
            </button>
          ))}
        </div>
      </section>

      {/* Listagem de Rotas */}
      <section className="px-6">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Rotas em Destaque</h3>
          <span className="text-[10px] font-bold text-gray-300">{rotasFiltradas.length} encontradas</span>
        </div>

        {loading ? (
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-[40px]" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {rotasFiltradas.length > 0 ? (
              rotasFiltradas.map((rota) => (
                <RouteCard
                  key={rota.id}
                  rota={rota}
                  userLocation={userLocation} // 👈 Passando a posição atual do usuário
                />
              ))
            ) : (
              <div className="text-center py-20 text-gray-400 italic">
                Nenhum roteiro encontrado para "{busca}".
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}