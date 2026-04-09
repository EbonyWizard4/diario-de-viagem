'use client';
import { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X } from 'lucide-react';

export default function CameraCapture({ onCapture, onCancel }: { onCapture: (blob: Blob) => void, onCancel: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  // Iniciar Câmera
  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' }, // 'user' para selfie
          audio: false 
        });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) {
        alert("Erro ao acessar câmera. Verifique as permissões.");
        onCancel();
      }
    }
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const tirarFoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPhoto(dataUrl);
    }
  };

  const confirmarFoto = () => {
    if (photo) {
      // Converte Base64 para Blob (formato de arquivo)
      fetch(photo).then(res => res.blob()).then(onCapture);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Selfie do Momento 📸</h3>
      
      <div className="relative w-full aspect-square bg-black rounded-[32px] overflow-hidden shadow-xl border-4 border-orange-100">
        {!photo ? (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover mirror" />
        ) : (
          <img src={photo} className="w-full h-full object-cover" />
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-4">
        {!photo ? (
          <>
            <button onClick={onCancel} className="p-4 bg-gray-100 rounded-full text-gray-400"><X /></button>
            <button onClick={tirarFoto} className="p-6 bg-orange-600 rounded-full text-white shadow-lg shadow-orange-200"><Camera size={32} /></button>
          </>
        ) : (
          <>
            <button onClick={() => setPhoto(null)} className="p-4 bg-gray-100 rounded-full text-gray-400"><RefreshCw /></button>
            <button onClick={confirmarFoto} className="p-6 bg-green-500 rounded-full text-white shadow-lg shadow-green-200"><Check size={32} /></button>
          </>
        )}
      </div>
    </div>
  );
}