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

// 📍 IMPORTANTE: Importe o seu contexto de Auth e o serviço de checkin
import { useAuth } from '@/context/AuthContext';
import { isRouteFavorite, toggleFavorite } from '@/services/checkinService';

export default function RoteiroDetalhes() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth(); // Pega o usuário real logado

  const [roteiro, setRoteiro] = useState<any>(null);
  const [paradas, setParadas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [checkinsConcluidosNoDia, setCheckinsConcluidosNoDia] = useState<string[]>([]);
  
  // Usamos o ID do usuário logado ou o mock se não houver ninguém
  const userId = user?.uid || "uV2";

  // 1. Verificar se é favorito ao carregar
  useEffect(() => {
    if (user && params.id) {
      isRouteFavorite(user.uid, params.id as string).then(setIsFavorite);
    }
  }, [user, params.id]);

  // 2. Função disparada pelo clique no coração
  const handleToggleFavorite = async () => {
    if (!user) return alert("Faça login para favoritar!");
    const status = await toggleFavorite(user.uid, params.id as string);
    setIsFavorite(status);
  };

  // Busca checkins do dia
  useEffect(() => {
    async function fetchCheckinsHoje() {
      if (!userId) return;
      const hoje = new Date().toISOString().split('T')[0];
      const q = collection(db, 'users', userId, 'checkins_diarios');
      const snap = await getDocs(q);
      const concluidos = snap.docs
        .filter(doc => doc.id.includes(hoje))
        .map(doc => doc.data().stopId);
      setCheckinsConcluidosNoDia(concluidos);
    }
    fetchCheckinsHoje();
  }, [userId]);

  // GPS em tempo real
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => console.error("Erro ao obter GPS:", err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Busca dados do roteiro
  useEffect(() => {
    async function fetchDadosRoteiro() {
      if (!params.id) return;
      setLoading(true);
      try {
        const rotaDoc = await getDoc(doc(db, 'routes', params.id as string));
        if (rotaDoc.exists()) {
          const data = rotaDoc.data();
          setRoteiro({ id: rotaDoc.id, ...data });

          if (data.stops && data.stops.length > 0) {
            const q = query(
              collection(db, 'checkins'),
              where('__name__', 'in', data.stops)
            );
            const snap = await getDocs(q);
            const docsMap = snap.docs.map(d => ({ id: d.id, ...d.data() }));
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
      <header className="relative h-72 w-full bg-gray-900">
        {paradas[0]?.photoUrl ? (
          <Image src={paradas[0].photoUrl} alt={roteiro.title} fill className="object-cover opacity-80" />
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
            <button
              onClick={handleToggleFavorite}
              className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg active:scale-90 transition-all"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
              />
            </button>
            <button className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg"><Share2 className="w-5 h-5 text-gray-900" /></button>
          </div>
        </div>
      </header>

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

      <section className="px-6 mt-10">
        <h3 className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 mb-10">Linha do Tempo</h3>
        <div className="space-y-12 relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-[4px] bg-gray-100 rounded-full" />
          {paradas.map((stop, index) => {
            const jaFezCheckin = checkinsConcluidosNoDia.includes(stop.id);
            return (
              <div key={stop.id} className="relative pl-14 mb-12">
                <div className="absolute left-0 top-0 w-10 h-10 rounded-2xl bg-gray-900 flex items-center justify-center z-10 shadow-lg border-4 border-white">
                  <span className="text-xs font-black text-white">{index + 1}</span>
                </div>
                <div className="group transition-all">
                  <VisitCard
                    placeName={stop.placeName}
                    comment={stop.comment}
                    rating={stop.rating}
                    photoUrl={stop.photoUrl}
                    date={stop.timestamp}
                    isCompleted={jaFezCheckin}
                  />
                  <div className="mt-4 px-2">
                    <BotaoCheckinParada
                      stop={stop}
                      userLocation={userLocation}
                      userId={userId}
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