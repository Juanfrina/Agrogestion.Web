import { createContext, useContext, type ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';

/** Tipo del contexto de tema, pa controlar el modo oscuro */
interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ isDark: false, toggle: () => {} });

/** Proveedor del tema, envuelve la app pa que todos accedan al modo oscuro */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/** Hook pa usar el contexto del tema fácilmente */
// eslint-disable-next-line react-refresh/only-export-components
export const useThemeContext = () => useContext(ThemeContext);
