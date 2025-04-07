import styled from 'styled-components';

export const DashboardContainer = styled.div`
  max-width: 1400px;  // Augmentez la largeur maximale du conteneur
  margin: 40px auto;  // Augmentez la marge autour
  padding: 40px;  // Augmentez l'espacement interne
  background-color: #f5f7fa;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  text-align: center;
  width: 95%;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    padding: 25px;  // Augmenter l'espacement pour les petits écrans
  }
`;

export const Header = styled.header`
  background: linear-gradient(45deg, #6a82fb, #fc5c7d);
  color: white;
  padding: 20px;
  border-radius: 15px;
  text-align: center;

  h2 {
    font-size: 2.2rem;
    margin: 0;
  }

  p {
    font-size: 1rem;
    margin: 10px 0;
  }
`;

export const InfoSection = styled.section`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
`;

export const ProfileCard = styled.div`
  background-color: white;
  padding: 25px;  // Augmenter l'espacement interne pour une carte plus spacieuse
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 450px;  // Augmenter la largeur maximale
  text-align: left;

  p {
    margin: 10px 0;  // Augmenter l'espace entre les paragraphes
    font-size: 1.1rem;  // Augmenter la taille de la police
  }
`;


export const LevelBox = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: rgb(15, 110, 173);
  color: white;
  border-radius: 5px;
`;

export const ChangeLevelButton = styled.button`
  margin-top: 20px;  // Augmenter la marge entre le bouton et les éléments
  padding: 12px 25px;  // Augmenter l'espacement interne du bouton
  background-color: rgb(49, 137, 196);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background-color: rgb(67, 143, 228);
  }
`;


export const ProgressBar = styled.div`
  background-color: #e0e0e0;
  border-radius: 10px;
  height: 25px;  // Augmenter la hauteur de la barre de progression
  margin-top: 20px;  // Augmenter l'espace au-dessus
  width: 100%;
  
  div {
    background-color: #4caf50;
    height: 100%;
    border-radius: 10px;
  }
`;


export const ObjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  margin-top: 20px;
`;

export const ObjectItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

export const ObjectHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

export const ObjectControls = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
`;

export const ControlButton = styled.button`
  padding: 8px 15px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  background: ${props => props.active ? '#4CAF50' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : 'black'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#45a049' : '#e0e0e0'};
  }
`;

export const IconWrapper = styled.div`
  font-size: 24px;
  margin-right: 15px;
  color: #2c3e50;
`;

export const RangeSlider = styled.input`
  width: 100%;
  margin: 10px 0;
  -webkit-appearance: none;
  height: 10px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &::-webkit-slider-thumb {
      background: #ccc;
      cursor: not-allowed;
    }
  }
`;

export const ValueDisplay = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 5px 0;
`;

export const ToggleButton = styled(ControlButton)`
  width: 120px;
  background: ${props => props.active ? '#4CAF50' : '#ff4444'};
  color: white;

  &:hover {
    background: ${props => props.active ? '#45a049' : '#cc0000'};
  }
`;



export const CategoryContainer = styled.div`
  margin: 20px 0;
`;

export const CategoryButton = styled.button`
  padding: 12px 24px;
  margin: 0 10px;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? '#2b6cb0' : '#e2e8f0'};
  color: ${props => props.active ? 'white' : '#2d3748'};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

export const SubItemContainer = styled.div`
  border-left: 3px solid #2b6cb0;
  margin-left: 20px;
  padding-left: 20px;
  margin-top: 10px;
`;
