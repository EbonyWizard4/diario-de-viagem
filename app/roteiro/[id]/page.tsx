'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES_MOCK } from '@/constants/mockData';
import { ArrowLeft, Heart, Share2, Clock, MapPin, DollarSign } from 'lucide-react';

export default function RoteiroDetalhes() {
  const params = useParams();
  const router = useRouter();
  
  // Busca o roteiro correto baseado no ID da URL
  const roteiro = ROUTES_MOCK.find(r => r.id === params.id);

  if (!roteiro) {
    return <div className="p-10 text-center">Roteiro não encontrado.</div>;
  }

  return (
    <main className="flex flex-col min-h-screen bg-white pb-10">
      {/* Header com Imagem e Botões Flutuantes */}
      <header className="relative h-72 w-full">
        <Image 
          src={roteiro.imageUrl} 
          alt={roteiro.title} 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
        
        <div className="absolute top-6 left-6 right-6 flex justify-between z-10">
          <button onClick={() => router.back()} className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div className="flex gap-2">
            <button className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg"><Heart className="w-5 h-5 text-gray-400" /></button>
            <button className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg"><Share2 className="w-5 h-5 text-gray-900" /></button>
          </div>
        </div>
      </header>

      {/* Info Principal */}
      <section className="px-6 -mt-12 z-20 relative">
        <div className="bg-orange-50/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-xl">
          <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">
            {roteiro.title}
          </h1>
          <p className="text-sm text-gray-600 mb-4 italic">"{roteiro.description}"</p>
          
          <div className="flex justify-between items-center border-t border-orange-200/50 pt-4">
            <div className="flex flex-col items-center">
              <MapPin className="w-4 h-4 text-orange-600 mb-1" />
              <span className="text-[10px] font-bold text-gray-500">{roteiro.stopsCount} paradas</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-4 h-4 text-orange-600 mb-1" />
              <span className="text-[10px] font-bold text-gray-500">~{roteiro.duration}</span>
            </div>
            <div className="flex flex-col items-center">
              <DollarSign className="w-4 h-4 text-orange-600 mb-1" />
              <span className="text-[10px] font-bold text-gray-500">Médio</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline das Paradas */}
      <section className="px-6 mt-8">
        <h3 className="text-xs font-black uppercase tracking-[3px] text-gray-400 mb-8">O Roteiro</h3>
        
        <div className="space-y-12 relative">
          {/* Linha vertical da Timeline */}
          <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-orange-500 via-blue-500 to-green-500 rounded-full" />

          {roteiro.stops.map((stop, index) => (
            <div key={stop.id} className="relative pl-12">
              {/* Círculo do Número */}
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 border-orange-500 flex items-center justify-center z-10 shadow-sm">
                <span className="text-[10px] font-black text-orange-600">{index + 1}</span>
              </div>

              {/* Card da Parada */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-black tracking-widest text-orange-500 uppercase">
                    PARADA {index + 1} - {stop.type}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {stop.timeRange}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">{stop.name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{stop.description}</p>
                
                <div className="flex items-center gap-4 pt-3 border-t border-gray-200/50">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    📍 5 min até a próxima
                  </span>
                  <span className="text-[10px] font-bold text-gray-900">{stop.priceLevel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}