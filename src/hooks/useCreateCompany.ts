import { useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '@/lib/api';
import { CreateCompanyFormData } from '@/app/admin/schema';

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCompanyFormData) => {
      const response = await Api.post('/companies', {
        socialReason: data.razaoSocial,
        name: data.nomeMarca,
        cnpj: data.cnpj.replace(/\D/g, ''),
        email: data.email,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}
