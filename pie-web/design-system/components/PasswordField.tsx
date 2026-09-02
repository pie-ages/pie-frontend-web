'use client'

import { useState, type ComponentProps, type CSSProperties } from 'react'

import { Input } from '@/design-system/components/ui/input'
import { Label } from '@/design-system/components/ui/label'

type PasswordFieldProps = Omit<ComponentProps<typeof Input>, 'id' | 'type'> & {
  id: string
  label: string
  error?: string
  style?: CSSProperties
}

export function PasswordField({
  id,
  label,
  error,
  style,
  ...inputProps
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div style={{ display: 'flex', flex: '1 1 0%', flexDirection: 'column', gap: '0.25rem', ...style }}>
      <Label htmlFor={id}>{label}</Label>
      <div style={{ position: 'relative' }}>
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          aria-invalid={!!error}
          style={{ height: 'auto', backgroundColor: 'var(--muted)', padding: '0.75rem', paddingRight: '5rem' }}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          style={{
            position: 'absolute',
            top: '50%',
            right: '0.75rem',
            transform: 'translateY(-50%)',
            fontSize: '0.75rem',
            color: 'var(--muted-foreground)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
      {error && (
        <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--destructive)', margin: 0 }}>
          {error}
        </p>
      )}
    </div>
  )
}
