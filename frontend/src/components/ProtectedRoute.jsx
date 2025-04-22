import React from 'react';
import { Navigate } from 'react-router-dom';

/*
* Composant ProtectedRoute : protège l'accès à certaines routes selon le rôle utilisateur
* Permet de restreindre l'accès à certaines pages à des rôles spécifiques (ex : directeur, professeur)
*/
const ProtectedRoute = ({ allowedRoles, children }) => {
  const userRole = sessionStorage.getItem('role'); // Récupère le rôle de l'utilisateur depuis la session

  // Convertit certains alias de rôle en rôles front correspondants
  const mappedRoles = allowedRoles.map(role => {
    switch(role) {
      case 'gestionnaire':
        return 'professeur';
      case 'admin':
        return 'directeur';
      default:
        return role;
    }
  });

  if (!userRole || !mappedRoles.includes(userRole)) {
    // Redirige vers l'accueil si le rôle n'est pas autorisé
    return <Navigate to="/" replace />;
  }

  return children; // Affiche le contenu protégé si le rôle est autorisé
};

export default ProtectedRoute;
