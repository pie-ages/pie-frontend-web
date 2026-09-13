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
  styles: [
    { id: 'romantico', name: 'Romântico' },
    { id: 'classico', name: 'Clássico' },
    { id: 'casual', name: 'Casual' },
    { id: 'criativo', name: 'Criativo' },
    { id: 'dramatico', name: 'Dramático' },
    { id: 'refinado', name: 'Refinado' },
  ],
  sizes: [
    { id: 'pp', name: 'PP' },
    { id: 'p', name: 'P' },
    { id: 'm', name: 'M' },
    { id: 'g', name: 'G' },
    { id: 'gg', name: 'GG' },
    { id: 'xgg', name: 'XGG' },
    { id: 'u', name: 'U' },
    { id: '34', name: '34' },
    { id: '36', name: '36' },
    { id: '38', name: '38' },
    { id: '40', name: '40' },
    { id: '42', name: '42' },
    { id: '44', name: '44' },
  ],
};
