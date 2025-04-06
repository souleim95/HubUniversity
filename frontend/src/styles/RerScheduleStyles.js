import styled from 'styled-components';

export const ScheduleContainer = styled.div`
  padding: 20px;
  margin: 20px auto;
  max-width: 800px;
  width: 90%;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const MainTitle = styled.h2`
  font-family: var(--font-secondary);
  color: rgb(15, 110, 173);
  text-align: center;
  margin-bottom: 20px;
  font-size: 2em;

  @media (max-width: 768px) {
    font-size: 1.5em;
  }
`;

export const DirectionBox = styled.div`
  margin: 10px 0;
  padding: 15px;
  background-color: rgb(255, 255, 255);
  border-radius: 4px;
`;

export const DirectionTitle = styled.h3`
  font-family: var(--font-secondary);
  cursor: pointer;
  color: rgb(15, 110, 173);
  font-size: 1.5em;
  margin-bottom: 15px;

  &:hover {
    color: rgb(67, 143, 228);
  }

  @media (max-width: 768px) {
    font-size: 1.2em;
  }
`;

export const ErrorMessage = styled.div`
  color: #dc3545;
  margin: 10px 0;
  font-size: 1.1em;
`;

// Ajout de TrainInfo pour l'affichage des horaires de train
export const TrainInfo = styled.div`
  font-size: 1.1em;
  margin: 10px 0;
  color: #333;
`;
