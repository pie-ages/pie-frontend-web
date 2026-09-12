import type { Taxonomy } from '@/types/taxonomy';

export const MOCK_TAXONOMY: Taxonomy = {
  categories: [
    { id: 'vestido', name: 'Vestido' },
    { id: 'blazer', name: 'Blazer' },
    { id: 'camisa', name: 'Camisa' },
    { id: 'calca', name: 'Calça' },
    { id: 'casaco', name: 'Casaco' },
    { id: 'sapato', name: 'Sapato' },
    { id: 'camiseta', name: 'Camiseta' },
  ],
  colors: [
    { id: 'verde', name: 'Verde' },
    { id: 'off-white', name: 'Off-white' },
    { id: 'azul', name: 'Azul' },
    { id: 'cinza', name: 'Cinza' },
    { id: 'terracota', name: 'Terracota' },
    { id: 'preto', name: 'Preto' },
  ],
  materials: [
    { id: 'algodao', name: 'Algodão' },
    { id: 'linho', name: 'Linho' },
    { id: 'alfaiataria', name: 'Alfaiataria' },
    { id: 'couro-sintetico', name: 'Couro sintético' },
    { id: 'malha', name: 'Malha' },
    { id: 'seda', name: 'Seda' },
  ],
  styles: [
    { id: 'romantico', name: 'Romântico' },
    { id: 'classico', name: 'Clássico' },
    { id: 'casual', name: 'Casual' },
    { id: 'criativo', name: 'Criativo' },
    { id: 'dramatico', name: 'Dramático' },
    { id: 'refinado', name: 'Refinado' },
  ],
};
