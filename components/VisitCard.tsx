// src/components/VisitCard.tsx
'use client';

import { MapPin, Calendar, Star, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface VisitCardProps {
  placeName: string;
  comment: string;
  rating: number;
  photoUrl?: string;
  date: any; 
  isCompleted?: boolean; // 👈 Nova prop para o feedback
}

export default function VisitCard({ placeName, comment, rating, photoUrl, date, isCompleted }: VisitCardProps) {
  const dataFormatada = date?.toDate ? date.toDate().toLocaleDateString('pt-BR') : 'Recentemente';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Muda a borda se estiver concluído
      className={`bg-white rounded-[32px] overflow-hidden shadow-sm border transition-all duration-500 ${
        isCompleted ? 'border-green-200 ring-2 ring-green-500/10' : 'border-gray-100'
      } mb-4`}
    >
      <div className="relative h-48 w-full bg-orange-100">
        {photoUrl ? (
          <>
            <img src={photoUrl} alt={placeName} className={`w-full h-full object-cover transition-opacity ${isCompleted ? 'opacity-90' : 'opacity-100'}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-orange-300 italic font-bold">
            Sem foto do momento 📸
          </div>
        )}
        
        {/* Badge de Nota */}
        <div className="absolute top-4 left-4 flex gap-1 bg-white/60 backdrop-blur-md p-2 rounded-xl">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill={i < rating ? "#EA580C" : "transparent"} className={i < rating ? "text-orange-600" : "text-orange-200"} />
          ))}
        </div>

        {/* 🏆 Badge de Conclúido Flutuante */}
        {isCompleted && (
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-green-200"
          >
            <CheckCircle2 size={14} className="stroke-[3px]" />
            <span className="text-[10px] font-black uppercase italic tracking-tighter">Concluído</span>
          </motion.div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          {/* Tag muda de cor conforme status */}
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
            isCompleted ? 'text-green-600' : 'text-orange-600'
          }`}>
            {isCompleted ? '🎉 Objetivo Alcançado' : 'Visita Realizada'}
          </span>
        </div>

        <h3 className="text-xl font-black text-gray-900 leading-tight mb-2 uppercase italic">
          {placeName}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 italic">
          "{comment}"
        </p>

        {/* Rodapé do Card */}
        <div className={`flex justify-between items-center pt-4 border-t transition-colors ${
          isCompleted ? 'border-green-50' : 'border-gray-50'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
              isCompleted ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
            }`}>
              {isCompleted ? <CheckCircle2 size={14} /> : placeName.charAt(0)}
            </div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {dataFormatada}
            </span>
          </div>
          
          <div className={`flex items-center gap-1 font-black ${isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
            <MapPin size={14} className={isCompleted ? 'animate-bounce' : ''} />
            <span className="text-[10px] uppercase tracking-tighter">
              {isCompleted ? 'Ponto Visitado' : 'Check-in'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}