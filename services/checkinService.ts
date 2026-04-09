// src/services/checkinService.ts
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  GeoPoint // <--- ADICIONE ESTE IMPORT AQUI
} from 'firebase/firestore';

export const registrarVisita = async (
  userId: string,
  placeName: string,
  rating: number,
  comment: string,
  location: GeoPoint | null, // Novo campo
  photoUrl: string = "" // <--- Garante que seja uma string, mesmo que vazia
) => {
  return await addDoc(collection(db, 'checkins'), {
    userId,
    placeName,
    rating,
    comment,
    location, // Salva como GeoPoint no Firestore
    photoUrl: photoUrl || "", // <--- Salva o link aqui ou uma string vazia se for null/undefined
    timestamp: serverTimestamp(),
    status: 'avulso'
  });
};