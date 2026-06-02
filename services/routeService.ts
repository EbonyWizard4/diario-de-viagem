// src/services/routeService.ts
import { db } from '@/lib/firebase';
import { collection, limit, getDocs, query } from 'firebase/firestore';

export interface RouteData {
  id: string;
  title: string;
  imageUrl?: string;
  stopsCount: number;
  bairro: string;
  rating: number;
  tags: string[];
  duration: {
    value: number | string;
    unit: string;
  };
}

/**
 * Retorna a primeira rota disponível no banco de dados para fins de demonstração
 */
export const getDestaqueRoute = async (): Promise<RouteData | null> => {
  try {
    const routesRef = collection(db, 'routes');
    // Uma query simples e direta, sem where, sem orderBy (evita erros de índices)
    const q = query(routesRef, limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as RouteData;
    }

    return null;
  } catch (error) {
    console.error("Erro crítico ao buscar rota padrão:", error);
    return null;
  }
};