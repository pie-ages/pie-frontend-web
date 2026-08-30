import { cn } from '@/lib/utils'

type StatItemProps = {
  value: string
  label: string
  className?: string
}

export function StatItem({ value, label, className }: StatItemProps) {
  return (
    <div className={cn('flex flex-1 flex-col', className)}>
      <p className="text-stat font-extrabold text-primary-foreground">
        {value}
      </p>
      <p className="text-caption font-normal text-brand-secondary uppercase">
        {label}
      </p>
    </div>
  )
}
