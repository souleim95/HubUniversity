import styled from 'styled-components';

export const FaqTitle = styled.h2`
  color: rgb(0, 1, 1);
  margin-bottom: 30px;
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  position: absolute;
  left: -27px;
  font-size: 2em;
  padding: 20px 0;
  border-right: 4px solid rgb(15, 110, 173);
  border-left: none;

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
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

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
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  
  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

export const Question = styled.div`
  padding: 15px 20px;
  background-color: rgb(15, 110, 173);
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease, transform 0.3s ease;
  border-bottom: 1px solid #ddd;
  height: 100%; /* Remplir toute la hauteur du conteneur */
  display: flex;
  align-items: center;
`;

export const Answer = styled.div`
  padding: ${props => props.isOpen ? '15px 20px' : '0 20px'};
  background-color: #fafafa;
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  box-shadow: ${props => props.isOpen ? '0 4px 10px rgba(0, 0, 0, 0.1)' : 'none'};
  margin-bottom: 0; /* Éliminer l'espace en bas */
`;

