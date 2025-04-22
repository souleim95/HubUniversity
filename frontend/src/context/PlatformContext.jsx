import React, { createContext, useState } from 'react';

// Création du contexte PlatformContext pour stocker les paramètres de la plateforme
export const PlatformContext = createContext();

// Composant Provider qui englobe toute l'application et fournit les paramètres
export const PlatformProvider = ({ children }) => {
    const [platformSettings, setPlatformSettings] = useState({
        theme: 'light', // Thème clair par défaut
        validationRules: {
            requireApproval: true, // Nécessite une validation humaine
            minPasswordLength: 8, // Longueur minimale du mot de passe
            validationMode: 'hybride' // Mode de validation utilisé
        }
    });

    return (
        <PlatformContext.Provider value={{ platformSettings, setPlatformSettings }}>
            {children} {/* Rend les enfants dans le contexte */}
        </PlatformContext.Provider>
    );
};