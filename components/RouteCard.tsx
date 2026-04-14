'use client';

import { useEffect, useState } from 'react';
import { Navigation, Clock, MapPin, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { calculateDistance } from '@/lib/utils';

interface RouteCardProps {
  rota: any;
  userLocation?: { lat: number; lng: number } | null;
}

export default function RouteCardBusca({ rota, userLocation }: RouteCardProps) {
  const [capaUrl, setCapaUrl] = useState<string | null>(null);
  const [distancia, setDistancia] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDados() {
      if (rota.stops && rota.stops.length > 0) {
        try {
          // ... dentro do try
          const stopDoc = await getDoc(doc(db, 'checkins', rota.stops[0]));

          if (stopDoc.exists()) {
            const stopData = stopDoc.data();

            // 1. Inconsistência na Imagem: No seu banco é 'imageUrl', no código estava 'photoUrl'
            setCapaUrl(stopData.imageUrl || stopData.photoUrl);

            // 2. Inconsistência na Localização: O Firebase armazena em um objeto 'location'
            // O tipo GeoPoint do Firestore tem as propriedades .latitude e .longitude
            const geoPoint = stopData.location;

            if (userLocation && geoPoint && geoPoint.latitude && geoPoint.longitude) {
              const d = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                geoPoint.latitude,  // Acessando a propriedade do GeoPoint
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="block group"
    >
      <Link href={`/roteiro/${rota.id}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all active:scale-[0.98] hover:shadow-md">

          {/* Imagem do Roteiro (H-40 conforme o layout de busca) */}
          <div className="relative h-40 w-full bg-gray-100">
            {capaUrl ? (
              <img
                src={capaUrl}
                alt={rota.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <MapPin size={32} />
              </div>
            )}

            {/* Badge de Distância Flutuante (Reaproveitada) */}
            {distancia && (
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/20">
                <Navigation size={8} className="text-white fill-white" />
                <span className="text-[9px] font-black text-white uppercase italic">
                  a {distancia}
                </span>
              </div>
            )}

            <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors">
              <Heart size={16} />
            </button>
          </div>

          {/* Conteúdo do Card */}
          <div className="p-4">
            <div className="flex gap-2 mb-2 flex-wrap">
              {/* Usando o bairro e o custo como "tags" visuais */}
              <span className="text-[9px] font-black tracking-widest text-orange-600 bg-orange-50 px-2 py-1 rounded uppercase">
                {rota.bairro || 'São Paulo'}
              </span>
              <span className="text-[9px] font-black tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">
                {rota.cost || 'Médio'}
              </span>
            </div>

            <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors leading-tight">
              {rota.title}
            </h3>

            {rota.description && (
              <p className="text-gray-500 text-xs line-clamp-2 mt-1 mb-4 leading-relaxed font-medium">
                {rota.description}
              </p>
            )}

            {/* Footer do Card com infos de tempo e paradas */}
            <div className="flex items-center justify-between border-t border-gray-50 pt-3 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-[8px] text-white font-black">
                  {rota.userId ? "U" : "G"}
                </div>
                <span>Curadoria Local</span>
              </div>
              <div className="flex gap-3">
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-orange-500" />
                  ~{rota.duration?.value}{rota.duration?.unit[0]}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-orange-500" />
                  {rota.stops?.length} paradas
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}