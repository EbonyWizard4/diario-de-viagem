export interface Stop {
  id: string;
  type: 'cafe' | 'cultura' | 'almoco' | 'lazer';
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
  stops?: Stop[]; // Opcional para a lista geral
}