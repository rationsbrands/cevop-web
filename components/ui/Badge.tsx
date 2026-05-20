import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'accent' | 'muted' | 'success' | 'warning' | 'danger'
  className?: string
}

const variantClasses = {
  accent: 'bg-[var(--color-accent)] text-black',
  muted: 'bg-[var(--color-surface2)] text-[var(--color-muted)] border border-[var(--color-border)]',
  success: 'bg-[rgba(34,197,94,0.12)] text-[var(--color-green)] border border-[rgba(34,197,94,0.2)]',
  warning: 'bg-[rgba(245,158,11,0.12)] text-[var(--color-amber)] border border-[rgba(245,158,11,0.2)]',
  danger: 'bg-[rgba(239,68,68,0.12)] text-[var(--color-red)] border border-[rgba(239,68,68,0.2)]',
}

export function Badge({ children, variant = 'muted', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase rounded ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}
