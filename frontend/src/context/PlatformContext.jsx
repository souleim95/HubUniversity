import React, { createContext, useState, useEffect } from 'react';

export const PlatformContext = createContext();

export const PlatformProvider = ({ children }) => {
  const [platformSettings, setPlatformSettings] = useState(() => {
    const savedSettings = localStorage.getItem('platformSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      theme: 'light',
      colors: {
        secondary: '#1f2937'
      },
      validation: {
        requireEmail: true
      }
    };
  });

  useEffect(() => {
    // Appliquer le thème et les couleurs
    document.documentElement.setAttribute('data-theme', platformSettings.theme);
    
    // Application des couleurs avec conversion en RGB pour la transparence
    const applyColor = (color) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    };

    // Appliquer les couleurs principales
    document.documentElement.style.setProperty('--secondary-color', platformSettings.colors.secondary);
    document.documentElement.style.setProperty('--secondary-rgb', applyColor(platformSettings.colors.secondary));

    // Sauvegarder dans le localStorage
    localStorage.setItem('platformSettings', JSON.stringify(platformSettings));
  }, [platformSettings]);

  const updateColors = (secondary) => {
    setPlatformSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        secondary
      }
    }));
    // Forcer un rafraîchissement des styles
    document.documentElement.style.setProperty('--secondary-color', secondary);
  };

  return (
    <PlatformContext.Provider value={{ 
      platformSettings, 
      setPlatformSettings,
      updateColors
    }}>
      {children}
    </PlatformContext.Provider>
  );
};