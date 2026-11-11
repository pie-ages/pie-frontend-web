import { z } from 'zod';

export const createCompanySchema = z.object({
  razaoSocial: z.string().min(3, 'A Razão Social deve ter pelo menos 3 caracteres.'),
  nomeMarca: z.string().min(2, 'O Nome da marca é obrigatório.'),
  cnpj: z.string().length(18, 'O CNPJ deve estar no formato 00.000.000/0001-00'),
  email: z.string().email('Insira um e-mail válido para contato.'),
});

export type CreateCompanyFormData = z.infer<typeof createCompanySchema>;
