// components/ProgressBar.tsx
export default function ProgressBar({ atual, total }: { atual: number, total: number }) {
  const porcentagem = Math.min((atual / total) * 100, 100);
  
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-1 text-[10px] font-bold uppercase tracking-tight">
        <span className="text-orange-600">{atual} / {total} paradas</span>
        <span className="text-gray-400">{Math.round(porcentagem)}% concluído</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-500" 
          style={{ width: `${porcentagem}%` }}
        />
      </div>
    </div>
  );
}