// --- COMPONENTE DE APOIO (GAMIFICAÇÃO) ---
// app/components/BotaoCheckinParada.tsx
'use client';

import { useState, useEffect } from 'react';
import { calculateDistance } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Check, MapPin, Camera, Star } from 'lucide-react';
import { registerDailyCheckin } from '@/services/gamificationService';
import ModalVisitaCompleta from './modals/ModalCriarVisita';

interface BotaoProps {
    stop: any;
    userLocation: { lat: number; lng: number } | null;
    userId: string;
}

export default function BotaoCheckinParada({ stop, userLocation, userId }: BotaoProps) {
    const [status, setStatus] = useState<'longe' | 'perto' | 'concluido' | 'loading'>('loading');
    const [distanciaTexto, setDistanciaTexto] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Dentro do BotaoCheckinParada
    const [showFullVisitModal, setShowFullVisitModal] = useState(false);


    // 1. Verificar se já fez check-in hoje ao carregar
    useEffect(() => {
        async function verificarStatus() {
            if (!userId || !stop.id) return;

            const hoje = new Date().toISOString().split('T')[0]; // Ex: 2026-04-15
            const checkinRef = doc(db, 'users', userId, 'checkins_diarios', `${stop.id}_${hoje}`);
            const snap = await getDoc(checkinRef);

            if (snap.exists()) {
                setStatus('concluido');
            } else {
                // Se não fez, inicia a lógica de distância que já tínhamos
                checkDistancia();
            }
        }
        verificarStatus();
    }, [userLocation, stop, userId]);

    const checkDistancia = () => {
        if (userLocation && stop.location) {
            const d = calculateDistance(userLocation.lat, userLocation.lng, stop.location.latitude, stop.location.longitude);
            if (d <= 0.2) setStatus('perto');
            else {
                setStatus('longe');
                setDistanciaTexto(d < 1 ? `${(d * 1000).toFixed(0)}m` : `${d.toFixed(1)}km`);
            }
        }
    };

    const executarCheckinSimples = async () => {
        try {
            setStatus('loading');

            // Chama o serviço que criamos acima
            await registerDailyCheckin(userId, stop.id);

            setStatus('concluido');
            setShowModal(false);
            alert("🎉 +50 XP! Check-in realizado com sucesso!");
        } catch (error) {
            console.error("Erro ao processar gamificação:", error);
            alert("Ops! Tivemos um problema ao computar seus pontos.");
            setStatus('perto');
        }
    };

    // Confirmação da visita (após check-in simples ou criação de visita completa)
    if (status === 'concluido') {
        return (
            <div className="w-full py-3 bg-green-50 text-green-600 rounded-2xl text-center font-black text-[10px] uppercase border border-green-200 flex items-center justify-center gap-2">
                <Check size={14} /> Visita de Hoje Confirmada
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                disabled={status !== 'perto'}
                className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase transition-all ${status === 'perto' ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'
                    }`}
            >
                {status === 'perto' ? 'Confirmar Presença 📍' : `Longe do local (${distanciaTexto})`}
            </button>

            {/* MODAL DE DECISÃO */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl">
                        <h3 className="text-xl font-black text-gray-900 uppercase italic mb-2 text-center">
                            Você chegou! 🏁
                        </h3>
                        <p className="text-gray-500 text-center text-sm mb-8">
                            Como deseja registrar sua passagem pelo <strong>{stop.placeName}</strong>?
                        </p>

                        <div className="grid gap-4">
                            {/* Opção 1: Check-in Simples */}
                            <button
                                onClick={executarCheckinSimples}
                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl hover:bg-orange-50 transition-colors group"
                            >
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-600 group-hover:scale-110 transition-transform">
                                    <MapPin size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 text-sm">Check-in Rápido</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">+50 XP</p>
                                </div>
                            </button>

                            {/* Opção 2: Criar Visita (Com Foto/Review) */}
                            <button
                                onClick={() => {
                                    setShowFullVisitModal(true);
                                }}
                                className="flex items-center gap-4 p-4 bg-orange-600 rounded-3xl shadow-lg shadow-orange-200 group"
                            >
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                                    <Camera size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white text-sm">Criar Visita Completa</p>
                                    <p className="text-[10px] text-orange-200 font-bold uppercase">+100 XP + Badges</p>
                                </div>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full mt-6 text-gray-400 font-bold text-[10px] uppercase tracking-widest"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
            {/* O Modal especializado entra aqui */}
            <ModalVisitaCompleta
                isOpen={showFullVisitModal}
                onClose={() => setShowFullVisitModal(false)}
                defaultPlaceName={stop.placeName}
                defaultLocation={stop.location}
            />

        </>
    );
}