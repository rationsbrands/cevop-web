'use client'
import { useEffect, useState } from 'react'
import { IconSun, IconMoon } from '@/components/icons'
import { getInitialTheme, applyTheme, type Theme } from '@/lib/theme'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const initial = getInitialTheme()
    setTheme(initial)
    
    // Listen for system theme changes if in system mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (getInitialTheme() === 'system') {
        applyTheme('system')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  function toggle() {
    let next: Theme
    if (theme === 'system') next = 'light'
    else if (theme === 'light') next = 'dark'
    else next = 'system'
    
    setTheme(next)
    applyTheme(next)
  }

  if (!mounted) return <div className="w-8 h-8" />

  const getIcon = () => {
    if (theme === 'system') return <span className="text-[10px] font-bold">OS</span>
    if (theme === 'dark') return <IconSun size={15} />
    return <IconMoon size={15} />
  }

  return (
    <button
      onClick={toggle}
      className="w-8 h-8 flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors duration-150 border border-[var(--color-border)] rounded uppercase"
      title={`Current: ${theme}. Click to cycle (System -> Light -> Dark)`}
      aria-label="Toggle theme"
    >
      {getIcon()}
    </button>
  )
}
