import styled from 'styled-components';

// Conteneur principal de la page
export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; // Prend toute la hauteur de la fenêtre
`;

// Contenu principal de la page
export const Content = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;
