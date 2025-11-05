import * as React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'secondary' | 'destructive' | 'outline'

const variantClasses: Record<Variant, string> = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  destructive: 'border-transparent bg-destructive text-white',
  outline: 'text-foreground',
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      data-slot="badge"
      className={cn(
        'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-colors',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
