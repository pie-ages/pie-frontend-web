import { CompanySignUpForm } from '@/design-system/components/CompanySignUpForm/CompanySignUpForm'
import { CompanySignUpSidebar } from '@/design-system/components/CompanySignUpSidebar/CompanySignUpSidebar'

export default function CompanySignUp() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <CompanySignUpSidebar />
      <CompanySignUpForm />
    </div>
  )
}
