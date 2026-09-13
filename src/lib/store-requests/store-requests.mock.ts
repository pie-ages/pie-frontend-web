import type { StoreRequest } from '@/types/store-requests';

function hoursAgo(n: number): string {
  return new Date(Date.now() - n * 60 * 60 * 1000).toISOString();
}

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

export const MOCK_STORE_REQUESTS: StoreRequest[] = [
  {
    id: '1',
    storeName: 'Ateliê Nove',
    submittedAt: hoursAgo(2),
    razaoSocial: 'Nove Confecções Ltda',
    cnpj: '12.345.678/0001-90',
    website: 'atelienove.exemplo.com.br',
    responsavelName: 'Marina Bezerra',
    responsavelEmail: 'marina@email.exemplo.com.br',
    status: 'AGUARDANDO',
  },
  {
    id: '2',
    storeName: 'Casa Vermelha',
    submittedAt: daysAgo(1),
    razaoSocial: 'Casa Vermelha Comércio de Roupas ME',
    cnpj: '08.221.984/0001-45',
    website: 'casavermelha_pie',
    responsavelName: 'Rafael Lima',
    responsavelEmail: 'rafael@email.exemplo.com.br',
    status: 'AGUARDANDO',
  },
  {
    id: '3',
    storeName: 'Studio Ré',
    submittedAt: daysAgo(1),
    razaoSocial: 'Ré Studio Moda ME',
    cnpj: '31.887.556/0001-12',
    website: 'studiore_pie',
    responsavelName: 'Helena Duarte',
    responsavelEmail: 'contato@email.exemplo.com.br',
    status: 'AGUARDANDO',
  },
  {
    id: '4',
    storeName: 'Lótus Alfaiataria',
    submittedAt: daysAgo(3),
    razaoSocial: 'Lotus Confecções Ltda',
    cnpj: '45.982.113/0001-77',
    website: 'lotus.exemplo.com.br',
    responsavelName: 'Camila Prado',
    responsavelEmail: 'camila@email.exemplo.com.br',
    status: 'AGUARDANDO',
  },
  {
    id: '5',
    storeName: 'Mar Aberto',
    submittedAt: daysAgo(4),
    razaoSocial: 'Mar Aberto Beachwear Ltda',
    cnpj: '19.774.302/0001-08',
    website: 'maraberto_pie',
    responsavelName: 'Bruno Sales',
    responsavelEmail: 'bruno@email.exemplo.com.br',
    status: 'AGUARDANDO',
  },
  {
    id: '6',
    storeName: 'Preto no Branco',
    submittedAt: daysAgo(5),
    razaoSocial: 'PNB Vestuário Ltda',
    cnpj: '27.550.881/0001-63',
    website: 'pretonobranco_pie',
    responsavelName: 'Julia Antunes',
    responsavelEmail: 'julia@email.exemplo.com.br',
    status: 'AGUARDANDO',
  },
];
