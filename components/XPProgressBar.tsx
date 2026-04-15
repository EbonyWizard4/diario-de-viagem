// src/components/XPProgressBar.tsx
import { getLevelInfo } from '@/services/gamificationService';

export default function XPProgressBar({ xp }: { xp: number }) {
  const { level, progress, xpInCurrentLevel, nextLevelAt } = getLevelInfo(xp);

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Nível {level}
          </span>
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase">
            {xpInCurrentLevel} / {nextLevelAt} XP
        </p>
      </div>

      {/* Barra de Progresso */}
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-50">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}