import React, { createContext, useState, useEffect } from 'react';

export const PlatformContext = createContext();

export const PlatformProvider = ({ children }) => {
    const [platformSettings, setPlatformSettings] = useState({
        theme: 'light',
        colors: {
            primary: '#0f6ead',
            secondary: '#2b6cb0'
        },
        notifications: {
            position: 'top-right',
            enabled: true
        },
        validation: {
            requireEmail: true,
            emailDomain: '@cy-tech.fr'
        }
    });

    // Sauvegarder dans localStorage
    useEffect(() => {
        localStorage.setItem('platformSettings', JSON.stringify(platformSettings));
        applySettings();
    }, [platformSettings]);

    // Appliquer les paramètres
    const applySettings = () => {
        // Appliquer le thème
        document.documentElement.setAttribute('data-theme', platformSettings.theme);
        
        // Appliquer les couleurs
        document.documentElement.style.setProperty('--primary-color', platformSettings.colors.primary);
        document.documentElement.style.setProperty('--secondary-color', platformSettings.colors.secondary);
        
        // Appliquer la position des notifications
        document.documentElement.style.setProperty('--toast-position', platformSettings.notifications.position);
    };

    // Charger depuis localStorage au démarrage
    useEffect(() => {
        const saved = localStorage.getItem('platformSettings');
        if (saved) {
            setPlatformSettings(JSON.parse(saved));
        }
    }, []);

    return (
        <PlatformContext.Provider value={{ platformSettings, setPlatformSettings }}>
            {children}
        </PlatformContext.Provider>
    );
};