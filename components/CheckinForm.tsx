// src/components/CheckinForm.tsx
'use client';

import { useState, useEffect } from 'react'; // Adicionamos useEffect
import { Star, Loader2, ChevronLeft, MapPin } from 'lucide-react';
import { registrarVisita } from '@/services/checkinService';
import { useAuth } from '@/context/AuthContext';
import { GeoPoint } from 'firebase/firestore'; // Importe o tipo do Firebase
import { AnimatePresence } from 'framer-motion';
import SuccessFeedback from './SuccessFeedback'; // Importe o componente de feedback

interface CheckinFormProps {
  photo: Blob | null;
  onBack: () => void;
  onSuccess: () => void;
  // 📍 ADICIONE ESTA LINHA:
  initialData?: {
    placeName?: string;
    location?: any;
  };
}

export default function CheckinForm({ onBack, onSuccess, photo, initialData }: CheckinFormProps) {
    const { user } = useAuth();
    const [local, setLocal] = useState('');
    const [nota, setNota] = useState(5);
    const [comentario, setComentario] = useState('');
    const [enviando, setEnviando] = useState(false);

    // confirma que deu sucesso no post.
    const [sucesso, setSucesso] = useState(false);

    // Novo estado para a localização
    const [coordenadas, setCoordenadas] = useState<{ lat: number, lng: number } | null>(null);
    const [buscandoGps, setBuscandoGps] = useState(false);

    const [placeName, setPlaceName] = useState(initialData?.placeName || '');
    const [location, setLocation] = useState(initialData?.location || null);

    // Efeito para buscar a localização assim que o form abrir
    useEffect(() => {
        if ("geolocation" in navigator) {
            setBuscandoGps(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoordenadas({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setBuscandoGps(false);
                },
                (error) => {
                    console.error("Erro ao obter GPS:", error);
                    setBuscandoGps(false);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
            );
        }
    }, []);

    //Salvar o post.
    const handleSalvar = async () => {
        if (!user || !local) return;
        setEnviando(true);

        try {
            let fotoUrl = "";

            // SE TIVER FOTO, FAZ O UPLOAD PRIMEIRO
            if (photo) {
                const filename = `visita-${Date.now()}.jpg`;
                const response = await fetch(`/api/upload?filename=${filename}`, {
                    method: 'POST',
                    body: photo, // Nosso Blob da câmera
                });

                if (!response.ok) {
                    // Aqui pegamos o erro que a API devolveu
                    const errorData = await response.json();
                    console.error("❌ Erro na resposta da API:", errorData);
                    throw new Error("Falha no servidor de upload");
                }

                const newBlob = await response.json();
                fotoUrl = newBlob.url; // Esse é o link público da foto!
            }

            const locationData = coordenadas ? new GeoPoint(coordenadas.lat, coordenadas.lng) : null;
            // AGORA SALVAMOS TUDO NO FIRESTORE (Incluindo a fotoUrl)
            await registrarVisita(user.uid, local, nota, comentario, locationData, fotoUrl || ""); // Passa a URL da foto ou string vazia

            setSucesso(true); // Ativa a mensagem de sucesso

            // Aguarda 2 segundos para o usuário ver a mensagem antes de fechar tudo
            setTimeout(() => {
                onSuccess();
            }, 2000);

        } catch (error) {
            console.error(error);
            alert("Erro ao processar registro.");
        } finally {
            setEnviando(false);
        }
    };

    // Elementos da interface do formulário
    return (
        <div className="space-y-6">
            {/* Botão voltar */}
            <button onClick={onBack} className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-orange-600 transition-colors">
                <ChevronLeft size={16} /> Voltar
            </button>
            {/* Indicador de GPS */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <MapPin size={14} className={coordenadas ? "text-green-500" : "text-orange-500 animate-pulse"} />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                    {buscandoGps ? "Buscando localização..." : coordenadas ? "Localização fixada via GPS" : "GPS indisponível"}
                </span>
            </div>
            {/* Titulo do local */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Onde você está?</label>
                <input
                    type="text"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    placeholder="Ex: Museu do Ipiranga"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
            </div>
            {/* imput de estrelas */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Sua nota</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((estrela) => (
                        <button key={estrela} onClick={() => setNota(estrela)}>
                            <Star size={28} className={estrela <= nota ? "fill-orange-500 text-orange-500" : "text-gray-200"} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Comentário */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">O que achou?</label>
                <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Conte um pouco sobre o lugar..."
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                />
            </div>

            {/* Botão de salvar */}
            <button
                onClick={handleSalvar}
                disabled={enviando || !local}
                className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {enviando ? <Loader2 className="animate-spin" /> : "Confirmar Visita"}
            </button>

            {/* Overlay de Sucesso com Framer Motion */}
            // Dentro do return do CheckinForm.tsx
            <AnimatePresence>
                {sucesso && (
                    <SuccessFeedback
                        title="Visita Salva!"
                        message="+10 pontos de explorador"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}