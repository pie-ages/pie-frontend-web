import { CompanySignUpForm } from '../../design-system/components/CompanySignUpForm/CompanySignUpForm'
import { CompanySignUpSidebar } from '../../design-system/components/CompanySignUpSidebar/CompanySignUpSidebar'
import styles from './page.module.css'

export default function CompanySignUp() {
  return (
    <div className={styles.wrapper}>
      <CompanySignUpSidebar />
      <CompanySignUpForm />
    </div>
  )
}
