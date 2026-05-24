export type Theme = 'dark' | 'light' | 'system'

const STORAGE_KEY = 'cevop_site_theme'

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  return stored || 'system'
}

export function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return
  const root = document.documentElement
  
  const resolveTheme = (t: Theme): 'dark' | 'light' => {
    if (t === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return t
  }

  const resolved = resolveTheme(theme)
  
  if (resolved === 'light') {
    root.classList.add('light')
    root.classList.remove('dark')
  } else {
    root.classList.add('dark')
    root.classList.remove('light')
  }
  root.setAttribute('data-theme', resolved)
  
  if (theme === 'system') {
    localStorage.removeItem(STORAGE_KEY)
  } else {
    localStorage.setItem(STORAGE_KEY, theme)
  }
}

export function getThemeScript(): string {
  return `
    (function() {
      try {
        var stored = localStorage.getItem('cevop_site_theme');
        var theme = stored || 'system';
        var resolved = theme;
        if (theme === 'system') {
          resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.classList.add(resolved);
        document.documentElement.setAttribute('data-theme', resolved);
        if (resolved === 'light') document.documentElement.classList.remove('dark');
        else document.documentElement.classList.remove('light');
      } catch(e) {}
    })();
  `
}
