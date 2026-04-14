'use client';

import { useEffect, useState } from 'react'; // 👈 Essencial para a busca
import { Map, DollarSign, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { db } from '@/lib/firebase'; // 👈 Importar seu db
import { doc, getDoc } from 'firebase/firestore';

const CATEGORY_MAP: Record<string, string> = {
  gastronomia: '🍕',
  cultura: '🎨',
  natureza: '🌿',
  noite: '🌙',
  default: '📍'
};

interface RouteCardProps {
  rota: {
    id: string;
    title: string;
    description?: string;
    category?: string;
    stops: string[]; // Array de IDs das paradas
    duration?: { value: string; unit: string };
    cost?: string;
    bairro?: string; // Bairro que salvamos automaticamente
  };
  onPress?: () => void; 
}

export default function RouteCard({ rota }: RouteCardProps) {
  const [capaUrl, setCapaUrl] = useState<string | null>(null);

  // Busca a foto da primeira parada para usar como capa do card
  useEffect(() => {
    async function fetchCapa() {
      if (rota.stops && rota.stops.length > 0) {
        try {
          // Buscamos apenas o dado da primeira parada
          const stopDoc = await getDoc(doc(db, 'checkins', rota.stops[0]));
          if (stopDoc.exists()) {
            setCapaUrl(stopDoc.data().photoUrl);
          }
        } catch (e) {
          console.error("Erro ao carregar capa:", e);
        }
      }
    }
    fetchCapa();
  }, [rota.stops]);

  if (!rota) return null; 

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 mb-6 group relative"
    >
      <Link href={`/roteiro/${rota.id}`} className="block">
        
        {/* Badge de Emoji Flutuante */}
        <div className="absolute top-4 right-4 z-10 bg-white p-2 rounded-2xl shadow-lg border border-gray-50 text-xl group-hover:scale-110 transition-transform">
          {CATEGORY_MAP[rota.category || 'default']}
        </div>

        {/* Header do Card (Layout Mantido 100%) */}
        <div className="h-48 bg-orange-50 relative flex items-center justify-center overflow-hidden">
          {/* Se tiver imagem, ela preenche o fundo. Se não, mostra o ícone original */}
          {capaUrl ? (
            <img 
              src={capaUrl} 
              alt={rota.title} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <Map size={48} className="text-orange-200 absolute z-0" />
          )}
          
          {/* Overlay escuro sutil para garantir leitura da badge de tempo */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors" />
          
          <div className="absolute top-6 left-6 flex gap-1">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase text-orange-600 shadow-sm">
              {rota.duration?.value || '0'} {rota.duration?.unit || 'Tempo'}
            </span>
          </div>
        </div>

        <div className="p-8">
          <span className="text-[10px] font-black text-orange-600 uppercase italic tracking-widest">
            {rota.bairro || 'Roteiro'} • {rota.stops?.length || 0} Paradas
          </span>
          <h3 className="text-2xl font-black text-gray-900 uppercase italic mt-1 leading-tight">
            {rota.title}
          </h3>
          
          {rota.description && (
            <p className="text-gray-500 text-sm font-medium mt-3 line-clamp-2">
              "{rota.description}"
            </p>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-400 font-bold text-xs">
              <DollarSign size={14} className="text-orange-500" />
              CUSTO {rota.cost?.toUpperCase() || 'MÉDIO'}
            </div>
            
            <div className="p-3 bg-gray-900 text-white rounded-2xl group-hover:bg-orange-600 transition-all active:scale-90">
              <ChevronRight size={20} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}