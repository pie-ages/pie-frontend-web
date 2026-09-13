export type RequestStatus = 'AGUARDANDO' | 'APROVADA' | 'RECUSADA';

export interface StoreRequest {
  id: string;
  storeName: string;
  submittedAt: string;
  razaoSocial: string;
  cnpj: string;
  website: string | null;
  responsavelName: string;
  responsavelEmail: string;
  status: RequestStatus;
}
