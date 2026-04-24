// src/services/gamificationService.ts
import { db } from '@/lib/firebase';
import { 
  doc, 
  updateDoc, 
  increment, 
  setDoc, 
  serverTimestamp, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  arrayUnion 
} from 'firebase/firestore';

export const XP_VALUES = {
  CHECKIN_AVULSO: 50,
  COMPLETAR_ROTA: 200,
  CRIAR_ROTA: 150,
  AVALIAR_LOCAL: 20
};

/**
 * Premia XP e estatísticas
 */
export const awardXP = async (userId: string, type: keyof typeof XP_VALUES) => {
  const points = XP_VALUES[type];
  const userRef = doc(db, 'users', userId);
  
  await updateDoc(userRef, {
    xp: increment(points),
    [`stats.${type}`]: increment(1)
  });
};

/**
 * Registra o check-in diário e verifica conquistas
 */
export const registerDailyCheckin = async (userId: string, stopId: string, category?: string) => {
  const hoje = new Date().toISOString().split('T')[0];
  const checkinRef = doc(db, 'users', userId, 'checkins_diarios', `${stopId}_${hoje}`);

  // 1. Salva o registro (Evita duplicidade no mesmo dia)
  await setDoc(checkinRef, {
    stopId,
    category: category || 'geral',
    timestamp: serverTimestamp(),
    type: 'QUICK_CHECKIN'
  });

  // 2. Concede XP
  await awardXP(userId, 'CHECKIN_AVULSO');

  // 3. Verifica se o usuário ganhou novos Triunfos
  return await checkAndGrantBadges(userId);
};

/**
 * Lógica de Triunfos (Badges) baseada em histórico
 */
export const checkAndGrantBadges = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return null;

  const userData = userSnap.data();
  const badgesAtuais = userData.badges || [];

  // Busca histórico de check-ins para validar metas
  const q = query(collection(db, 'checkins'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const checkins = querySnapshot.docs.map(d => d.data());

  const contagem = {
    gastronomia: checkins.filter(c => c.category === 'gastronomia').length,
    artes: checkins.filter(c => c.category === 'artes').length,
    passeios: checkins.filter(c => c.category === 'passeios').length,
    role: checkins.filter(c => {
      // Regra do Rolê: Check-in entre 22h e 05h
      if (!c.timestamp) return false;
      const hora = c.timestamp.toDate().getHours();
      return hora >= 22 || hora <= 5;
    }).length
  };

  const novasBadges: string[] = [];

  // Regras de Negócio para Conquistas
  if (contagem.gastronomia >= 5 && !badgesAtuais.includes('gastronomia')) novasBadges.push('gastronomia');
  if (contagem.artes >= 3 && !badgesAtuais.includes('artes')) novasBadges.push('artes');
  if (contagem.passeios >= 3 && !badgesAtuais.includes('passeios')) novasBadges.push('passeios');
  if (contagem.role >= 1 && !badgesAtuais.includes('role')) novasBadges.push('role');

  if (novasBadges.length > 0) {
    await updateDoc(userRef, {
      badges: arrayUnion(...novasBadges)
    });
    return novasBadges; // Retorna para disparar feedback visual (ex: confete)
  }

  return null;
};

/**
 * Cálculos de Nível e Progresso
 */
export const getLevelInfo = (xp: number) => {
  const XP_PER_LEVEL = 500;
  const level = Math.floor((xp || 0) / XP_PER_LEVEL) + 1;
  const xpInCurrentLevel = (xp || 0) % XP_PER_LEVEL;
  const progress = (xpInCurrentLevel / XP_PER_LEVEL) * 100;
  
  return { 
    level, 
    progress, 
    xpInCurrentLevel, 
    nextLevelAt: XP_PER_LEVEL 
  };
};

/**
 * Calcula o progresso do usuário em uma rota específica
 */
export const getRouteProgress = async (userId: string, routeStops: string[]) => {
  if (!routeStops || routeStops.length === 0) return 0;

  // Busca todos os check-ins do usuário
  const q = query(collection(db, 'checkins'), where('userId', '==', userId));
  const snap = await getDocs(q);
  
  // Extrai os IDs dos locais onde o usuário já esteve
  const locaisVisitados = snap.docs.map(doc => doc.data().stopId);

  // Conta quantos locais da rota estão na lista de visitados
  const concluidos = routeStops.filter(stopId => locaisVisitados.includes(stopId));

  return concluidos.length;
};

