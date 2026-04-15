// src/services/gamificationService.ts
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, setDoc, serverTimestamp } from 'firebase/firestore';

export const XP_VALUES = {
  CHECKIN_AVULSO: 50,    // O que chamamos de "Check-in Rápido" no modal
  COMPLETAR_ROTA: 200,
  CRIAR_ROTA: 150,
  AVALIAR_LOCAL: 20
};

// Função base para premiar XP (já existente)
export const awardXP = async (userId: string, type: keyof typeof XP_VALUES) => {
  const points = XP_VALUES[type];
  const userRef = doc(db, 'users', userId);
  
  await updateDoc(userRef, {
    xp: increment(points),
    [`stats.${type}`]: increment(1)
  });
};

/**
 * Registra o check-in diário e concede XP
 * @param stopId ID da parada (o __name__ do documento no Firestore)
 */
export const registerDailyCheckin = async (userId: string, stopId: string) => {
  const hoje = new Date().toISOString().split('T')[0];
  // Criamos um ID único para o dia: usuário_parada_data
  const checkinRef = doc(db, 'users', userId, 'checkins_diarios', `${stopId}_${hoje}`);

  // 1. Salva o registro para bloquear o botão amanhã
  await setDoc(checkinRef, {
    stopId,
    timestamp: serverTimestamp(),
    type: 'QUICK_CHECKIN'
  });

  // 2. Concede os pontos usando a função que já temos
  await awardXP(userId, 'CHECKIN_AVULSO');
};

export const getLevelInfo = (xp: number) => {
  const XP_PER_LEVEL = 500;
  const level = Math.floor((xp || 0) / XP_PER_LEVEL) + 1;
  const xpInCurrentLevel = (xp || 0) % XP_PER_LEVEL;
  const progress = (xpInCurrentLevel / XP_PER_LEVEL) * 100;
  
  return { level, progress, xpInCurrentLevel, nextLevelAt: XP_PER_LEVEL };
};