import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const userRole = sessionStorage.getItem('role');

  // Convertir les rôles autorisés en noms de rôles correspondants
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

  return children;
};

export default ProtectedRoute;
