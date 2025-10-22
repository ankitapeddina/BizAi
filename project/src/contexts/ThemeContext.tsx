import { createContext, useContext, useEffect, useLayoutEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_VARS: Record<Theme, Record<string, string>> = {
  light: {
    '--bg': '#f8fafc',
    '--surface': '#ffffff',
    '--text': '#0f172a',
    '--muted': '#6b7280',
    '--primary': '#2563eb',
    '--card-shadow': 'rgba(2,6,23,0.06)',
  },
  dark: {
    '--bg': '#0b1220',
    '--surface': '#0f1724',
    '--text': '#e6eef8',
    '--muted': '#94a3b8',
    '--primary': '#60a5fa',
    '--card-shadow': 'rgba(2,6,23,0.5)',
  },
};

function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.setAttribute('data-theme', theme);
  const vars = THEME_VARS[theme];
  Object.keys(vars).forEach((k) => root.style.setProperty(k, vars[k]));
  const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (meta) meta.content = vars['--surface'];
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'; // server: prefer dark

    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved as Theme;

    // FORCE dark as default for whole website when nothing saved
    return 'dark';
  });

  useLayoutEffect(() => {
    try {
      applyThemeToDocument(theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* ignore */
    }
    try {
      applyThemeToDocument(theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        setTheme(e.newValue as Theme);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
