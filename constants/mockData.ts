// src/constants/mockData.ts

export interface Stop {
  id: string;
  order: number;
  type: string;
  name: string;
  description: string;
  timeRange: string;
  priceLevel: '$' | '$$' | '$$$';
}

export interface Route {
  id: string;
  title: string;
  description: string;
  author: string;
  duration: string;
  stopsCount: number;
  tags: string[];
  imageUrl: string;
  stops: Stop[];
}

export const ROUTES_MOCK: Route[] = [
  {
    id: "1",
    title: "Manhã Italiana na Mooca",
    description: "Do café da manhã clássico ao samba raiz, uma imersão no bairro mais italiano de SP.",
    author: "Camila R.",
    duration: "4h",
    stopsCount: 4,
    tags: ["CAFÉ", "CULTURA", "SAMBA", "GASTRONOMIA"],
    imageUrl: "/images/mooca.jpg", // Certifique-se de ter as imagens na pasta public
    stops: [
      {
        id: "s1",
        order: 1,
        type: "CAFÉ",
        name: "Padaria Martinelli",
        description: "Comece com um espresso e o famoso cannoli da casa. Dica: chegue cedo para pegar as mesas da calçada.",
        timeRange: "8h - 10h",
        priceLevel: "$$"
      },
      {
        id: "s2",
        order: 2,
        type: "CULTURA",
        name: "Ateliê da Ana Luíza",
        description: "Visite o estúdio de cerâmica local. A entrada é franca e você pode ver a artista trabalhando ao vivo.",
        timeRange: "10h - 12h",
        priceLevel: "$"
      },
      {
        id: "s3",
        order: 3,
        type: "ALMOÇO",
        name: "Cantina do Maroco",
        description: "Almoço farto e tradicional. Peça o filé à parmegiana, serve muito bem duas pessoas.",
        timeRange: "12h - 14h",
        priceLevel: "$$$"
      }
    ]
  },
  {
    id: "2",
    title: "Grafites da Vila Madalena",
    description: "Um tour a pé pelos becos mais coloridos da cidade, finalizando com um chopp artesanal.",
    author: "Marcos T.",
    duration: "2h",
    stopsCount: 6,
    tags: ["ARTE", "FOTOGRAFIA", "CAMINHADA"],
    imageUrl: "/images/vila.jpg",
    stops: []
  },
  {
    id: "3",
    title: "Tour das Padarias Antigas",
    description: "Conheça as padarias mais tradicionais da região central com degustação de doces portugueses.",
    author: "Juliana F.",
    duration: "3h",
    stopsCount: 5,
    tags: ["GASTRONOMIA", "CAFÉ"],
    imageUrl: "/images/padarias.jpg",
    stops: []
  }
];