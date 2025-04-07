import styled from 'styled-components';

export const InfoContainer = styled.div`
  margin: 30px auto;
  padding: 25px;
  max-width: 1200px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
`;

export const InfoTitle = styled.h2`
  font-size: 2.2em;
  text-align: center;
  color: #2b6cb0;
  margin-bottom: 25px;
  font-family: var(--font-secondary);
`;

export const InfoContent = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;


export const TrainBox = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  h3 {
    font-size: 1.8em;
    color: #0f6ead;
    text-align: center;
    margin-bottom: 20px;
  }
`;


export const WeatherBox = styled.div`
  flex: 1; /* Permet à la boîte météo de prendre l'espace disponible */
  padding: 20px;
  background-color:;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  /* Centrer la boîte météo horizontalement */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    transform: scale(1.05); /* Effet de zoom sur la box */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Ombre accentuée au survol */
  }
`;
