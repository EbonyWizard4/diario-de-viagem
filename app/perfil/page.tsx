'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext'
import Image from 'next/image';
import { Settings, MapPin, Award, Heart, LogOut, ChevronRight, DollarSign, Map } from 'lucide-react';
import { ROUTES_MOCK } from '@/constants/mockData';
import Link from 'next/link';
// Exemplo de função de Login para usar no componente
import { signInWithPopup } from "firebase/auth";
import { db, auth, googleProvider } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, doc, getDocs, } from 'firebase/firestore';
import VisitCard from '@/components/VisitCard';
import RouteCard from '@/components/RouteCard';
import { getLevelInfo } from '@/services/gamificationService';
import ModalConquistas from '@/components/modals/ModalConquistas';

export default function PerfilPage() {

  // 1. Pegamos o 'loading' do AuthContext
  const { user, loginComGoogle, logout, loading: authLoading } = useAuth();

  // 2. Criamos o estado das visitas com o nome correto
  const [loadingVisitas, setLoadingVisitas] = useState(true);
  const [visitas, setVisitas] = useState<any[]>([]);
  const [exibirTodos, setExibirTodos] = useState(false); // Estado para o botão "Mostrar Mais"

  const [activeTab, setActiveTab] = useState<'visitas' | 'rotas'>('visitas'); // Estado para controlar a aba ativa
  const [rotas, setRotas] = useState<any[]>([]); // Estado para as rotas do usuário

  // No topo da sua PerfilPage, adicione o estado para os favoritos
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loadingFavoritos, setLoadingFavoritos] = useState(true);

  // 1. Crie o estado (lá no topo com os outros states)
  const [exibirTodosFavoritos, setExibirTodosFavoritos] = useState(false);

  // 1. Adicione o estado do modal
  const [modalConquistasAberto, setModalConquistasAberto] = useState(false);

  // 2. Mock das conquistas possíveis (isso depois pode ir para um arquivo de constantes)
  const CONQUISTAS_POSSIVEIS = [
    { id: 'gastronomia', emoji: '🍕', titulo: 'Glutão Profissional', desc: 'Faça 5 check-ins em restaurantes.', meta: 5 },
    { id: 'artes', emoji: '🎨', titulo: 'Crítico de Arte', desc: 'Visite 3 museus ou galerias.', meta: 3 },
    { id: 'passeios', emoji: '🚲', titulo: 'Explorador Urbano', desc: 'Complete 3 roteiros de parques.', meta: 3 },
    { id: 'role', emoji: '🏙️', titulo: 'Inimigo do Fim', desc: 'Faça um check-in após as 22h.', meta: 1 },
  ];

  // 2. Crie uma variável para filtrar o que será exibido
  const favoritosExibidos = exibirTodosFavoritos
    ? favoritos
    : favoritos.slice(0, 3); // Pega apenas os 3 primeiros (mais recentes)

  // ... dentro do componente PerfilPage
  const [dadosUsuario, setDadosUsuario] = useState<any>(null);


  // Lógica para as 3 melhores e mais recentes
  // Primeiro, ordenamos por nota (descendente) e depois por data (que já vem do Firebase)

  const visitasExibidas = exibirTodos
    ? visitas
    : [...visitas]
      .sort((a, b) => b.rating - a.rating) // Prioriza nota maior
      .slice(0, 3); // Pega apenas as 3 primeiras

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) setDadosUsuario(doc.data());
    });
    return () => unsub();
  }, [user]);

  // useEffect para buscar os favoritos do usuário
  useEffect(() => {
    if (authLoading || !user) return;

    setLoadingFavoritos(true);

    // Buscamos na subcoleção 'favorites' do usuário logado
    const q = query(
      collection(db, 'users', user.uid, 'favorites'),
      orderBy('addedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const favoriteIds = snapshot.docs.map(doc => doc.id);

      if (favoriteIds.length === 0) {
        setFavoritos([]);
        setLoadingFavoritos(false);
        return;
      }

      // Agora buscamos os dados completos desses roteiros na coleção 'routes'
      // O Firestore tem um limite de 10 IDs por query 'in', o que costuma bastar para favoritos recentes
      const routesQuery = query(
        collection(db, 'routes'),
        where('__name__', 'in', favoriteIds.slice(0, 10))
      );

      const routesSnap = await getDocs(routesQuery);
      const routesData = routesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setFavoritos(routesData);
      setLoadingFavoritos(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  useEffect(() => {
    if (!user?.uid) return;

    // Escuta o XP em tempo real
    const unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) setDadosUsuario(doc.data());
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    // Se o Auth ainda está carregando ou se não tem usuário, não faz nada
    // Usamos 'authLoading' para não confundir com o outro loading
    if (authLoading || !user) return;

    setLoadingVisitas(true);

    const q = query(
      collection(db, 'checkins'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVisitas(docs);
        setLoadingVisitas(false);
      },
      (error) => {
        console.error("Erro na busca:", error);
        setLoadingVisitas(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]); // Dependências atualizadas

  // Busca as rotas do usuário para mostrar na aba "Meus Roteiros"
  useEffect(() => {
    if (authLoading || !user) return;

    const q = query(collection(db, 'routes'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRotas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user, authLoading]);
  
  // Calculamos o nível com base no XP real do banco
  const { level } = getLevelInfo(dadosUsuario?.xp || 0);
  
  // 1. Enquanto o Firebase descobre se você está logado ou não
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-500 font-bold animate-pulse">Sincronizando seu perfil...</p>
      </div>
    );
  }

  // 2. Se o loading acabou e realmente não tem ninguém logado
  if (!user) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-center">
        <h2 className="text-2xl font-black mb-4">Bem-vindo ao Guia Local</h2>
        <p className="text-gray-500 mb-8 text-sm">Faça login para salvar seus roteiros e ganhar medalhas!</p>
        <button
          onClick={loginComGoogle}
          className="flex items-center gap-3 bg-white border border-gray-200 px-6 py-3 rounded-2xl shadow-sm font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
        >
          <Image src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} priority />
          Entrar com Google
        </button>
      </main>
    );
  }



  // 3. Se chegou aqui, temos usuário e podemos renderizar a página principal
  return (
    <main className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header do Perfil (Layout Original Mantido) */}
      <header className="bg-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div className="relative">
            <div className="relative w-24 h-24 rounded-3xl bg-orange-100 overflow-hidden border-4 border-white shadow-md">
              {user.photoURL ? (
                <Image src={user.photoURL} alt={user.displayName || ""} fill className="object-cover" />
              ) : (
                <div className="w-full h-full rounded-3xl bg-orange-100 flex items-center justify-center text-3xl">👤</div>
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 bg-orange-600 text-white p-2 rounded-xl shadow-lg border-2 border-white">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* VALORES DINÂMICOS AQUI */}
          <div className="flex flex-col items-end">
            <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Nível {level}
            </span>
            <p className="text-xs text-gray-400 mt-1 font-bold">
              {dadosUsuario?.xp || 0} XP
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-black text-gray-900">{user.displayName}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3" /> São Paulo, SP
        </p>
        <button
          onClick={logout}
          className="mt-6 flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 px-4 py-2 rounded-xl"
        >
          <LogOut className="w-4 h-4" /> Sair da conta
        </button>
      </header>

      {/* Grid de Stats Rápidos (Valores Dinâmicos) */}
      <section className="grid grid-cols-2 gap-4 px-6 -mt-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Meus Roteiros</p>
          <p className="text-xl font-black text-gray-900">{rotas.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Visitas</p>
          <p className="text-xl font-black text-gray-900">{visitas.length}</p>
        </div>
      </section>

      {/* Seção de Conquistas Atualizada */}
      <section className="px-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Award className="text-orange-600 w-5 h-5" /> Conquistas
          </h3>
          {/* Botão que abre o modal */}
          <button
            onClick={() => setModalConquistasAberto(true)}
            className="text-xs font-black text-orange-600 uppercase tracking-widest"
          >
            Ver todas
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {CONQUISTAS_POSSIVEIS.map((conquista) => {
            // Verifica se o ID da conquista está no array 'badges' do usuário no Firebase
            const conquistada = dadosUsuario?.badges?.includes(conquista.id);

            return (
              <div
                key={conquista.id}
                className={`min-w-[75px] aspect-square rounded-2xl flex items-center justify-center text-3xl shadow-sm border transition-all ${conquistada ? 'bg-white border-orange-100' : 'bg-gray-100 border-transparent grayscale opacity-40'
                  }`}
              >
                {conquista.emoji}
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal (fora do fluxo principal) */}
      <ModalConquistas
        isOpen={modalConquistasAberto}
        onClose={() => setModalConquistasAberto(false)}
        conquistasUsuario={dadosUsuario?.badges || []}
      />
      {/* Roteiros Favoritos */}
      <section className="px-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Heart className="text-red-500 w-5 h-5 fill-red-500" /> Meus Favoritos
          </h3>

          {/* O botão Ver Todos só aparece se houver mais de 3 favoritos */}
          {favoritos.length > 3 && (
            <button
              onClick={() => setExibirTodosFavoritos(!exibirTodosFavoritos)}
              className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline"
            >
              {exibirTodosFavoritos ? 'Ver menos' : 'Ver todos'}
            </button>
          )}
        </div>

        <div className="space-y-4">
          {loadingFavoritos ? (
            <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          ) : favoritos.length > 0 ? (
            <>
              {/* Renderizamos apenas os favoritos filtrados (3 ou todos) */}
              {favoritosExibidos.map((rota) => (<Link
                href={`/roteiro/${rota.id}`}
                key={rota.id}
                className="flex bg-white p-3 rounded-2xl border border-gray-100 shadow-sm gap-4 active:scale-[0.98] transition-transform"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {rota.thumbnail ? (
                    <Image src={rota.thumbnail} alt={rota.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-200">
                      <Map size={24} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                  <h4 className="font-bold text-gray-900 text-sm truncate uppercase italic">
                    {rota.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Por {rota.authorName || 'Explorador'}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[8px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                      {rota.category || 'Aventura'}
                    </span>
                    <span className="text-[8px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded uppercase">
                      {rota.stops?.length || 0} paradas
                    </span>
                  </div>
                </div>
                <div className="flex items-center ml-auto">
                  <ChevronRight className="w-4 h-4 text-gray-200" />
                </div>
              </Link>
              ))}
            </ >
          ) : (
            <div className="bg-dashed border-2 border-dashed border-gray-100 rounded-2xl p-8 text-center">
              <p className="text-xs text-gray-400 font-bold uppercase italic">
                Nenhum roteiro favoritado ainda. <br /> Comece a explorar!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Card de Visitas Recentes */}
      <section className="mt-8">
        {/* Header com Abas */}
        <div className="flex items-center gap-6 mb-6 border-b border-gray-100 px-8">
          <button
            onClick={() => setActiveTab('visitas')}
            className={`pb-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'visitas' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400'
              }`}
          >
            Experiências
          </button>
          <button
            onClick={() => setActiveTab('rotas')}
            className={`pb-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'rotas' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400'
              }`}
          >
            Meus Roteiros
          </button>
        </div>

        <div className="px-2 space-y-4">
          {/* --- CONTEÚDO: VISITAS --- */}
          {activeTab === 'visitas' && (
            <>
              {loadingVisitas ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded-[32px]" />
                  ))}
                </div>
              ) : visitasExibidas.length > 0 ? (
                <>
                  {visitasExibidas.map((visita) => (
                    <VisitCard
                      key={visita.id}
                      placeName={visita.placeName}
                      comment={visita.comment}
                      rating={visita.rating}
                      photoUrl={visita.photoUrl}
                      date={visita.timestamp}
                    />
                  ))}
                  {/* Botão Mostrar Mais */}
                  {visitas.length > 3 && (
                    <button
                      onClick={() => setExibirTodos(!exibirTodos)}
                      className="w-full py-4 mt-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      {exibirTodos ? "Ver menos" : `Mostrar mais (${visitas.length - 3} restantes)`}
                      <ChevronRight className={`w-4 h-4 transition-transform ${exibirTodos ? 'rotate-90' : ''}`} />
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-20 text-gray-400 italic">
                  Nenhuma visita registrada ainda.
                </div>
              )}
            </>
          )}

          {/* --- CONTEÚDO: ROTAS --- */}
          {activeTab === 'rotas' && (
            <div className="px-6"> {/* Garanta que tenha o padding lateral aqui */}
              {rotas.length > 0 ? (
                rotas.map((rota) => (
                  <RouteCard
                    key={rota.id}
                    rota={rota}
                  />
                ))
              ) : (
                <div className="text-center py-20 text-gray-400 italic">
                  Você ainda não criou nenhum roteiro.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Botão de Sair no final */}
      <section className="px-6 mt-12 mb-10">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 font-bold rounded-2xl border border-red-100 active:scale-95 transition-all"
        >
          <LogOut className="w-4 h-4" /> Sair da conta
        </button>
      </section>
    </main>
  );
}