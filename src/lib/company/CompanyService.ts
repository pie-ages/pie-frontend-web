import Api from '@/lib/api';

export interface ApiCompany {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  photo_url?: string | null;
}

export interface AdminCompany {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  role: string;
  status: string;
  photo_url?: string | null;
  createdAt: string;
}

export interface UploadCompanyLogoResponse {
  photo_url: string;
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

export async function updateCompany(
  companyId: string,
  data: { name: string; email: string },
): Promise<ApiCompany> {
  const { data: res } = await Api.put<ApiCompany>(`/companies/${companyId}`, data);
  return res;
}

export async function uploadCompanyLogo(
  companyId: string,
  file: File,
): Promise<UploadCompanyLogoResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await Api.post<UploadCompanyLogoResponse>(
    `/companies/${companyId}/logo`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}

export async function removeCompanyLogo(companyId: string): Promise<void> {
  await Api.delete(`/companies/${companyId}/logo`);
}
