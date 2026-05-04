// src/components/FilterBar.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface FilterBarProps {
  isOpen: boolean;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CATEGORIAS = [
  { id: 'gastronomia', label: 'Gastronomia', icon: '🍕' },
  { id: 'artes', label: 'Artes', icon: '🎨' },
  { id: 'passeios', label: 'Passeios', icon: '🚲' },
  { id: 'role', label: 'Rolê', icon: '🏙️' },
];

export default function FilterBar({ isOpen, selectedCategory, onSelectCategory }: FilterBarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap gap-2 py-4">
            <button
              onClick={() => onSelectCategory(null)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                selectedCategory === null 
                ? 'bg-orange-600 border-orange-600 text-white shadow-md' 
                : 'bg-white border-gray-100 text-gray-400'
              }`}
            >
              ✨ Tudo
            </button>
            
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id === selectedCategory ? null : cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  selectedCategory === cat.id 
                  ? 'bg-orange-600 border-orange-600 text-white shadow-md' 
                  : 'bg-white border-gray-100 text-gray-400'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}