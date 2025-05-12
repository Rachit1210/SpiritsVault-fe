import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define theme colors
export const darkTheme = {
  primary: '#2a061e',
  secondary: '#0a0006',
  card: '#1a0414',
  text: '#fff',
  textSecondary: '#ccc',
  border: '#3f2c37',
  input: '#331c29',
  accent: '#64d2ff',
  heart: '#ff4d6d',
  stars: '#FFD700',
};

export const lightTheme = {
  primary: '#f5f0e8',
  secondary: '#e8dfd0',
  card: '#ffffff',
  text: '#333333',
  textSecondary: '#666666',
  border: '#d1c8b9',
  input: '#f8f5f0',
  accent: '#0092cc',
  heart: '#e91e63',
  stars: '#f4b400',
};

type ThemeType = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof darkTheme | typeof lightTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('dark');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const colors = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 