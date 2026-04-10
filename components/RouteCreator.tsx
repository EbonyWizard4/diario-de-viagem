// src/components/RouteCreator.tsx
'use client';

import { useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Check, Map, X, MapPin, Clock, DollarSign, AlignLeft } from 'lucide-react';

export default function RouteCreator({ visitas, onSuccess }: { visitas: any[], onSuccess: () => void }) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [routeName, setRouteName] = useState('');
    const [description, setDescription] = useState(''); // Nova descrição

    // Estados para Tempo
    const [timeValue, setTimeValue] = useState('');
    const [timeUnit, setTimeUnit] = useState('horas');

    // Estado para Custo
    const [costLevel, setCostLevel] = useState('médio');

    const [isSaving, setIsSaving] = useState(false);
    // 1. No topo, junto com os outros estados:
    const [isSuccess, setIsSuccess] = useState(false);
    // Se tiver menos de 2 visitas, também é bom dar um aviso, mas mostrar a lista
    const isDisabled = selectedIds.length < 2;

    // 2. Atualize a função handleSaveRoute:
    const handleSaveRoute = async () => {
        if (!routeName || selectedIds.length < 2 || !timeValue) {
            alert("Preencha o nome, o tempo e escolha pelo menos 2 paradas!");
            return;
        }

        setIsSaving(true);
        try {
            await addDoc(collection(db, 'routes'), {
                userId: auth.currentUser?.uid,
                title: routeName,
                description,
                duration: {
                    value: Number(timeValue),
                    unit: timeUnit
                },
                cost: costLevel,
                stops: selectedIds,
                timestamp: serverTimestamp(),
            });

            // --- LOGICA DE SUCESSO ---
            setIsSuccess(true);

            // Espera 2 segundos para o usuário ver a mensagem e depois fecha
            setTimeout(() => {
                onSuccess();
                setIsSuccess(false);
            }, 2000);

        } catch (e) {
            console.error(e);
            alert("Erro ao salvar. Tente novamente.");
        } finally {
            setIsSaving(false);
        }
    };

    // 3. RETORNO DE SUCESSO
    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-inner">
                    <Check size={48} strokeWidth={3} className="animate-bounce" />
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-black text-gray-900 uppercase italic leading-none">Roteiro Salvo!</h3>
                    <p className="text-gray-400 text-sm font-bold mt-2">Sua curadoria está pronta para ser explorada.</p>
                </div>
            </div>
        );
    }

    // 4. FEEDBACK PARA QUEM NÃO TEM VISITAS
    if (!visitas || visitas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-[32px] flex items-center justify-center shadow-inner rotate-3">
                    <Map size={48} strokeWidth={1.5} />
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-black text-gray-900 uppercase italic">Sua jornada começa aqui!</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                        Para criar um roteiro, você precisa de pelo menos <span className="text-blue-600 font-bold">2 visitas</span> registradas no seu diário.
                    </p>
                </div>

                <button
                    onClick={onSuccess} // Fecha o menu para ele poder clicar em "Visita"
                    className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl active:scale-95 transition-all shadow-lg"
                >
                    ENTENDIDO, BORA PASSEAR!
                </button>
            </div>
        );
    }


    return (

        <div className="space-y-6">

            {/* Título e Input Nome */}
            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Nome do Roteiro"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-none font-black text-lg focus:ring-2 focus:ring-orange-500 shadow-inner"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                />
                <textarea
                    placeholder="Dê uma breve descrição desta jornada..."
                    className="w-full p-4 rounded-2xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            {/* Grid de Parâmetros: Tempo e Custo */}
            <div className="grid grid-cols-2 gap-4">
                {/* Seletor de Tempo */}
                <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <Clock size={12} /> Tempo Estimado
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="0"
                            className="w-16 bg-white border-none rounded-xl p-2 font-bold text-center"
                            value={timeValue}
                            onChange={(e) => setTimeValue(e.target.value)}
                        />
                        <select
                            className="flex-1 bg-white border-none rounded-xl p-2 text-xs font-bold"
                            value={timeUnit}
                            onChange={(e) => setTimeUnit(e.target.value)}
                        >
                            <option value="minutos">Min</option>
                            <option value="horas">Horas</option>
                            <option value="dias">Dias</option>
                        </select>
                    </div>
                </div>

                {/* Seletor de Custo */}
                <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <DollarSign size={12} /> Custo Médio
                    </label>
                    <select
                        className="w-full bg-white border-none rounded-xl p-2 text-xs font-bold appearance-none"
                        value={costLevel}
                        onChange={(e) => setCostLevel(e.target.value)}
                    >
                        <option value="free">Gratuito (Free)</option>
                        <option value="barato">Barato ($)</option>
                        <option value="médio">Médio ($$)</option>
                        <option value="caro">Caro ($$$)</option>
                    </select>
                </div>
            </div>

            {/* Seleção de Visitas (Horizontal Scroll) */}
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                    Selecione os pontos da rota ({selectedIds.length})
                </p>
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                    {visitas.map((visita) => (
                        <button
                            key={visita.id}
                            onClick={() => {
                                const id = visita.id;
                                setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
                            }}
                            className={`relative min-w-[110px] h-[110px] rounded-[24px] overflow-hidden border-4 transition-all ${selectedIds.includes(visita.id) ? 'border-orange-600' : 'border-transparent'
                                }`}
                        >
                            {visita.photoUrl ? (
                                <img src={visita.photoUrl} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                                    <MapPin size={24} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <span className="absolute bottom-2 left-2 right-2 text-[10px] text-white font-bold truncate">
                                {visita.placeName}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleSaveRoute}
                disabled={isSaving}
                className="w-full py-5 bg-orange-600 text-white font-black rounded-3xl shadow-xl shadow-orange-100 active:scale-95 transition-all disabled:bg-gray-200"
            >
                {isSaving ? "SALVANDO..." : "PUBLICAR ROTEIRO"}
            </button>
        </div>
    );
}