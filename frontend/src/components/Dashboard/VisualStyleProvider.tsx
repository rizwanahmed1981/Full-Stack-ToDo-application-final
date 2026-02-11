import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultTheme } from '../../styles/themes/default';
import { accessibilityTheme } from '../../styles/themes/accessibility';

// Define theme types
export type ThemeType = 'light' | 'dark' | 'auto';

// Define context type
interface VisualStyleContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colorScheme: 'light' | 'dark';
  themeConfig: any;
  updateThemeConfig: (config: any) => void;
}

// Create context
const VisualStyleContext = createContext<VisualStyleContextType | undefined>(undefined);

// Provider props interface
interface VisualStyleProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeType;
}

/**
 * Visual Style Provider component that manages theme and visual styles
 */
export const VisualStyleProvider: React.FC<VisualStyleProviderProps> = ({ 
  children, 
  initialTheme = 'auto' 
}) => {
  const [theme, setThemeState] = useState<ThemeType>(initialTheme);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [themeConfig, setThemeConfig] = useState(defaultTheme);

  // Update color scheme based on theme selection
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      const updateColorScheme = () => {
        if (theme === 'auto') {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setColorScheme(systemPrefersDark ? 'dark' : 'light');
        } else {
          setColorScheme(theme);
        }
      };

      updateColorScheme();

      // Listen for system preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateColorScheme();

      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Update theme config based on theme type
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(prefers-contrast: high)').matches) {
        // Use accessibility theme if high contrast is preferred
        setThemeConfig(accessibilityTheme);
      } else {
        // Use default theme
        setThemeConfig(defaultTheme);
      }
    } else {
      // On the server, use default theme
      setThemeConfig(defaultTheme);
    }
  }, [theme, colorScheme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  const updateThemeConfig = (config: any) => {
    setThemeConfig(prev => ({ ...prev, ...config }));
  };

  return (
    <VisualStyleContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        colorScheme, 
        themeConfig,
        updateThemeConfig
      }}
    >
      <div className={colorScheme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </VisualStyleContext.Provider>
  );
};

/**
 * Custom hook to use the Visual Style context
 */
export const useVisualStyle = (): VisualStyleContextType => {
  const context = useContext(VisualStyleContext);
  if (!context) {
    throw new Error('useVisualStyle must be used within a VisualStyleProvider');
  }
  return context;
};