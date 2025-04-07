import styled from 'styled-components';

export const MapSection = styled.section`
  padding: 4rem 2rem;
  background-color: white;
  max-width: 1200px;
  margin: auto;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Ajout d'une ombre douce */
  overflow: hidden; /* Empêche les cartes de dépasser */
`;

export const MapContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin: 2rem 0;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05); /* Agrandissement au survol */
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2); /* Ombre plus marquée au survol */
  }

  /* Adaptation sur petits écrans */
  @media (max-width: 768px) {
    height: auto;
  }
`;

export const EventsList = styled.div`
  margin-top: 2rem;
  padding: 1rem 10px; /* Espacement interne pour plus de confort visuel */
  background-color: #f9f9f9; /* Fond léger pour séparer visuellement des autres sections */
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Ajout d'ombre pour plus de profondeur */

  h3 {
    font-size: 1.5rem;
    color: #2C5282; /* Couleur bleue pour le titre */
    font-weight: 600;
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: none;
    padding: 0;
    
    li {
      background-color: #ffffff;
      margin-bottom: 1rem;
      padding: 1rem;
      border-radius: 8px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #e2e8f0; /* Changement de fond au survol */
      }
    }
  }
`;
