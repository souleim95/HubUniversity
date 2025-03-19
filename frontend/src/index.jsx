/*
 * Fichier index.jsx - Le point d'entrée de l'application React
 * 
 * Ce fichier est le premier à s'exécuter quand on lance l'application.
 * Son rôle est simple mais crucial:
 * - Il importe React et ReactDOM pour permettre le rendu dans le navigateur
 * - Il importe notre composant App qui contient tout le reste de l'application
 * - Il trouve l'élément HTML avec l'id "root" dans notre index.html
 * - Il y "monte" (attache) notre application React
 * 
 * Le <React.StrictMode> est un outil de développement qui:
 * - Détecte les problèmes potentiels dans notre code
 * - Affiche des avertissements supplémentaires dans la console
 * - Est automatiquement désactivé en production
 */


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 