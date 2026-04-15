// app/roteiro/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ArrowLeft, Heart, Share2, Clock, MapPin, DollarSign, Map as MapIcon } from 'lucide-react';
import VisitCard from '@/components/VisitCard';
import BotaoCheckinParada from '@/components/BotaoCheckinParada';

export default function RoteiroDetalhes() {
  const params = useParams();
  const router = useRouter();

  const [roteiro, setRoteiro] = useState<any>(null);
  const [paradas, setParadas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 📍 NOVO: Estado para armazenar a localização do usuário
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [checkinsConcluidosNoDia, setCheckinsConcluidosNoDia] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("uV2"); // Mock por enquanto, ou pegue do seu Auth

  useEffect(() => {
    async function fetchCheckinsHoje() {
      if (!userId) return;
      const hoje = new Date().toISOString().split('T')[0];

      // Busca na subcoleção que criamos para a gamificação
      const q = collection(db, 'users', userId, 'checkins_diarios');
      const snap = await getDocs(q);

      // Filtra apenas os que são de hoje (ID formato: stopId_2026-04-15)
      const concluidos = snap.docs
        .filter(doc => doc.id.includes(hoje))
        .map(doc => doc.data().stopId);

      setCheckinsConcluidosNoDia(concluidos);
    }
    fetchCheckinsHoje();
  }, [userId]);

  // 🛰️ NOVO: Efeito para monitorar o GPS em tempo real
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => console.error("Erro ao obter GPS:", err),
      { enableHighAccuracy: true } // Garante precisão para a gamificação
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // ... (mantenha seu useEffect de fetchDadosRoteiro aqui)

  useEffect(() => {
    async function fetchDadosRoteiro() {
      if (!params.id) return;
      setLoading(true);

      try {
        // 1. Busca o documento da Rota
        const rotaDoc = await getDoc(doc(db, 'routes', params.id as string));

        if (rotaDoc.exists()) {
          const data = rotaDoc.data();
          setRoteiro({ id: rotaDoc.id, ...data });

          // 2. Busca os detalhes de todos os check-ins (paradas) desta rota
          // Usamos o campo 'stops' que contém o array de IDs
          if (data.stops && data.stops.length > 0) {
            const q = query(
              collection(db, 'checkins'),
              where('__name__', 'in', data.stops) // Busca documentos pelos IDs do array
            );

            const snap = await getDocs(q);
            const docsMap = snap.docs.map(d => ({ id: d.id, ...d.data() }));

            // Reordenar para manter a sequência que o usuário escolheu no RouteCreator
            const orderedStops = data.stops.map((id: string) =>
              docsMap.find(doc => doc.id === id)
            ).filter(Boolean);

            setParadas(orderedStops);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar roteiro:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDadosRoteiro();
  }, [params.id]);

  if (loading) return <div className="p-20 text-center animate-pulse font-bold text-orange-500">Carregando roteiro épico...</div>;
  if (!roteiro) return <div className="p-10 text-center">Roteiro não encontrado.</div>;

  return (
    <main className="flex flex-col min-h-screen bg-white pb-10">
      {/* Header com a primeira foto do roteiro ou um fallback */}
      <header className="relative h-72 w-full bg-gray-900">
        {paradas[0]?.photoUrl ? (
          <Image
            src={paradas[0].photoUrl}
            alt={roteiro.title}
            fill
            className="object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <MapIcon size={80} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-white" />

        <div className="absolute top-6 left-6 right-6 flex justify-between z-10">
          <button onClick={() => router.back()} className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg active:scale-90 transition-all">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div className="flex gap-2">
            <button className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg"><Heart className="w-5 h-5 text-gray-400" /></button>
            <button className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg"><Share2 className="w-5 h-5 text-gray-900" /></button>
          </div>
        </div>
      </header>

      {/* Info Principal */}
      <section className="px-6 -mt-16 z-20 relative">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] border border-white shadow-2xl">
          <span className="text-[10px] font-black text-orange-600 uppercase italic tracking-widest mb-1 block">
            📍 {roteiro.bairro || 'São Paulo'}
          </span>
          <h1 className="text-3xl font-black text-gray-900 leading-tight mb-2 uppercase italic">
            {roteiro.title}
          </h1>
          <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">"{roteiro.description}"</p>

          <div className="flex justify-between items-center border-t border-gray-100 pt-6">
            <div className="flex flex-col items-center">
              <MapPin className="w-5 h-5 text-orange-600 mb-1" />
              <span className="text-[10px] font-black text-gray-400 uppercase">{paradas.length} paradas</span>
            </div>
            <div className="flex flex-col items-center border-x border-gray-100 px-8">
              <Clock className="w-5 h-5 text-orange-600 mb-1" />
              <span className="text-[10px] font-black text-gray-400 uppercase">{roteiro.duration?.value} {roteiro.duration?.unit}</span>
            </div>
            <div className="flex flex-col items-center">
              <DollarSign className="w-5 h-5 text-orange-600 mb-1" />
              <span className="text-[10px] font-black text-gray-400 uppercase">{roteiro.cost}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline das Paradas */}
      <section className="px-6 mt-10">
        <h3 className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 mb-10">Linha do Tempo</h3>

        <div className="space-y-12 relative">
          {/* Linha vertical estilizada */}
          <div className="absolute left-[19px] top-2 bottom-2 w-[4px] bg-gray-100 rounded-full" />

          {paradas.map((stop, index) => {
            const jaFezCheckin = checkinsConcluidosNoDia.includes(stop.id);

            return (

              <div key={stop.id} className="relative pl-14 mb-12">
                {/* 1. Mantemos a estrutura da Timeline (Bolinha com número) */}
                <div className="absolute left-0 top-0 w-10 h-10 rounded-2xl bg-gray-900 flex items-center justify-center z-10 shadow-lg border-4 border-white">
                  <span className="text-xs font-black text-white">{index + 1}</span>
                </div>

                {/* 2. O VisitCard entra aqui como o conteúdo do passo */}
                <div className="group transition-all">
                  <VisitCard
                    placeName={stop.placeName}
                    comment={stop.comment}
                    rating={stop.rating}
                    photoUrl={stop.photoUrl}
                    date={stop.timestamp}
                    isCompleted={jaFezCheckin} // 👈 A mágica acontece aqui!
                  />

                  {/* 3. Inserimos o Botão de Gamificação LOGO ABAIXO do Card */}
                  <div className="mt-4 px-2">
                    <BotaoCheckinParada
                      stop={stop}
                      userLocation={userLocation}
                      userId={userId} // 👈 Importante para salvar o XP!
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  );
}