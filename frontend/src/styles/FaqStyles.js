import styled from 'styled-components';

export const FaqTitle = styled.h2`
  color: #333;
  margin-bottom: 30px;
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  position: absolute;
  left: -3px;
  top: 17px;
  font-size: 2em;
  padding: 0.7px 4px;
  border-right: 7px solid rgb(15, 110, 173);
  border-left: none;
  font-family: 'Roboto', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    position: static;
    writing-mode: horizontal-tb;
    transform: none;
    border: none;
    text-align: center;
    margin: 10px 0;
  }
`;

export const FaqContainer = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px 20px 20px 100px;
  position: relative;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid #eee;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const FaqContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
`;

export const FaqColumn = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 450px; /* Limiter la largeur maximale des colonnes */
  margin: 0 auto; /* Centrer les colonnes */
  
  @media (max-width: 768px) {
    flex: 100%;
    max-width: 100%; /* En mode mobile, chaque colonne prend toute la largeur */
  }
`;

export const FaqItem = styled.div`
  margin-bottom: 15px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  transition: box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid #f0f0f0;
  
  &:hover {
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
  }
`;

export const Question = styled.div`
  padding: 18px 22px;
  background-color:rgb(33, 86, 140);
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease, transform 0.3s ease;
  border-bottom: 1px solid #ddd;
  font-weight: 500;
  font-size: 16px;
  border-radius: 8px 8px 0 0;

  &:hover {
    background-color: #34495e;
  }
`;

export const Answer = styled.div`
  padding: ${props => props.isOpen ? '18px 22px' : '0 22px'};
  background-color: #f9f9f9;
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease, padding 0.4s ease;
  box-shadow: ${props => props.isOpen ? '0 4px 10px rgba(0, 0, 0, 0.05)' : 'none'};
  margin-bottom: 0; /* Éliminer l'espace en bas */
  border-top: 1px solid #eee;
  font-size: 14px;
  line-height: 1.6;
  color: #555;
`;

