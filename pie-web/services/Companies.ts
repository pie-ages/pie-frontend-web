import type { CompanySignUpFormValues } from '@/schemas/CompanySignUpSchema'

export async function submitCompanySignUp(
  _: CompanySignUpFormValues,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1500))
}
