import React, { createContext, useContext, useState, useMemo } from 'react';
import { colorPalettes, defaultPalette } from '@helix/component-library';

const ThemeSelectionContext = createContext();

export const ThemeSelectionProvider = ({ children }) => {
  // Read initial configuration from realm or fallback to ADCB
  const initialTheme = sessionStorage.getItem("SEC_REALM") === "ALHILAL" ? "AL-HILAL" : "ADCB";
  
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);

  const colors = useMemo(() => {
    return colorPalettes[selectedTheme] || defaultPalette;
  }, [selectedTheme]);

  const value = useMemo(() => ({
    selectedTheme,
    setSelectedTheme,
    colors,
    availableThemes: Object.keys(colorPalettes)
  }), [selectedTheme, colors]);

  return (
    <ThemeSelectionContext.Provider value={value}>
      {children}
    </ThemeSelectionContext.Provider>
  );
};

export const useColorTheme = () => {
  const context = useContext(ThemeSelectionContext);
  if (context === undefined) {
    throw new Error('useColorTheme must be used within a ThemeSelectionProvider');
  }
  return context;
};