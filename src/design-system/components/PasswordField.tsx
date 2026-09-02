'use client'

import { useState, type ComponentProps, type CSSProperties } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

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
          style={{ height: 'auto', backgroundColor: 'var(--muted)', padding: '0.75rem', paddingRight: '3rem' }}
          {...inputProps}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? `Ocultar ${label.toLowerCase()}` : `Mostrar ${label.toLowerCase()}`}
          style={{
            position: 'absolute',
            top: '50%',
            right: '0.25rem',
            transform: 'translateY(-50%)',
            color: 'var(--primary)',
          }}
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
      {error && (
        <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--destructive)', margin: 0 }}>
          {error}
        </p>
      )}
    </div>
  )
}
