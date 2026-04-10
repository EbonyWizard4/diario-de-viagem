// src/components/VisitCard.tsx
'use client';

import { MapPin, Calendar, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface VisitCardProps {
  placeName: string;
  comment: string;
  rating: number;
  photoUrl?: string;
  date: any; // Timestamp do Firebase
}

export default function VisitCard({ placeName, comment, rating, photoUrl, date }: VisitCardProps) {
  // Formatação simples de data
  const dataFormatada = date?.toDate ? date.toDate().toLocaleDateString('pt-BR') : 'Recentemente';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 mb-4"
    >
      {/* Área da Imagem com Degradê (Estilo Imagem 2) */}
      <div className="relative h-48 w-full bg-orange-100">
        {photoUrl ? (
          <>
            <img src={photoUrl} alt={placeName} className="w-full h-full object-cover" />
            {/* O degradê suave que você curtiu */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-orange-300 italic font-bold">
            Sem foto do momento 📸
          </div>
        )}
        
        {/* Badge de Nota (Estilo Tag da Imagem 1) */}
        <div className="absolute top-4 left-4 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < rating ? "#EA580C" : "transparent"} className={i < rating ? "text-orange-600" : "text-orange-200"} />
          ))}
        </div>
      </div>

      {/* Conteúdo do Card (Estilo Imagem 1) */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
            Visita Realizada
          </span>
        </div>

        <h3 className="text-xl font-black text-gray-900 leading-tight mb-2">
          {placeName}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
          "{comment}"
        </p>

        {/* Rodapé do Card */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
              {placeName.charAt(0)}
            </div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {dataFormatada}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-gray-400">
            <MapPin size={14} />
            <span className="text-[11px] font-bold uppercase">Check-in</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}