'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, limit, getDocs, where } from 'firebase/firestore';
import RouteCard from '@/components/RouteCard'; // Aquele que criamos com as fotos empilhadas
import { MapPin, Search } from 'lucide-react';

export default function HomePage() {
  const [rotasProximas, setRotasProximas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);

  const [busca, setBusca] = useState('');

  const bairros = ["Mooca", "Pinheiros", "Vila Madalena", "Liberdade", "Lapa", "Santa Teresa"];

  useEffect(() => {
    // 1. Pegar localização do usuário
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  useEffect(() => {
    async function fetchRotas() {
      setLoading(true);
      try {
        // Para o TCC, vamos simular a proximidade filtrando por "status: publica"
        // Em um sistema real, usaríamos geofire-common para filtrar por KM
        const q = query(
          collection(db, 'routes'),
          limit(10) // Pegamos as 10 mais recentes/relevantes
        );

        const snap = await getDocs(q);
        const logicRotas = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setRotasProximas(logicRotas);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchRotas();
  }, [userLocation]); // Re-executa se a localização mudar

  return (
    <main className="flex flex-col min-h-screen bg-white pb-24">
      {/* Header com Busca (Igual à Imagem 3) */}
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

        {/* Barra de Busca Estilizada */}
        <div className="relative mb-8 px-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar bairro, cidade ou tipo..."
            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

      {/* Bairros Populares (Filtros horizontais) */}
      <section className="mb-8 px-1">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4">Bairros Populares</h3>
        <div className="flex flex-wrap gap-2">
          {['Mooca', 'Pinheiros', 'Vila Madalena', 'Liberdade', 'Lapa'].map((bairro) => (
            <button key={bairro} className="px-5 py-2.5 bg-gray-50 rounded-full text-sm font-bold text-gray-600 whitespace-nowrap border border-gray-100 shadow-sm active:bg-orange-600 active:text-white transition-all">
              {bairro}
            </button>
          ))}
        </div>
      </section>

      {/* Listagem Real de Rotas */}
      <section className="px-2">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Rotas em Destaque</h3>
          <span className="text-[10px] font-bold text-gray-300">{rotasProximas.length} rotas</span>
        </div>

        {loading ? (
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-[40px]" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {rotasProximas.map((rota) => (
              <RouteCard
                key={rota.id}
                rota={rota} // Passa o objeto completo como o componente espera
                onPress={() => console.log("Abrir rota:", rota.id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}