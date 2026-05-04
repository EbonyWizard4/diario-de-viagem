// src/components/CreateActionMenu.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Map, ChevronLeft } from 'lucide-react';
import CheckinForm from './CheckinForm';
import CameraCapture from './CameraCapture';
import RouteCreator from './RouteCreator';
import ModalVisitaCompleta from './modals/ModalCriarVisita';

type Step = 'menu' | 'camera' | 'checkin' | 'route';

export default function CreateActionMenu({
  isOpen,
  onClose,
<<<<<<< HEAD
  visitas
=======
  visitas 
>>>>>>> camera
}: {
  isOpen: boolean,
  onClose: () => void,
  visitas: any[]
}) {
  const [step, setStep] = useState<Step>('menu');
  const [tempPhoto, setTempPhoto] = useState<Blob | null>(null);
  const [isVisitaModalOpen, setIsVisitaModalOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('menu');
        setTempPhoto(null);
      }, 300);
    }
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait"> {/* O mode="wait" ajuda a evitar conflitos de animação */}
      {isOpen && (
<<<<<<< HEAD
        <motion.div key="action-menu-wrapper" className="relative z-[60]">
          {/* Overlay - Adicionado Key */}
          <motion.div
            key="menu-overlay"
=======
        /* 
           🚀 SOLUÇÃO: Removido o Fragmento (<>) e adicionado um wrapper motion.div 
           com uma key única. Isso resolve o erro de chaves duplicadas/vazias.
        */
        <motion.div key="create-action-wrapper">
          <motion.div
            key="action_menu_backdrop"
>>>>>>> camera
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content - Adicionado Key */}
          <motion.div
<<<<<<< HEAD
            key="menu-sheet"
=======
            key="action_menu_content"
>>>>>>> camera
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 shadow-2xl border-t border-orange-100 max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {/* BOTÃO VOLTAR */}
            {step !== 'menu' && (
              <button
                key="back-button"
                onClick={() => setStep('menu')}
                className="absolute top-8 left-8 p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* PASSO 1: MENU PRINCIPAL */}
            {step === 'menu' && (
<<<<<<< HEAD
              <motion.div key="step-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
=======
              <div key="step-menu-container">
>>>>>>> camera
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black text-gray-900 italic uppercase">O que vamos fazer?</h2>
                  <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-400"><X size={20} /></button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    key="btn-visita"
                    onClick={() => setIsVisitaModalOpen(true)}
                    className="flex flex-col items-center gap-3 p-6 bg-orange-50 rounded-[32px] border-2 border-transparent hover:border-orange-200 transition-all active:scale-95"
                  >
                    <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                      <MapPin size={28} />
                    </div>
                    <span className="font-bold text-sm text-orange-900">Visita</span>
                  </button>

                  <button
<<<<<<< HEAD
=======
                    key="btn-rota"
>>>>>>> camera
                    onClick={() => setStep('route')}
                    className="flex flex-col items-center gap-3 p-6 bg-blue-50 rounded-[32px] border-2 border-transparent hover:border-blue-200 transition-all active:scale-95"
                  >
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                      <Map size={28} />
                    </div>
                    <span className="font-bold text-sm text-blue-900">Nova Rota</span>
                  </button>
                </div>
<<<<<<< HEAD
              </motion.div>
            )}

            {/* --- DEMAIS PASSOS (Ajustados com chaves para animação limpa) --- */}
            {step === 'camera' && (
              <motion.div key="step-camera">
                <CameraCapture
                  onCancel={() => setStep('menu')}
                  onCapture={(blob) => {
                    setTempPhoto(blob);
                    setStep('checkin');
                  }}
                />
              </motion.div>
            )}

            {step === 'checkin' && (
              <motion.div key="step-checkin">
                <CheckinForm
                  photo={tempPhoto}
                  onBack={() => setStep('camera')}
=======
              </div>
            )}

            {/* PASSO 2: CÂMERA */}
            {step === 'camera' && (
              <CameraCapture
                key="step-camera"
                onCancel={() => setStep('menu')}
                onCapture={(blob) => {
                  setTempPhoto(blob);
                  setStep('checkin');
                }}
              />
            )}

            {/* PASSO 3: FORMULÁRIO DE VISITA */}
            {step === 'checkin' && (
              <CheckinForm
                key="step-checkin"
                photo={tempPhoto}
                onBack={() => setStep('camera')}
                onSuccess={() => onClose()}
              />
            )}

            {/* PASSO 4: CRIADOR DE ROTAS */}
            {step === 'route' && (
              <div key="step-route-container" className="pt-4">
                <RouteCreator
                  visitas={visitas}
>>>>>>> camera
                  onSuccess={() => onClose()}
                />
              </motion.div>
            )}

            {step === 'route' && (
              <motion.div key="step-route" className="pt-4">
                <RouteCreator
                  visitas={visitas}
                  onSuccess={() => onClose()}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
<<<<<<< HEAD
      )}

      {/* --- MODAL DE VISITA FORA DO FLOW DO MENU PARA EVITAR O BUG DE KEY --- */}
      {isVisitaModalOpen && (
        <ModalVisitaCompleta
          key="modal-visita-externo"
          isOpen={isVisitaModalOpen}
          onClose={() => setIsVisitaModalOpen(false)}
        />
      )}
=======
      )}

      {/* Modais externos não precisam estar dentro do wrapper motion */}
      <ModalVisitaCompleta
        key="modal-visita-completa"
        isOpen={isVisitaModalOpen}
        onClose={() => setIsVisitaModalOpen(false)}
      />
>>>>>>> camera
    </AnimatePresence>
  );
}