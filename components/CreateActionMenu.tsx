// src/components/CreateActionMenu.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Map, ChevronLeft } from 'lucide-react'; // Adicionei ChevronLeft
import CheckinForm from './CheckinForm';
import CameraCapture from './CameraCapture';
import RouteCreator from './RouteCreator'; // O componente que criamos antes!

// Tipagem para os passos
type Step = 'menu' | 'camera' | 'checkin' | 'route';

export default function CreateActionMenu({ 
  isOpen, 
  onClose,
  visitas // Recebemos as visitas do componente pai (ex: Perfil ou Home)
}: { 
  isOpen: boolean, 
  onClose: () => void,
  visitas: any[] 
}) {
  
  const [step, setStep] = useState<Step>('menu');
  const [tempPhoto, setTempPhoto] = useState<Blob | null>(null);

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
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl border-t border-orange-100 max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {/* BOTÃO VOLTAR (Aparece em qualquer step que não seja o menu) */}
            {step !== 'menu' && (
              <button 
                onClick={() => setStep('menu')}
                className="absolute top-8 left-8 p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* --- PASSO 1: MENU PRINCIPAL --- */}
            {step === 'menu' && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black text-gray-900 italic uppercase">O que vamos fazer?</h2>
                  <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-400"><X size={20} /></button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setStep('camera')}
                    className="flex flex-col items-center gap-3 p-6 bg-orange-50 rounded-[32px] border-2 border-transparent hover:border-orange-200 transition-all active:scale-95"
                  >
                    <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                      <MapPin size={28} />
                    </div>
                    <span className="font-bold text-sm text-orange-900">Visita</span>
                  </button>

                  <button 
                    onClick={() => setStep('route')} // AGORA HABILITADO
                    className="flex flex-col items-center gap-3 p-6 bg-blue-50 rounded-[32px] border-2 border-transparent hover:border-blue-200 transition-all active:scale-95"
                  >
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
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
                  setStep('checkin');
                }}
              />
            )}

            {/* --- PASSO 3: FORMULÁRIO DE VISITA --- */}
            {step === 'checkin' && (
              <CheckinForm
                photo={tempPhoto}
                onBack={() => setStep('camera')}
                onSuccess={() => onClose()}
              />
            )}

            {/* --- NOVO PASSO 4: CRIADOR DE ROTAS --- */}
            {step === 'route' && (
              <div className="pt-4">
                <RouteCreator 
                  visitas={visitas} // Passamos o array que vem do Perfil
                  onSuccess={() => onClose()}
                />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}