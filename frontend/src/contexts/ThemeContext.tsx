import React, { createContext, useEffect, useState } from 'react';

export type Theme = 'happy' | 'sad' | 'angry' | 'disgust' | 'fear' | 'surprise' | 'neutral';

type ThemeContextShape = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextShape>({
  theme: 'neutral',
  setTheme: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeRaw] = useState<Theme>(() => {
    try {
      const v = localStorage.getItem('mood_theme');
      return (v as Theme) || 'neutral';
    } catch {
      return 'neutral';
    }
  });

  const setTheme = (t: Theme) => {
    setThemeRaw(t);
    try { localStorage.setItem('mood_theme', t); } catch {}
  };

  useEffect(() => {
    // keep body class in sync
    document.body.dataset.mood = theme;
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
