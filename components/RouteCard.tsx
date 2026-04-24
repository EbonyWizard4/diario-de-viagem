// components/RouteCard.tsx

'use client';

import { useEffect, useState } from 'react';
import { Navigation, Clock, MapPin, Heart, Zap } from 'lucide-react'; // Importei o Zap
import { motion } from 'framer-motion';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { calculateDistance } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { isRouteFavorite, toggleFavorite } from '@/services/checkinService';
import { getRouteProgress, XP_VALUES } from '@/services/gamificationService';

// components/RouteCard.tsx
import ProgressBar from './ProgressBar'; // Importe o que criamos acima

interface RouteCardProps {
  rota: any;
  userLocation?: { lat: number; lng: number } | null;
  variant?: 'default' | 'challenge'; // 👈 A mágica está aqui
}
export default function RouteCardBusca({ rota, userLocation, variant = 'default' }: RouteCardProps) {
  const [capaUrl, setCapaUrl] = useState<string | null>(null);
  const [distancia, setDistancia] = useState<string | null>(null);
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  // Valor de XP que o usuário ganha ao completar esta rota específica
  const pontosRota = XP_VALUES.COMPLETAR_ROTA;

  // Simulação de progresso (no futuro você buscará quantos check-ins o user fez nessa rota)
  const paradasConcluidas = rota.userProgress || 0;

  useEffect(() => {
    if (user && rota.id) {
      isRouteFavorite(user.uid, rota.id).then(setIsFavorite);
    }
  }, [user, rota.id]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert("Faça login para favoritar!");
    const status = await toggleFavorite(user.uid, rota.id);
    setIsFavorite(status);
  };

  useEffect(() => {
    async function fetchDados() {
      if (rota.stops && rota.stops.length > 0) {
        try {
          // Buscamos a primeira parada para usar como capa do card
          const stopDoc = await getDoc(doc(db, 'checkins', rota.stops[0]));
          if (stopDoc.exists()) {
            const stopData = stopDoc.data();
            setCapaUrl(stopData.imageUrl || stopData.photoUrl);

            const geoPoint = stopData.location;
            if (userLocation && geoPoint?.latitude) {
              const d = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                geoPoint.latitude,
                geoPoint.longitude
              );
              setDistancia(d < 1 ? `${(d * 1000).toFixed(0)}m` : `${d.toFixed(1)}km`);
            }
          }
        } catch (e) {
          console.error("Erro no card:", e);
        }
      }
    }
    fetchDados();
  }, [rota.stops, userLocation]);

  // Dentro do seu RouteCardBusca
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    async function calcularProgressoReal() {
      if (user && variant === 'challenge' && rota.stops) {
        const concluidos = await getRouteProgress(user.uid, rota.stops);
        setProgresso(concluidos);
      }
    }
    calcularProgressoReal();
  }, [user, rota.stops, variant]);



  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="block group"
    >
      <Link href={`/roteiro/${rota.id}`}>
        <div className={`bg-white rounded-[32px] overflow-hidden border transition-all ${variant === 'challenge' ? 'border-orange-200 shadow-md' : 'border-gray-100 shadow-sm'
          }`}>

          {/* Badge condicional */}
          {variant === 'challenge' ? (
            <div className="absolute top-4 left-4 z-20 bg-green-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase">
              Em andamento
            </div>
          ) : (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-orange-600 text-white px-3 py-1.5 rounded-2xl border-2 border-white">
              <Zap size={12} className="fill-white" />
              <span className="text-[10px] font-black uppercase tracking-widest">+{XP_VALUES.COMPLETAR_ROTA} XP</span>
            </div>
          )}

          {/* Imagem do Roteiro */}
          <div className="relative h-48 w-full bg-gray-100">
            {capaUrl ? (
              <img src={capaUrl} alt={rota.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <MapPin size={32} />
              </div>
            )}

            {/* Overlay Inferior para Distância */}
            {distancia && (
              <div className="absolute bottom-3 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                <Navigation size={10} className="text-white fill-white" />
                <span className="text-[9px] font-black text-white uppercase italic">
                  a {distancia} de você
                </span>
              </div>
            )}

            {/* BOTÃO DE FAVORITO */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm transition-all hover:scale-110 active:scale-90 border border-gray-100"
            >
              <Heart
                size={18}
                className={`transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
              />
            </button>
          </div>

          {/* Conteúdo do Card */}
          <div className="p-6">
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="text-[9px] font-black tracking-widest text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg uppercase">
                {rota.bairro || 'São Paulo'}
              </span>
              <span className="text-[9px] font-black tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg uppercase">
                {rota.category || 'Exploração'}
              </span>
            </div>

            <h3 className="font-black text-gray-900 text-xl group-hover:text-orange-600 transition-colors leading-tight italic uppercase">
              {rota.title}
            </h3>

            {rota.description && (
              <p className="text-gray-500 text-xs line-clamp-2 mt-2 mb-5 leading-relaxed font-medium">
                {rota.description}
              </p>
            )}

            {/* 📍 SÓ EXIBE A BARRA SE FOR VARIANTE CHALLENGE */}
            {variant === 'challenge' && (
              <ProgressBar atual={progresso} total={rota.stops?.length || 1} />
            )}

            {/* footer do card */}

            <div className="flex items-center justify-between border-t border-gray-50 pt-4 text-[10px] text-gray-400 font-black uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center text-[10px] text-orange-600 font-bold">
                  {rota.authorName ? rota.authorName[0].toUpperCase() : "G"}
                </div>
                <span className="text-gray-900">Guia Local</span>
              </div>

              <div className="flex gap-4">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-orange-500" />
                  {rota.duration?.value}{rota.duration?.unit ? rota.duration.unit[0] : 'h'}
                </span>

                {/* 📍 TROCADO: Sai "3 Paradas" e entra "+200 XP" */}
                <span className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                  <Zap size={13} className="fill-orange-600" />
                  <span>+{pontosRota} XP</span>
                </span>
              </div>
            </div>

            {/* ... restante do código abaixo ... */}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}