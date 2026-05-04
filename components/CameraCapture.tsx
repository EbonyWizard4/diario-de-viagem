'use client';
import { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, SwitchCamera } from 'lucide-react';

export default function CameraCapture({ onCapture, onCancel }: { onCapture: (blob: Blob) => void, onCancel: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // Gerenciamento ÚNICO da Câmera
  useEffect(() => {
    async function startCamera() {
      // Para qualquer rastro da câmera anterior antes de iniciar a nova
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }

      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) {
        console.error("Erro ao acessar câmera:", err);
        // Não damos alert direto para não quebrar a UX, mas notificamos o erro
      }
    }
    startCamera();

    // Cleanup ao desmontar o componente
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [facingMode]); // Só reinicia se mudar o modo (frontal/traseira)

  const tirarFoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Ajusta a resolução do canvas para a resolução real do vídeo
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Se for câmera frontal, espelhamos a imagem final também
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0);
        setPhoto(canvas.toDataURL('image/jpeg', 0.8));
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      <h3 className="text-[10px] font-black uppercase tracking-[3px] text-gray-400">
        {photo ? "Resultado do Check-in" : "Registre sua Visita"}
      </h3>

      <div className="relative w-full aspect-[3/4] bg-gray-900 rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
        {!photo ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} 
            />
            {/* Botão de Alternar Câmera - Visível apenas durante o Preview */}
            <button
              onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
              className="absolute top-6 right-6 p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 text-white active:scale-90 transition-all z-50"
            >
              <SwitchCamera size={24} />
            </button>
          </>
        ) : (
          <img src={photo} className="w-full h-full object-cover animate-in fade-in zoom-in duration-300" />
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex items-center gap-6 mt-2">
        {!photo ? (
          <>
            <button onClick={onCancel} className="p-5 bg-gray-100 rounded-3xl text-gray-400 active:scale-95 transition-all">
              <X size={24} />
            </button>
            <button 
              onClick={tirarFoto} 
              className="p-8 bg-orange-600 rounded-[32px] text-white shadow-xl shadow-orange-200 active:scale-90 transition-all"
            >
              <Camera size={32} />
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setPhoto(null)} 
              className="flex flex-col items-center gap-2 text-gray-400 font-bold text-[10px] uppercase"
            >
              <div className="p-5 bg-gray-100 rounded-3xl"><RefreshCw size={24} /></div>
              Repetir
            </button>
            <button 
              onClick={() => fetch(photo!).then(res => res.blob()).then(onCapture)} 
              className="flex flex-col items-center gap-2 text-green-600 font-bold text-[10px] uppercase"
            >
              <div className="p-8 bg-green-500 rounded-[32px] text-white shadow-xl shadow-green-100 active:scale-95 transition-all">
                <Check size={32} />
              </div>
              Confirmar
            </button>
          </>
        )}
      </div>
    </div>
  );
}