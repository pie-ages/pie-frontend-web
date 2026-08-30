import type { CompanySignupFormValues } from "./company-signup.schema";

export async function submitCompanySignup(_: CompanySignupFormValues): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
}
