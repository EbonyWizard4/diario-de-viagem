import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const registrarVisita = async (
  userId: string, 
  placeName: string, 
  rating: number, 
  comment: string
) => {
  try {
    const docRef = await addDoc(collection(db, 'checkins'), {
      userId,
      placeName,
      rating,   // Novo campo
      comment,  // Novo campo
      timestamp: serverTimestamp(),
      status: 'avulso',
      imageUrl: null // Deixamos como null até implementarmos o Storage
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao registrar visita: ", error);
    throw error;
  }
};