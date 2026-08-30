import { z } from 'zod'
import { isValidCNPJ } from '@/lib/cnpj'

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

export const companySignUpSchema = z
  .object({
    companyName: z.string().trim().min(2, 'Informe o nome da marca.'),
    cnpj: z.string().trim(),
    site: z.string().trim().optional().or(z.literal('')),
    legalName: z.string().trim().min(2, 'Informe a razão social.'),
    contactName: z.string().trim().min(2, 'Informe o responsável.'),
    email: z.string().trim().email('Digite um e-mail válido.'),
    password: z
      .string()
      .regex(
        passwordRules,
        'Mínimo 8 caracteres, com maiúscula, minúscula e número.',
      ),
    confirmPassword: z.string().min(1, 'Confirme a senha.'),
  })
  .refine((data) => isValidCNPJ(data.cnpj), {
    path: ['cnpj'],
    message: 'CNPJ inválido.',
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não são iguais.',
  })

export type CompanySignUpFormValues = z.infer<typeof companySignUpSchema>
