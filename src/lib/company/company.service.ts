import Api from '@/lib/api';

interface ApiCompany {
  id: string;
  name: string;
  email: string;
}

let cache: ApiCompany | null = null;

export async function getCompany(): Promise<ApiCompany> {
  if (cache) return cache;
  const companyId = process.env.NEXT_PUBLIC_COMPANY_ID;
  const { data } = await Api.get<ApiCompany>(`/companies/${companyId}`);
  cache = data;
  return cache;
}
