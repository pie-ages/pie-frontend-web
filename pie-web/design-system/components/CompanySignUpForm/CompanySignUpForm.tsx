'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { companySignUpSchema } from '@/schemas/CompanySignUpSchema'
import { submitCompanySignUp } from '@/services/Companies'
import { formatCNPJ } from '@/lib/cnpj'
import { Button } from '@/design-system/components/ui/button'
import { FormField } from '@/design-system/components/FormField'
import { PasswordField } from '@/design-system/components/PasswordField'

const initialValues = {
  companyName: '',
  cnpj: '',
  site: '',
  legalName: '',
  contactName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flex: '1 1 0%',
    backgroundColor: 'var(--background)',
    paddingLeft: 48,
    paddingRight: 48,
    paddingTop: 'clamp(40px, 8vh, 120px)',
    paddingBottom: 'clamp(24px, 4vh, 48px)',
  },
  successBox: {
    display: 'flex',
    width: '100%',
    maxWidth: 420,
    flexDirection: 'column',
    gap: 4,
  },
  formBox: {
    display: 'flex',
    width: '100%',
    maxWidth: 420,
    flexDirection: 'column',
    gap: 'clamp(16px, 2.5vh, 28px)',
    borderTop: '2px solid var(--color-brand-secondary)',
    paddingTop: 'clamp(20px, 3vh, 36px)',
  },
  headerBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: 'var(--foreground)',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: 'color-mix(in oklch, var(--foreground) 55%, transparent)',
    margin: 0,
  },
  subtitleLeading: {
    fontSize: 14,
    lineHeight: '21.7px',
    color: 'color-mix(in oklch, var(--foreground) 55%, transparent)',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(10px, 1.5vh, 16px)',
  },
  row: {
    display: 'flex',
    gap: 16,
  },
  submitError: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--destructive)',
    margin: 0,
  },
  submitButton: {
    marginTop: 8,
    height: 'auto',
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontWeight: 800,
  },
}

export function CompanySignUpForm() {
  const router = useRouter()
  const [form, setForm] = useState(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof typeof initialValues, string>>>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (field: keyof typeof initialValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    if (submitError) setSubmitError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = companySignUpSchema.safeParse(form)

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([field, messages]) => [
            field,
            messages?.[0],
          ]),
        ),
      )
      return
    }

    setErrors({})
    setSubmitError('')
    setIsSubmitting(true)

    try {
      await submitCompanySignUp(form)
      setIsSuccess(true)
      router.push('/')
    } catch {
      setSubmitError('Não foi possível enviar o pedido. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.successBox}>
          <h2 style={styles.title}>Pedido enviado com sucesso!</h2>
          <p style={styles.subtitle}>
            Você será redirecionado para o login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <div style={styles.headerBlock}>
          <h2 style={styles.title}>Pedir entrada na plataforma</h2>
          <p style={styles.subtitleLeading}>
            A equipe do Piê revisa cada loja antes de liberar o painel. A
            resposta chega por e-mail em até 2 dias úteis.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate style={styles.form}>
          <FormField
            id="companyName"
            label="Nome da marca"
            placeholder="Ateliê Nove"
            value={form.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            error={errors.companyName}
          />

          <div style={styles.row}>
            <FormField
              id="cnpj"
              label="CNPJ"
              placeholder="00.000.000/0001-00"
              inputMode="numeric"
              maxLength={18}
              value={form.cnpj}
              onChange={(e) => handleChange('cnpj', formatCNPJ(e.target.value))}
              error={errors.cnpj}
            />
            <FormField
              id="site"
              label="Site ou Instagram"
              placeholder="@atelie.nove"
              value={form.site}
              onChange={(e) => handleChange('site', e.target.value)}
              error={errors.site}
            />
          </div>

          <FormField
            id="legalName"
            label="Razão social"
            placeholder="Nove Confecções Ltda"
            value={form.legalName}
            onChange={(e) => handleChange('legalName', e.target.value)}
            error={errors.legalName}
          />

          <div style={styles.row}>
            <FormField
              id="contactName"
              label="Responsável"
              placeholder="Marina Bezerra"
              value={form.contactName}
              onChange={(e) => handleChange('contactName', e.target.value)}
              error={errors.contactName}
            />
            <FormField
              id="email"
              label="E-mail de contato"
              type="email"
              placeholder="marina@atelienove.com.br"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />
          </div>

          <div style={styles.row}>
            <PasswordField
              id="password"
              label="Senha"
              placeholder="••••••••••••"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
            />
            <PasswordField
              id="confirmPassword"
              label="Confirmar Senha"
              placeholder="••••••••••••"
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
            />
          </div>

          {submitError && <p style={styles.submitError}>{submitError}</p>}

          <Button
            type="submit"
            disabled={isSubmitting}
            style={styles.submitButton}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar pedido para análise'}
          </Button>
        </form>
      </div>
    </div>
  )
}