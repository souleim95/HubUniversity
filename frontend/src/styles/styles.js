// src/styles.js
import styled from 'styled-components';

// Conteneur principal de la page
export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;  // Assure que le conteneur prend toute la hauteur de la fenêtre
`;

// Contenu principal de la page
export const Content = styled.main`
  flex: 1;  // Ce conteneur prendra l'espace restant
  padding: 20px;
`;
