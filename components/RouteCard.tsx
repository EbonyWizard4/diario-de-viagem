// src/components/RouteCard.tsx
'use client';

import { Map, DollarSign, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Mapeamento de categorias para o TCC ficar top
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
    stops: any[];
    duration?: { value: string; unit: string };
    cost?: string;
  };
  onPress?: () => void;
}
// src/components/RouteCard.tsx


export default function RouteCard({ rota, onPress }: RouteCardProps) {
  // 🛡️ ADICIONE ESTA TRAVA DE SEGURANÇA:
  if (!rota) return null; 

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 mb-6 group relative" // Adicionei 'relative' aqui por segurança
    >
      {/* Badge de Emoji Flutuante (Baseado na Categoria) */}
      <div className="absolute top-4 right-4 z-10 bg-white p-2 rounded-2xl shadow-lg border border-gray-50 text-xl group-hover:scale-110 transition-transform">
        {CATEGORY_MAP[rota.category || 'default']}
      </div>

      {/* Header do Card */}
      <div className="h-48 bg-orange-50 relative flex items-center justify-center overflow-hidden">
        <Map size={48} className="text-orange-200 absolute z-0" />
        <div className="absolute inset-0 bg-black/5" />
        
        <div className="absolute top-6 left-6 flex gap-1">
          {/* Badge de Duração */}
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase text-orange-600">
            {rota.duration?.value || '0'} {rota.duration?.unit || 'Tempo'}
          </span>
        </div>
      </div>

      <div className="p-8">
        <span className="text-[10px] font-black text-orange-600 uppercase italic tracking-widest">
          Roteiro • {rota.stops?.length || 0} Paradas
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
            CUSTO {rota.cost?.toUpperCase() || 'NÃO INFORMADO'}
          </div>
          
          <button 
            onClick={onPress}
            className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-orange-600 transition-colors active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}