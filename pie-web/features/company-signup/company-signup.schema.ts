import { z } from "zod";

export const companySignupSchema = z
  .object({
    nomeEmpresa: z.string().trim().min(2, "Informe o nome da marca."),
    cnpj: z.string().trim(),
    site: z.string().trim().optional().or(z.literal("")),
    razaoSocial: z.string().trim().min(2, "Informe a razão social."),
    responsavel: z.string().trim().min(2, "Informe o responsável."),
    email: z.string().trim().email("Digite um e-mail válido."),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    confirmarSenha: z.string().min(6, "Confirme a senha."),
  })
  .refine((data) => data.cnpj.replace(/\D/g, "").length === 14, {
    path: ["cnpj"],
    message: "CNPJ inválido. Ele deve ter 14 números.",
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    path: ["confirmarSenha"],
    message: "As senhas não são iguais.",
  });

export type CompanySignupFormValues = z.infer<typeof companySignupSchema>;
