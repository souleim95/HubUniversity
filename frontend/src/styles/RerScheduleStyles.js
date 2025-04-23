import styled from 'styled-components';

export const ScheduleContainer = styled.div`
  padding: 20px;
  margin: 20px auto;
  max-width: 1200px;
  width: 90%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px); /* ajout subtil */
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch; /* amélioration de l'empilement */
  }
`;

export const MainTitle = styled.h2`
  font-family: var(--font-secondary);
  color: #0f6ead;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.2em;

  @media (max-width: 768px) {
    font-size: 1.8em;
    margin-bottom: 15px; /* cohérence */
  }
`;

export const DirectionBox = styled.div`
  flex: 1 1 45%;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    background-color: #f0f4f8;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const DirectionTitle = styled.h3`
  font-family: var(--font-secondary);
  color: #0f6ead;
  font-size: 1.6em;
  margin-bottom: 12px;
  transition: color 0.2s ease;

  &:hover {
    color: #4a90e2;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    font-size: 1.4em;
  }
`;

export const ErrorMessage = styled.div`
  color: #dc3545;
  margin: 10px 0;
  font-size: 1.2em;
  text-align: center;
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 1.1em;
  }
`;

export const TrainInfo = styled.div`
  font-size: 1.2em;
  margin: 10px 0;
  color: #333;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1em;
  }
`;
