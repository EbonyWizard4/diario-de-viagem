'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Map, MapPin, X } from 'lucide-react';
import { registrarVisita } from '@/services/checkinService';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function CreateActionMenu({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { user } = useAuth();

  // FUNÇÃO DE TESTE
  const testeSalvarNoFirebase = async () => {
    console.log("Iniciando teste de salvamento..."); // Isso vai aparecer no F12
    // O "Guarda" da função
    if (!user) {
      alert("Erro: Você precisa estar logado para salvar!");
      return; // Para a execução aqui
    }
    try {
      // Chamando o serviço que criamos (ou a lógica direta)
      // Substitua os valores abaixo pelo que você quer testar
      const local = "Minha Casa - Teste TCC";
      const nota = 5;
      const comentario = "Testando a conexão com o Firestore";

      await registrarVisita(user.uid, local, nota, comentario);

      alert("✅ SUCESSO! O dado foi para o Firebase!");
    } catch (erro) {
      console.error("❌ ERRO AO SALVAR:", erro);
      alert("Ops! Algo deu errado. Olhe o console (F12).");
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleRegistrarVisita = async () => {
    const local = window.prompt("Onde você está agora?");
    const nota = parseInt(window.prompt("Dê uma nota para este lugar (1-5):") || "0", 5);
    const comentario = window.prompt("Deixe um comentário:") || "";

    if (local && user) {
      setIsSaving(true);
      try {
        await registrarVisita(user.uid, local, nota, comentario);
        alert("Visita registrada com sucesso! 🚀");
        onClose(); // Fecha o menu
      } catch (e) {
        alert("Erro ao salvar. Tente novamente.");
      } finally {
        setIsSaving(false);
      }
    }

    // ESTA É A FUNÇÃO DE TESTE
    const testeSalvarNoFirebase = async () => {
      console.log("Iniciando teste de salvamento..."); // Isso vai aparecer no F12
      // O "Guarda" da função
      if (!user) {
        alert("Erro: Você precisa estar logado para salvar!");
        return; // Para a execução aqui
      }
      try {
        // Chamando o serviço que criamos (ou a lógica direta)
        // Substitua os valores abaixo pelo que você quer testar
        const local = "Minha Casa - Teste TCC";
        const nota = 5;
        const comentario = "Testando a conexão com o Firestore";

        await registrarVisita(user.uid, local, nota, comentario);

        alert("✅ SUCESSO! O dado foi para o Firebase!");
      } catch (erro) {
        console.error("❌ ERRO AO SALVAR:", erro);
        alert("Ops! Algo deu errado. Olhe o console (F12).");
      }
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Fundo Escuro para Focar na Caixa */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/30 z-[60] backdrop-blur-sm"
            />

            {/* A Caixa de Opções */}
            <motion.div
              initial={{ y: 100, scale: 0.8, opacity: 0 }}
              animate={{ y: -100, scale: 1, opacity: 1 }} // Sobe 100px acima do botão
              exit={{ y: 100, scale: 0.8, opacity: 0 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white rounded-[32px] p-6 shadow-2xl z-[70] border border-orange-50"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-gray-900 text-lg italic uppercase tracking-tighter">O que vamos fazer?</h3>
                <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-400">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Opção 1: Registro Simples */}
                <button onClick={handleRegistrarVisita}
                  disabled={isSaving} className="flex flex-col items-center gap-3 p-4 bg-orange-50 rounded-3xl border-2 border-transparent hover:border-orange-200 transition-all active:scale-95">
                  <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white">
                    <MapPin size={24} />
                  </div>
                  <span className="font-bold text-sm text-orange-900">Registrar Visita</span>
                </button>

                {/* Opção 2: Criar Rota */}
                <button className="flex flex-col items-center gap-3 p-4 bg-blue-50 rounded-3xl border-2 border-transparent hover:border-blue-200 transition-all active:scale-95">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                    <Map size={24} />
                  </div>
                  <span className="font-bold text-sm text-blue-900">Criar Rota</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
}