// app/busca/page.tsx
// app/busca/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { Search, ArrowLeft, SlidersHorizontal, Map as MapIcon, List, Loader2 } from 'lucide-react';
import RouteCardBusca from '@/components/RouteCard'; // Componente que acabamos de ajustar
import FilterBar from '@/components/FilterBar';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-3xl" />
});

export default function BuscaPage() {
  const [pesquisa, setPesquisa] = useState('');
  const [rotas, setRotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'lista' | 'mapa'>('lista');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);

  // 1. Pegar localização para o cálculo de distância no RouteCard
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  // 2. Buscar as rotas reais do Firebase
// app/busca/page.tsx

useEffect(() => {
  async function carregarRotas() {
    setLoading(true);
    try {
      const q = query(collection(db, 'routes'));
      const snap = await getDocs(q);
      
      // Aqui está o "pulo do gato"
      const listaComDetalhes = await Promise.all(snap.docs.map(async (routeDoc) => {
        const data = routeDoc.data();
        const stopsIds = data.stops || [];
        
        // Buscamos os dados de cada parada (checkin/local)
        const stopsPromessas = stopsIds.map(async (stopId: string) => {
          const stopDoc = await getDoc(doc(db, 'checkins', stopId));
          if (stopDoc.exists()) {
            const sData = stopDoc.data();
            return {
              id: stopDoc.id,
              name: sData.name || sData.title,
              // Ajuste conforme o nome do campo no seu Firebase (latitude ou lat)
              lat: sData.location?.latitude || sData.lat,
              lng: sData.location?.longitude || sData.lng
            };
          }
          return null;
        });

        const stopsResolved = (await Promise.all(stopsPromessas)).filter(s => s !== null);

        return {
          id: routeDoc.id,
          ...data,
          stopsData: stopsResolved // Agora o MapView vai encontrar os dados aqui!
        };
      }));

      setRotas(listaComDetalhes);
    } catch (e) {
      console.error("Erro ao hidratar rotas:", e);
    } finally {
      setLoading(false);
    }
  }
  carregarRotas();
}, []);

  // 3. Lógica de filtro atualizada (Pesquisa + Categoria)
  const resultados = rotas.filter(rota => {
    const matchesPesquisa =
      rota.title?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      rota.bairro?.toLowerCase().includes(pesquisa.toLowerCase());

    const matchesCategoria = categoriaSelecionada
      ? rota.category === categoriaSelecionada
      : true;

    return matchesPesquisa && matchesCategoria;
  });


  const CATEGORIAS = [
    { id: 'gastronomia', label: 'Gastronomia', icon: '🍕' },
    { id: 'artes', label: 'Artes', icon: '🎨' },
    { id: 'passeios', label: 'Passeios', icon: '🚲' },
    { id: 'role', label: 'Rolê', icon: '🏙️' },
  ];

  // Dentro da BuscaPage()
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Erro ao obter localização", error);
          // Fallback: se o usuário negar, você pode setar a posição de Franco da Rocha ou SP
          setUserLocation({ lat: -23.3275, lng: -46.7272 });
        }
      );
    }
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header (Mantido conforme seu código, mas com z-index fixo) */}
      <header className="bg-white p-6 pb-4 sticky top-0 z-30 shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <ArrowLeft className="text-gray-900 w-6 h-6 hover:text-orange-600 transition-colors" />
          </Link>
          <h1 className="text-xl font-black text-gray-900 italic uppercase">Explorar</h1>
        </div>

        {/* Botão de Filtros */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Para onde vamos?"
              className="w-full bg-gray-100 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>

          {/* Botão que agora controla o componente à parte */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-2xl transition-all active:scale-95 ${showFilters || categoriaSelecionada ? 'bg-orange-600 text-white shadow-lg' : 'bg-orange-50 text-orange-600'
              }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* botão de escolha Lista Mapa */}
        <div className="flex mt-4 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('lista')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'lista' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}
          >
            <List className="w-4 h-4" /> Lista
          </button>
          <button
            onClick={() => setViewMode('mapa')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'mapa' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}
          >
            <MapIcon className="w-4 h-4" /> Mapa
          </button>
        </div>

        {/* Instância do componente de Filtro */}
        <FilterBar
          isOpen={showFilters}
          selectedCategory={categoriaSelecionada}
          onSelectCategory={setCategoriaSelecionada}
        />
      </header>

      {/* Resultados */}
      <section className="p-6">
        {viewMode === 'lista' ? (
          <div className="space-y-6">
            {resultados.map((rota) => (
              <RouteCardBusca key={rota.id} rota={rota} userLocation={userLocation} />
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <MapView rotas={resultados} userLocation={userLocation} />
            <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase text-center tracking-widest">
              Toque nos pins para ver detalhes das rotas
            </p>
          </div>
        )}
      </section>
    </main>
  );
}