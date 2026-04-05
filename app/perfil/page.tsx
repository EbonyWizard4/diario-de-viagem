'use client';

import Image from 'next/image';
import { Settings, MapPin, Award, Heart, LogOut, ChevronRight } from 'lucide-react';
import { ROUTES_MOCK } from '@/constants/mockData';
import Link from 'next/link';

export default function PerfilPage() {
  // Vamos simular os favoritos pegando os 2 primeiros do mock
  const favoritos = ROUTES_MOCK.slice(0, 2);

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header do Perfil */}
      <header className="bg-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-orange-100 overflow-hidden border-4 border-white shadow-md">
               {/* Aqui iria a foto do usuário */}
               <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-orange-600">
                👤
               </div>
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

        <h2 className="text-2xl font-black text-gray-900">Seu Nome Aqui</h2>
        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3" /> São Paulo, SP
        </p>
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
                <Image src={rota.imageUrl} alt={rota.title} fill className="object-cover" />
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

      {/* Botão de Logout */}
      <section className="px-6 mt-10">
        <button className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 font-bold rounded-2xl border border-red-100">
          <LogOut className="w-4 h-4" /> Sair da conta
        </button>
      </section>
    </main>
  );
}