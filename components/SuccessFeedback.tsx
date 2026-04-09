'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SuccessFeedbackProps {
  title?: string;
  message?: string;
}

export default function SuccessFeedback({ 
  title = "Sucesso!", 
  message = "Ação concluída com êxito." 
}: SuccessFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[80] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md rounded-t-[40px] text-center p-6"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-200"
      >
        <Check size={48} strokeWidth={4} />
      </motion.div>
      
      <h3 className="text-2xl font-black text-gray-900 uppercase italic leading-tight">
        {title}
      </h3>
      <p className="mt-2 text-gray-500 font-medium tracking-wide">
        {message}
      </p>
    </motion.div>
  );
}