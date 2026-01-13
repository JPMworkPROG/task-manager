import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  id?: string
  label: string
  required?: boolean
  className?: string
  children: ReactNode
}

export function FormField({ id, label, required, className, children }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && ' *'}
      </label>
      {children}
    </div>
  )
}

interface FormGridProps {
  cols?: 1 | 2
  className?: string
  children: ReactNode
}

export function FormGrid({ cols = 2, className, children }: FormGridProps) {
  return (
    <div className={cn(cols === 2 ? 'grid grid-cols-2 gap-4' : 'space-y-4', className)}>
      {children}
    </div>
  )
}
