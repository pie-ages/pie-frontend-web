import type { ComponentProps, CSSProperties } from 'react'

import { Input } from './ui/input'
import { Label } from './ui/label'

type FormFieldProps = Omit<ComponentProps<typeof Input>, 'id'> & {
  id: string
  label: string
  error?: string
  style?: CSSProperties
  inputStyle?: CSSProperties
}

export function FormField({
  id,
  label,
  error,
  style,
  inputStyle,
  ...inputProps
}: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flex: '1 1 0%', flexDirection: 'column', gap: '0.25rem', ...style }}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={!!error}
        style={{ height: 'auto', backgroundColor: 'var(--muted)', padding: '0.75rem', ...inputStyle }}
        {...inputProps}
      />
      {error && (
        <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--destructive)', margin: 0 }}>
          {error}
        </p>
      )}
    </div>
  )
}
