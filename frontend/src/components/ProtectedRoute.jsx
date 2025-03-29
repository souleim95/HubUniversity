import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const userRole = localStorage.getItem('role');

  if (!userRole || !allowedRoles.includes(userRole)) {
    // Redirige vers l'accueil si le rôle n'est pas autorisé
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
