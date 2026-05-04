// src/services/checkinService.ts

import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  GeoPoint,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc,
  increment
} from 'firebase/firestore';


/**
 * Alterna o estado de favorito de um roteiro para o usuário
 * @param userId ID do usuário logado
 * @param routeId ID do roteiro que ele quer favoritar
 */
export const toggleFavorite = async (userId: string, routeId: string) => {
  const favoriteRef = doc(db, 'users', userId, 'favorites', routeId);
  const favoriteDoc = await getDoc(favoriteRef);

  if (favoriteDoc.exists()) {
    // Se já existe, o usuário clicou para remover
    await deleteDoc(favoriteRef);
    return false; // Retorna false para indicar que não é mais favorito
  } else {
    // Se não existe, vamos adicionar
    await setDoc(favoriteRef, {
      routeId,
      addedAt: serverTimestamp(),
    });
    return true; // Retorna true para indicar que agora é favorito
  }
};

/**
 * Verifica se um roteiro específico é favorito do usuário
 */
export const isRouteFavorite = async (userId: string, routeId: string) => {
  const favoriteRef = doc(db, 'users', userId, 'favorites', routeId);
  const favoriteDoc = await getDoc(favoriteRef);
  return favoriteDoc.exists();
};

export const registrarVisita = async (
  userId: string,
  placeName: string,
  rating: number,
  comment: string,
  location: GeoPoint | null,
  photoUrl: string = "",
  category: string // <--- Adicione este parâmetro
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
    category, // <--- Salva no banco!
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