import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'
import { Input } from '@/design-system/components/ui/input'
import { Label } from '@/design-system/components/ui/label'

type FormFieldProps = Omit<ComponentProps<typeof Input>, 'id' | 'className'> & {
  id: string
  label: string
  error?: string
  className?: string
  inputClassName?: string
}

export function FormField({
  id,
  label,
  error,
  className,
  inputClassName,
  ...inputProps
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-1 flex-col gap-1', className)}>
      <Label htmlFor={id} className="text-label font-semibold text-foreground">
        {label}
      </Label>
      <Input
        id={id}
        aria-invalid={!!error}
        className={cn('h-auto bg-muted px-3 py-3', inputClassName)}
        {...inputProps}
      />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}
