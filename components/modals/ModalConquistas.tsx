// src/components/ModalConquistas.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award } from 'lucide-react';

export default function ModalConquistas({ isOpen, onClose, conquistasUsuario }: any) {

    // 2. Mock das conquistas possíveis (isso depois pode ir para um arquivo de constantes)
    const CONQUISTAS_POSSIVEIS = [
        { id: 'gastronomia', emoji: '🍕', titulo: 'Glutão Profissional', desc: 'Faça 5 check-ins em restaurantes.', meta: 5 },
        { id: 'artes', emoji: '🎨', titulo: 'Crítico de Arte', desc: 'Visite 3 museus ou galerias.', meta: 3 },
        { id: 'passeios', emoji: '🚲', titulo: 'Explorador Urbano', desc: 'Complete 3 roteiros de parques.', meta: 3 },
        { id: 'role', emoji: '🏙️', titulo: 'Inimigo do Fim', desc: 'Faça um check-in após as 22h.', meta: 1 },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4">
                    {/* Overlay Escuro */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Conteúdo do Modal */}
                    <motion.div
                        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
                        className="relative bg-white w-full max-w-lg rounded-[40px] p-8 overflow-hidden shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter flex items-center gap-2">
                                <Award className="text-orange-600" /> Meus Triunfos
                            </h2>
                            <button onClick={onClose} className="p-2 bg-gray-100 rounded-2xl"><X size={20} /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pb-6 no-scrollbar">
                            {CONQUISTAS_POSSIVEIS.map((conquista) => {
                                const conquistada = conquistasUsuario?.includes(conquista.id);

                                return (
                                    <div key={conquista.id} className={`p-6 rounded-[32px] border-2 flex flex-col items-center text-center transition-all ${conquistada ? 'border-orange-100 bg-orange-50/50' : 'border-gray-50 bg-gray-50/30 opacity-60'
                                        }`}>
                                        <span className={`text-4xl mb-3 ${!conquistada && 'grayscale'}`}>{conquista.emoji}</span>
                                        <h4 className="font-black text-xs text-gray-900 uppercase italic leading-tight">{conquista.titulo}</h4>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase mt-2 leading-relaxed">{conquista.desc}</p>

                                        {!conquistada && (
                                            <div className="mt-3 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-gray-400 w-1/3 rounded-full" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}