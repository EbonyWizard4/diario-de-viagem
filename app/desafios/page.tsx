'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, limit, getDocs, where } from 'firebase/firestore';
import RouteCard from '@/components/RouteCard'; // Aquele que criamos com as fotos empilhadas
import { MapPin, Search } from 'lucide-react';

export default function HomePage() {
  const [rotasProximas, setRotasProximas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

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
    <main className="min-h-screen bg-white pb-24">
      {/* Header com Busca (Igual à Imagem 3) */}
      <header className="px-6 pt-12 pb-6">
        <span className="text-orange-600 font-black uppercase tracking-widest text-[10px]">Roteiro</span>
        <h1 className="text-3xl font-black text-gray-900 italic mt-1">O que explorar hoje? 🗺️</h1>
        
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar bairro, cidade ou tipo..."
            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-medium text-sm focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </header>

      {/* Bairros Populares (Filtros horizontais) */}
      <section className="px-6 mb-8">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Bairros Populares</p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['Mooca', 'Pinheiros', 'Vila Madalena', 'Liberdade', 'Lapa'].map((bairro) => (
            <button key={bairro} className="px-5 py-2.5 bg-gray-50 rounded-full text-sm font-bold text-gray-600 whitespace-nowrap border border-gray-100 shadow-sm active:bg-orange-600 active:text-white transition-all">
              {bairro}
            </button>
          ))}
        </div>
      </section>

      {/* Listagem Real de Rotas */}
      <section className="px-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Rotas em Destaque</p>
          <span className="text-[10px] font-bold text-orange-600">{rotasProximas.length} rotas</span>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-32 bg-gray-100 animate-pulse rounded-[32px]" />
            <div className="h-32 bg-gray-100 animate-pulse rounded-[32px]" />
          </div>
        ) : (
          <div className="space-y-4">
            {rotasProximas.map((rota) => (
              <RouteCard 
                key={rota.id}
                title={rota.title}
                stopsCount={rota.stops.length}
                previewImages={[]} // Aqui depois puxamos as fotos das paradas
                onPress={() => {/* Ir para detalhes da rota */}}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}