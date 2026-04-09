// src/components/CreateActionMenu.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Map } from 'lucide-react';
import CheckinForm from './CheckinForm';
import CameraCapture from './CameraCapture'; // Certifique-se de ter criado este arquivo!

export default function CreateActionMenu({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  // Estados para controlar o fluxo
  const [step, setStep] = useState<'menu' | 'camera' | 'checkin'>('menu');
  const [tempPhoto, setTempPhoto] = useState<Blob | null>(null);

  // Resetar para o menu sempre que fechar/abrir
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('menu');
        setTempPhoto(null);
      }, 300);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl border-t border-orange-100"
          >
            {/* --- PASSO 1: MENU PRINCIPAL --- */}
            {step === 'menu' && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black text-gray-900 italic uppercase">O que vamos fazer?</h2>
                  <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-400"><X size={20} /></button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setStep('camera')} // AGORA VAI PARA A CÂMERA
                    className="flex flex-col items-center gap-3 p-6 bg-orange-50 rounded-[32px] border-2 border-transparent hover:border-orange-200 transition-all active:scale-95"
                  >
                    <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                      <MapPin size={28} />
                    </div>
                    <span className="font-bold text-sm text-orange-900">Visita</span>
                  </button>

                  <button className="flex flex-col items-center gap-3 p-6 bg-blue-50 rounded-[32px] border-2 border-transparent opacity-50 cursor-not-allowed">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                      <Map size={28} />
                    </div>
                    <span className="font-bold text-sm text-blue-900">Nova Rota</span>
                  </button>
                </div>
              </>
            )}

            {/* --- PASSO 2: CÂMERA --- */}
            {step === 'camera' && (
              <CameraCapture 
                onCancel={() => setStep('menu')}
                onCapture={(blob) => {
                  setTempPhoto(blob);
                  setStep('checkin'); // FOTO TIRADA? VAI PRO FORM
                }}
              />
            )}

            {/* --- PASSO 3: FORMULÁRIO --- */}
            {step === 'checkin' && (
              <CheckinForm
                photo={tempPhoto} // Passamos a foto (opcional, se quiser usar no form)
                onBack={() => setStep('camera')} // Volta para a câmera se quiser tirar outra
                onSuccess={() => {
                  // alert("Check-in realizado! 🚀");
                  onClose();
                }}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}