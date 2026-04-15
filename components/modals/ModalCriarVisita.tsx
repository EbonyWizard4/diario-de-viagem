// src/components/modals/ModalVisitaCompleta.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import CameraCapture from '../CameraCapture';
import CheckinForm from '../CheckinForm';

interface ModalVisitaCompletaProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlaceName?: string; // Para quando vier da Rota
  defaultLocation?: any;      // Para quando vier da Rota
}

export default function ModalVisitaCompleta({ 
  isOpen, 
  onClose, 
  defaultPlaceName, 
  defaultLocation 
}: ModalVisitaCompletaProps) {
  const [step, setStep] = useState<'camera' | 'checkin'>('camera');
  const [tempPhoto, setTempPhoto] = useState<Blob | null>(null);


  // Dentro do seu CreateActionMenu original:
const [isVisitaModalOpen, setIsVisitaModalOpen] = useState(false);

// No botão de "Visita":
<button
  onClick={() => setIsVisitaModalOpen(true)} // Abre o novo modal especializado
  className="..."
>
  {/* Conteúdo do botão */}
</button>

{/* Adicione o modal aqui no final */}
<ModalVisitaCompleta 
  isOpen={isVisitaModalOpen} 
  onClose={() => setIsVisitaModalOpen(false)} 
/>

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[110] backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-[120] shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-gray-900 italic uppercase">
                {defaultPlaceName ? `Visita: ${defaultPlaceName}` : 'Registrar Visita'}
              </h2>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>

            {step === 'camera' && (
              <CameraCapture
                onCancel={onClose}
                onCapture={(blob) => {
                  setTempPhoto(blob);
                  setStep('checkin');
                }}
              />
            )}

            {step === 'checkin' && (
              <CheckinForm
                photo={tempPhoto}
                onBack={() => setStep('camera')}
                onSuccess={() => {
                  onClose();
                  setStep('camera'); // Reseta para a próxima
                }}
                // Passamos os dados padrões se existirem
                initialData={{
                  placeName: defaultPlaceName,
                  location: defaultLocation
                }}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}