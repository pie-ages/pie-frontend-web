import Api from '@/lib/api';

interface ApiCompany {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface AdminCompany {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export async function getCompany(companyId: string): Promise<ApiCompany> {
  const { data } = await Api.get<ApiCompany>(`/companies/${companyId}`);
  return data;
}

export async function getCompanies(status?: string): Promise<AdminCompany[]> {
  const url = status ? `/companies?status=${status}` : '/companies';
  const { data } = await Api.get<AdminCompany[]>(url);
  return data;
}

export async function updateCompanyStatus(
  companyId: string,
  status: 'ACTIVE' | 'INACTIVE',
): Promise<void> {
  await Api.patch(`/companies/${companyId}/status`, { status });
}
