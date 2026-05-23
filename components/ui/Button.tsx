'use client'
import React from 'react'
import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: Variant
  size?: Size
  children: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[var(--color-accent)] text-white font-bold hover:opacity-[0.9] border border-transparent shadow-[0_0_20px_rgba(0,179,166,0.2)] font-display',
  secondary: 'bg-transparent text-[var(--color-text)] font-bold border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] font-display',
  ghost: 'bg-transparent text-[var(--color-muted)] font-semibold border border-transparent hover:text-[var(--color-text)]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  href,
  className = '',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const base = `inline-flex items-center justify-center gap-2 rounded transition-all duration-150 cursor-pointer select-none ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  )
}
