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
  category: string 
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
    category, 
    status: 'avulso'
  });

  // 2. LÓGICA DE GAMIFICAÇÃO SEGURA (Upsert)
  try {
    const userRef = doc(db, 'users', userId);
    
    /* 🚀 SOLUÇÃO DO BUG: Trocamos 'updateDoc' por 'setDoc' com '{ merge: true }'.
       Se o documento do usuário não existir, ele cria o registro com o XP e incrementa.
       Se já existir, atualiza os campos de forma incremental sem tocar no resto.
    */
    await setDoc(userRef, {
      xp: increment(50), 
      totalCheckins: increment(1),
      lastActive: serverTimestamp() // Bom para registrar o último momento que ganhou XP
    }, { merge: true });

    console.log(`Sucesso! 50 XP adicionados ao usuário: ${userId}`);

  } catch (error) {
    // Agora esse bloco só será acionado por erros graves (ex: falta de internet ou regras de segurança do Firebase)
    console.error("Erro crítico ao atualizar gamificação do usuário:", error);
  }

  return docRef;
};