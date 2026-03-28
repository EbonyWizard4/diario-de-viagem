'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { ROUTES_MOCK } from '@/constants/mockData';
import Image from 'next/image';
import Link from 'next/link';

export default function ExplorarPage() {
  const [busca, setBusca] = useState('');

  const bairros = ["Mooca", "Pinheiros", "Vila Madalena", "Liberdade", "Lapa", "Santa Teresa"];

  return (
    <main className="flex flex-col min-h-screen bg-white pb-24">
      {/* Header com botão Criar */}
      <header className="p-6 pb-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-orange-600 font-bold text-sm uppercase tracking-wider mb-1">Roteiro</h1>
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              O que explorar hoje? 🗺️
            </h2>
          </div>
          <button className="bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1 shadow-md shadow-orange-200">
            <Plus className="w-3 h-3" /> Criar
          </button>
        </div>

        {/* Barra de Busca Estilizada */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text"
            placeholder="Buscar bairro, cidade ou tipo..."
            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* Bairros Populares (Pills) */}
        <section className="mb-8">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4">Bairros Populares</h3>
          <div className="flex flex-wrap gap-2">
            {bairros.map((bairro) => (
              <button 
                key={bairro}
                className="px-4 py-2 rounded-full border border-gray-100 text-xs font-bold text-gray-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all"
              >
                {bairro}
              </button>
            ))}
          </div>
        </section>

        {/* Rotas em Destaque */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Rotas em Destaque</h3>
            <span className="text-[10px] font-bold text-gray-300">{ROUTES_MOCK.length} rotas</span>
          </div>

          <div className="space-y-8">
            {ROUTES_MOCK.map((rota) => (
              <Link href={`/roteiro/${rota.id}`} key={rota.id} className="block group">
                <div className="relative">
                  {/* Ícone flutuante (Pizza no caso da Mooca) */}
                  <div className="absolute -top-4 -left-2 z-10 text-3xl bg-white w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center border border-gray-50 group-hover:scale-110 transition-transform">
                    🍕
                  </div>
                  
                  {/* Botão de Favorito */}
                  <button className="absolute top-2 right-2 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm">
                    <div className="w-4 h-4 border-2 border-gray-200 rounded-full" /> {/* Simulando o círculo do Figma */}
                  </button>

                  {/* Card de Conteúdo */}
                  <div className="bg-orange-50/30 rounded-[32px] p-6 pt-10 border border-orange-100/50">
                    <div className="flex gap-2 mb-3">
                      {rota.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] font-black tracking-widest text-orange-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h4 className="text-xl font-black text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {rota.title}
                    </h4>
                    
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-6">
                      {rota.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden relative">
                           {/* Avatar do Autor */}
                           <div className="bg-orange-200 w-full h-full flex items-center justify-center text-orange-600">
                             {rota.author[0]}
                           </div>
                        </div>
                        <span>Por {rota.author}</span>
                      </div>
                      <div className="flex gap-4">
                        <span>⏱️ ~{rota.duration}</span>
                        <span>📍 {rota.stopsCount} paradas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </header>
    </main>
  );
}