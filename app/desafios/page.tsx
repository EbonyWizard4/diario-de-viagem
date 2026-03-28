'use client';

import { Trophy, Star, Target, CheckCircle2, Flame } from 'lucide-react';

export default function DesafiosPage() {
  // Mock rápido de desafios para a demonstração
  const desafios = [
    { id: 1, titulo: "Explorador da Mooca", progresso: 66, meta: 3, atual: 2, xp: 150, icone: "🍝" },
    { id: 2, titulo: "Caçador de Grafites", progresso: 20, meta: 5, atual: 1, xp: 300, icone: "🎨" },
    { id: 3, titulo: "Crítico Gastronômico", progresso: 100, meta: 1, atual: 1, xp: 50, concluido: true, icone: "☕" },
  ];

  return (
    <main className="flex flex-col min-h-screen bg-white pb-24">
      {/* Header de Status */}
      <header className="bg-orange-600 p-8 rounded-b-[40px] text-white shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Meus Desafios</h1>
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
            <Flame className="w-4 h-4 text-orange-300 fill-orange-300" />
            <span className="font-bold text-sm">12 Dias</span>
          </div>
        </div>

        {/* Card de Nível */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Nível 5</p>
              <h2 className="text-xl font-black">Explorador Urbano</h2>
            </div>
            <p className="text-xs font-bold">1250 / 2000 XP</p>
          </div>
          <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
            <div className="bg-white h-full w-[62%] transition-all duration-1000" />
          </div>
        </div>
      </header>

      {/* Lista de Desafios */}
      <section className="px-6 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Target className="text-orange-600 w-5 h-5" />
          <h3 className="font-bold text-gray-900">Missões em Aberto</h3>
        </div>

        <div className="space-y-4">
          {desafios.map((item) => (
            <div 
              key={item.id} 
              className={`p-4 rounded-2xl border-2 transition-all ${item.concluido ? 'border-green-100 bg-green-50/30' : 'border-gray-100 bg-white'}`}
            >
              <div className="flex gap-4">
                <div className="text-3xl bg-white shadow-sm w-14 h-14 rounded-xl flex items-center justify-center border border-gray-100">
                  {item.icone}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className={`font-bold ${item.concluido ? 'text-green-700' : 'text-gray-900'}`}>
                      {item.titulo}
                    </h4>
                    {item.concluido && <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-100" />}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                    <span className="text-[10px] font-bold text-orange-600">+{item.xp} XP</span>
                  </div>

                  {!item.concluido && (
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                        <span>Progresso</span>
                        <span>{item.atual}/{item.meta}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-orange-500 h-full transition-all duration-500" 
                          style={{ width: `${item.progresso}%` }} 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seção de Conquistas */}
      <section className="px-6 pb-10">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="text-yellow-500 w-5 h-5" />
          <h3 className="font-bold text-gray-900">Minhas Medalhas</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-gray-50 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-2xl grayscale opacity-40">
              🏅
            </div>
          ))}
          <div className="aspect-square bg-yellow-50 rounded-full border-2 border-yellow-200 flex items-center justify-center text-2xl shadow-sm">
            🏆
          </div>
        </div>
      </section>
    </main>
  );
}