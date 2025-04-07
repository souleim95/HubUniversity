import styled from 'styled-components';

export const ScheduleContainer = styled.div`
  padding: 20px;
  margin: 20px auto;
  max-width: 1200px; // Ajuste la largeur maximale
  width: 90%;
  background-color: #ffffff; // Fond blanc pour un bloc propre
  border-radius: 12px; // Coins arrondis pour un design plus moderne
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); // Ombre douce pour donner de la profondeur
  transition: all 0.3s ease; // Transition douce lors du survol

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15); // Ombre plus marquée au survol
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between; // Permet aux éléments de se placer côte à côte
  flex-wrap: wrap; // Pour qu'ils passent à la ligne sur petits écrans
  gap: 20px; // Espace entre les éléments
  margin-top: 15px; // Espacement ajouté en haut

  @media (max-width: 768px) {
    flex-direction: column; // Sur petits écrans, empile les éléments
    align-items: center; // Centre les éléments
  }
`;

export const MainTitle = styled.h2`
  font-family: var(--font-secondary);
  color: #0f6ead; // Bleu vif
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.2em; // Taille de police un peu plus grande

  @media (max-width: 768px) {
    font-size: 1.8em; // Réduction de la taille sur les petits écrans
  }
`;

export const DirectionBox = styled.div`
  margin: 15px 0;
  padding: 20px;
  background-color: #ffffff; // Fond blanc pour un meilleur contraste
  border-radius: 10px; // Coins arrondis
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); // Ombre subtile
  transition: all 0.3s ease; // Transition douce lors du survol

  &:hover {
    background-color: #f0f4f8; // Légère couleur de fond différente au survol
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); // Ombre plus marquée au survol
  }
`;

export const DirectionTitle = styled.h3`
  font-family: var(--font-secondary);
  cursor: pointer;
  color: #0f6ead; // Bleu vif
  font-size: 1.6em;
  margin-bottom: 12px; // Espacement réduit

  &:hover {
    color: #4a90e2; // Couleur plus claire au survol
  }

  @media (max-width: 768px) {
    font-size: 1.4em; // Réduction de la taille sur les petits écrans
  }
`;

export const ErrorMessage = styled.div`
  color: #dc3545; // Couleur rouge vif
  margin: 10px 0;
  font-size: 1.2em; // Augmentation de la taille de la police
  text-align: center; // Centrer le message d'erreur
  font-weight: bold;
`;

export const TrainInfo = styled.div`
  font-size: 1.2em; // Légère augmentation de la taille de la police
  margin: 10px 0;
  color: #333;
  line-height: 1.6; // Meilleure lisibilité

  @media (max-width: 768px) {
    font-size: 1.1em; // Réduction sur petits écrans
  }
`;
