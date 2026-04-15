// src/services/checkinService.ts

import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  GeoPoint,
  doc,
  updateDoc,
  increment 
} from 'firebase/firestore';

export const registrarVisita = async (
  userId: string,
  placeName: string,
  rating: number,
  comment: string,
  location: GeoPoint | null,
  photoUrl: string = ""
) => {
  // 1. Registra o check-in normalmente
  const docRef = await addDoc(collection(db, 'checkins'), {
    userId,
    placeName,
    rating,
    comment,
    location,
    photoUrl: photoUrl || "",
    timestamp: serverTimestamp(),
    status: 'avulso'
  });

  // 2. LÓGICA DE GAMIFICAÇÃO: Soma XP ao usuário
  // Vamos dar 50 XP por cada visita registrada.
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      xp: increment(50), // O Firebase faz a soma atômica no servidor
      totalCheckins: increment(1)
    });
  } catch (error) {
    console.error("Erro ao atualizar XP do usuário:", error);
    // Nota: O check-in foi salvo, mas o XP falhou (ex: user doc não existe)
  }

  return docRef;
};