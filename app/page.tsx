// src/components/RoteiroCard.tsx
import Image from 'next/image';

interface RoteiroProps {
  titulo: string;
  descricao: string;
  autor: string;
  tempo: string;
  paradas: number;
  tags: string[];
}

export default function RoteiroCard({ titulo, descricao, autor, tempo, paradas, tags }: RoteiroProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
      <div className="flex gap-2 mb-2">
        {tags.map(tag => (
          <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
      <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{titulo}</h3>
      <p className="text-gray-500 text-sm line-clamp-2 mb-3">{descricao}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">Por {autor}</span>
        <div className="flex gap-3">
          <span>~{tempo}</span>
          <span>{paradas} paradas</span>
        </div>
      </div>
    </div>
  );
}