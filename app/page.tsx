/* app/page.tsx */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { HelpCircle, MapPin } from 'lucide-react';
import { getDestaqueRoute, RouteData } from '@/services/routeService';

export default function Home() {
  const [destaque, setDestaque] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [bairroUsuario, setBairroUsuario] = useState<string>('');
  const [imagemDestaque, setImagemDestaque] = useState<string | null>(null);

  useEffect(() => {
    const carregarDestaqueDemonstracao = async () => {
      setLoading(true);
      try {
        // 1. Busca a primeira rota disponível no Firestore
        const rota = await getDestaqueRoute();
        setDestaque(rota);

        if (rota) {
          // 2. Se a rota já tiver uma imagem de capa direta, usamos ela
          if (rota.imageUrl && !rota.imageUrl.includes('googleusercontent.com')) {
            setImagemDestaque(rota.imageUrl);
          } 
          // 3. 🚀 Caso não tenha, hidrata dinamicamente buscando a foto do primeiro checkin
          else if (rota.stops && rota.stops.length > 0) {
            const stopDoc = await getDoc(doc(db, 'checkins', rota.stops[0]));
            if (stopDoc.exists()) {
              const stopData = stopDoc.data();
              const urlEncontrada = stopData.imageUrl || stopData.photoUrl || stopData.image || "";
              
              if (urlEncontrada && !urlEncontrada.includes('googleusercontent.com')) {
                setImagemDestaque(urlEncontrada);
              }
            }
          }
        }
      } catch (error) {
        console.error("Falha no carregamento de demonstração:", error);
      } finally {
        setLoading(false);
      }

      // Tenta capturar a localização em segundo plano apenas de forma passiva
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Localização passiva capturada com sucesso:", position.coords);
          },
          (error) => {
            console.warn("Geolocalização passiva ignorada ou negada.", error);
          }
        );
      }
    };

    carregarDestaqueDemonstracao();
  }, []);

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

      {/* Card de Destaque Dinâmico */}
      <section className="px-6 mt-6">
        {loading ? (
          /* Esqueleto de Carregamento (Shimmer Effect) */
          <div className="w-full rounded-3xl bg-gray-100 animate-pulse aspect-[4/3]" />
        ) : destaque ? (
          <Link href={`/roteiro/${destaque.id}`} key={destaque.id}>
            <div className="relative group cursor-pointer overflow-hidden rounded-3xl shadow-xl aspect-[4/3]">
              
              {/* 🎯 Imagem Dinâmica Hidratada ou Fallback caso o banco não tenha fotos */}
              <Image
                src={imagemDestaque || "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80"}
                alt={destaque.title || "Destaque da Cidade"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />

              {/* Indicador de Rota Próxima */}
              {bairroUsuario && destaque.bairro === bairroUsuario && (
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-green-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg animate-bounce">
                  <MapPin size={10} /> PERTO DE VOCÊ
                </div>
              )}

              {/* Conteúdo do Card */}
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full text-white">
                <div className="flex gap-2 mb-2">
                  {destaque.tags?.map((tag: string, idx: number) => (
                    <span key={idx} className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-1">{destaque.title}</h3>
                <div className="flex items-center gap-4 text-xs opacity-90">
                  <span>📍 {destaque.stopsCount || 0} paradas</span>
                  <span>⏱️ {destaque.duration?.value || '0'} {destaque.duration?.unit || 'h'}</span>
                  <span>⭐ {destaque.rating?.toFixed(1) || '5.0'}</span>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="text-center p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-gray-400 text-sm">
            Nenhuma rota disponível no momento.
          </div>
        )}
      </section>

      {/* Lista Rápida de Benefícios */}
      <section className="px-6 mt-10 space-y-6">
        <Link href="/desafios">
          <div className="flex items-start gap-4 cursor-pointer group">
            <div className="bg-orange-50 p-2 rounded-xl text-orange-600 font-bold group-hover:bg-orange-100 transition-colors">🗺️</div>
            <div>
              <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">Roteiros Prontos</h4>
              <p className="text-xs text-gray-500">Do café da manhã ao samba, roteiros completos passo a passo.</p>
            </div>
          </div>
        </Link>
        <Link href="/busca">
          <div className="flex items-start gap-4 cursor-pointer group">
            <div className="bg-orange-50 p-2 rounded-xl text-orange-600 font-bold group-hover:bg-orange-100 transition-colors">👥</div>
            <div>
              <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">Comunidade Local</h4>
              <p className="text-xs text-gray-500">Dicas e avaliações de quem realmente conhece o lugar.</p>
            </div>
          </div>
        </Link>
      </section>
    </main>
  );
}