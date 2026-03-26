'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES_MOCK } from '@/constants/mockData';
import { Search, ArrowLeft, SlidersHorizontal, Map as MapIcon, List } from 'lucide-react';

export default function BuscaPage() {
  const [pesquisa, setPesquisa] = useState('');
  const [viewMode, setViewMode] = useState<'lista' | 'mapa'>('lista');

  // Lógica de filtro: busca no título ou nas tags
  const resultados = ROUTES_MOCK.filter(rota => 
    rota.title.toLowerCase().includes(pesquisa.toLowerCase()) ||
    rota.tags.some(tag => tag.toLowerCase().includes(pesquisa.toLowerCase()))
  );

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header de Busca */}
      <header className="bg-white p-6 pb-4 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <ArrowLeft className="text-gray-900 w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Buscar</h1>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Buscar bairro, cidade ou tipo..."
              className="w-full bg-gray-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-500 transition-all"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>
          <button className="bg-orange-50 p-3 rounded-xl text-orange-600">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle Lista/Mapa */}
        <div className="flex mt-4 bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode('lista')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'lista' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          >
            <List className="w-4 h-4" /> Lista
          </button>
          <button 
            onClick={() => setViewMode('mapa')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'mapa' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          >
            <MapIcon className="w-4 h-4" /> Mapa
          </button>
        </div>
      </header>

      {/* Listagem de Resultados */}
      <section className="p-6">
        <p className="text-sm text-gray-500 mb-4">
          Resultados em <span className="font-bold text-gray-900">"{pesquisa || 'Todos'}"</span>
          <br />
          <span className="text-xs">{resultados.length} rotas encontradas</span>
        </p>

        <div className="space-y-6">
          {resultados.map((rota) => (
            <Link href={`/roteiro/${rota.id}`} key={rota.id} className="block group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-transform active:scale-[0.98]">
                {/* Imagem do Roteiro */}
                <div className="relative h-40 w-full bg-gray-200">
                  <Image 
                    src={rota.imageUrl} 
                    alt={rota.title}
                    fill
                    className="object-cover"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-gray-400">
                    ❤️
                  </button>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-4">
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {rota.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[9px] font-black tracking-widest text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors">
                    {rota.title}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-2 mt-1 mb-4 leading-relaxed">
                    {rota.description}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-gray-50 pt-3 text-[10px] text-gray-400 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center text-[10px] text-orange-600 font-bold">
                        {rota.author[0]}
                      </div>
                      <span>Por {rota.author}</span>
                    </div>
                    <div className="flex gap-3">
                      <span>⏱️ ~{rota.duration}</span>
                      <span>📍 {rota.stopsCount} locais</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {resultados.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-400">Nenhum roteiro encontrado para "{pesquisa}"</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}