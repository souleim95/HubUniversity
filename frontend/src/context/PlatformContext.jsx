import React, { createContext, useState } from 'react';

export const PlatformContext = createContext();

export const PlatformProvider = ({ children }) => {
    const [platformSettings, setPlatformSettings] = useState({
        theme: 'light',
        validationRules: {
            requireApproval: true,
            minPasswordLength: 8,
            validationMode: 'hybride'
        }
    });

    return (
        <PlatformContext.Provider value={{ platformSettings, setPlatformSettings }}>
            {children}
        </PlatformContext.Provider>
    );
}; 