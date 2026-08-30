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

export function CompanySignUpForm() {
  const router = useRouter()
  const [form, setForm] = useState(initialValues)
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof initialValues, string>>
  >({})
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
      <div className="flex flex-1 bg-background px-12 pt-[120px] pb-12 md:pl-[184px]">
        <div className="flex w-full max-w-[420px] flex-col gap-1">
          <h2 className="text-h2 font-extrabold text-foreground">
            Pedido enviado com sucesso!
          </h2>
          <p className="text-sm text-foreground/55">
            Você será redirecionado para o login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 bg-background px-12 pt-[120px] pb-12 md:pl-[184px]">
      <div className="flex w-full max-w-[420px] flex-col gap-7 border-t-2 border-brand-secondary pt-9">
        <div className="flex flex-col gap-1">
          <h2 className="text-h2 font-extrabold text-foreground">
            Pedir entrada na plataforma
          </h2>
          <p className="text-sm leading-[21.7px] text-foreground/55">
            A equipe do Piê revisa cada loja antes de liberar o painel. A
            resposta chega por e-mail em até 2 dias úteis.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <FormField
            id="companyName"
            label="Nome da marca"
            placeholder="Ateliê Nove"
            value={form.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            error={errors.companyName}
          />

          <div className="flex gap-4">
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

          <div className="flex gap-4">
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

          <div className="flex gap-4">
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

          {submitError && (
            <p className="text-sm font-semibold text-destructive">
              {submitError}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-auto w-full px-4 py-3 font-extrabold"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar pedido para análise'}
          </Button>
        </form>
      </div>
    </div>
  )
}
