'use client'

import { useState, type ComponentProps } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/design-system/components/ui/button'
import { Input } from '@/design-system/components/ui/input'
import { Label } from '@/design-system/components/ui/label'

type PasswordFieldProps = Omit<
  ComponentProps<typeof Input>,
  'id' | 'className' | 'type'
> & {
  id: string
  label: string
  error?: string
  className?: string
}

export function PasswordField({
  id,
  label,
  error,
  className,
  ...inputProps
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className={cn('flex flex-1 flex-col gap-1', className)}>
      <Label htmlFor={id} className="text-label font-semibold text-foreground">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          aria-invalid={!!error}
          className="h-auto bg-muted px-3 py-3 pr-12"
          {...inputProps}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={
            visible
              ? `Ocultar ${label.toLowerCase()}`
              : `Mostrar ${label.toLowerCase()}`
          }
          className="absolute top-1/2 right-1 -translate-y-1/2 text-primary hover:bg-transparent"
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}
