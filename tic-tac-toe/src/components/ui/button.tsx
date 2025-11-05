import * as React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type Size = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'

const variantClasses: Record<Variant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-white hover:bg-destructive/90',
  outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
}

const sizeClasses: Record<Size, string> = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 rounded-md px-3',
  lg: 'h-10 rounded-md px-6',
  icon: 'size-9',
  'icon-sm': 'size-8',
  'icon-lg': 'size-10',
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}) {
  return (
    <button
      data-slot="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  )
}
