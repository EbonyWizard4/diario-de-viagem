'use client';
// src/app/page.tsx
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Importante para a navegação
import { ROUTES_MOCK } from '@/constants/mockData';
import { HelpCircle } from 'lucide-react';
import BottomNav from '@/components/ButtonNav';

export default function Home() {
  // Pegamos o primeiro roteiro do mock para o destaque
  const destaque = ROUTES_MOCK[0];
  const [pesquisa, setPesquisa] = useState('');
  const [viewMode, setViewMode] = useState<'lista' | 'mapa'>('lista');
  // Lógica de filtro: busca no título ou nas tags
  const resultados = ROUTES_MOCK.filter(rota =>
    rota.title.toLowerCase().includes(pesquisa.toLowerCase()) ||
    rota.tags.some(tag => tag.toLowerCase().includes(pesquisa.toLowerCase()))
  );

  return (
    <main className="flex flex-col min-h-screen bg-white pb-24">
      {/* Header com Logo e Info */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <div className="bg-orange-600 p-1.5 rounded-lg text-white">
            <span className="font-bold text-xl">R</span>
          </div>
          <h1 className="text-orange-600 font-bold text-xl tracking-tight">Roteiro</h1>
        </div>
        <HelpCircle className="text-gray-300 w-6 h-6" />
      </header>

      {/* Hero Text */}
      <section className="px-6 py-4">
        <h2 className="text-[32px] font-extrabold leading-[1.1] text-gray-900 mb-4">
          Descubra a cidade <br />
          pelos olhos de <br />
          quem vive nela.
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-[280px]">
          Rotas turísticas, gastronômicas e culturais criadas por pessoas reais. Explore o melhor de cada bairro, no seu ritmo.
        </p>
      </section>

      {/* Card de Destaque - Elemento de Acesso à Busca */}
      <section className="px-6 mt-6">
        {resultados.map((rota) => (
          <Link href={`/roteiro/${rota.id}`} key={rota.id}>
            <div className="relative group cursor-pointer overflow-hidden rounded-3xl shadow-xl aspect-[4/3]">
              {/* Imagem de Fundo (Placeholder enquanto você não sobe a real) */}
              {/* --- ATUALIZAÇÃO DA IMAGEM --- */}
              {destaque.imageUrl ? (
                <Image
                  src={destaque.imageUrl} // Usando o caminho definido no MockData
                  alt={destaque.title}
                  fill // Faz a imagem preencher o contêiner 'relative'
                  className="object-cover group-hover:scale-105 transition-transform duration-300" // Cobre a área e adiciona efeito hover
                  priority // Carrega esta imagem com prioridade (LCP)
                />
              ) : (
                // Esqueleto de carregamento se não houver imagem
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              {/* ------------------------------- */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <div className="absolute inset-0 bg-gray-200 animate-pulse" /> {/* Esqueleto de carregamento */}

              {/* Conteúdo do Card */}
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full text-white">
                <div className="flex gap-2 mb-2">
                  <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded">GASTRONOMIA</span>
                  <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded">CULTURA</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{destaque.title}</h3>
                <div className="flex items-center gap-4 text-xs opacity-90">
                  <span>📍 {destaque.stopsCount} paradas</span>
                  <span>⏱️ ~{destaque.duration}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Lista Rápida de Benefícios (conforme o Figma) */}
      <section className="px-6 mt-10 space-y-6">
        <div className="flex items-start gap-4">
          <div className="bg-orange-50 p-2 rounded-xl text-orange-600 font-bold">🗺️</div>
          <div>
            <h4 className="font-bold text-gray-900">Roteiros Prontos</h4>
            <p className="text-xs text-gray-500">Do café da manhã ao samba, roteiros completos passo a passo.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-blue-50 p-2 rounded-xl text-blue-600 font-bold">👥</div>
          <div>
            <h4 className="font-bold text-gray-900">Comunidade Local</h4>
            <p className="text-xs text-gray-500">Dicas e avaliações de quem realmente conhece o lugar.</p>
          </div>
        </div>
      </section>
      {/* ButtonNavgation */}
      < BottomNav />
    </main>
  );
}