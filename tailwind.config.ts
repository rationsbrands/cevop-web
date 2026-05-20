import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-rethink)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-stix)', 'serif'],
        mono: ['var(--font-fragment)', 'monospace'],
        display: ['var(--font-rethink)', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        surface2: 'var(--color-surface2)',
        border: 'var(--color-border)',
        accent: 'var(--color-accent)',
        'accent-dim': 'var(--color-accent-dim)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        green: 'var(--color-green)',
        amber: 'var(--color-amber)',
        red: 'var(--color-red)',
        blue: 'var(--color-blue)',
      },
      borderRadius: { DEFAULT: '12px', sm: '8px', md: '12px', lg: '16px', xl: '24px', full: '9999px' },
    },
  },
  plugins: [],
}
export default config
