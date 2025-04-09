import styled from 'styled-components';

export const ProfileContainer = styled.div`
  max-width: 1400px;  // Augmentez la largeur maximale du conteneur
  margin: 40px auto;  // Augmentez la marge pour plus d'espace autour
  padding: 40px;  // Augmentez l'espacement interne
  background-color: #f5f7fa;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 95%;
  
  @media (max-width: 768px) {
    padding: 25px;  // Augmentez l'espacement sur mobile également
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
  gap: 30px;  // Augmenter l'espace entre les cartes
  flex-wrap: nowrap;
  width: 100%;
  align-items: stretch;
  height: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;



export const ProfileCard = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 400px;  // Augmentez la hauteur minimale de la carte
  background-color: white;
  padding: 25px;  // Augmentez l'espacement interne
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  
  p {
    margin: 10px 0;  // Ajoutez un peu plus d'espace entre les paragraphes
    font-size: 1.1rem;  // Augmentez la taille de la police pour plus de lisibilité
  }
`;


export const LevelBox = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: rgb(15, 110, 173);
  color: white;
  border-radius: 5px;
`;

export const ProgressBar = styled.div`
  background-color: #e0e0e0;
  border-radius: 10px;
  height: 20px;
  margin-top: 15px;
  width: 100%;
  
  div {
    background-color: #4caf50;
    height: 100%;
    border-radius: 10px;
  }
`;

export const ObjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  text-align: left;

  h3 {
    grid-column: span 2;
  }
`;

export const ObjectItem = styled.div`
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transform: translateY(-2px);
  }
`;

export const IconWrapper = styled.div`
  font-size: 2rem;
  margin-right: 15px;
  color: rgb(49, 137, 196);
`;

export const InputField = styled.input`
  margin: 20px 0;  // Augmenter l'espacement entre les champs
  padding: 18px;  // Augmenter l'espacement interne pour un champ plus grand
  width: 100%;
  border-radius: 10px;
  border: 1px solid #e1e1e1;
  font-size: 1.2rem;  // Augmenter la taille de la police des champs
  transition: all 0.3s ease;

  &:focus {
    border-color: rgb(15, 110, 173);
    outline: none;
    box-shadow: 0 0 8px rgba(15, 110, 173, 0.3);
  }
`;


export const SaveButton = styled(LevelBox)`
  width: 100%;
  margin-top: 20px;
  cursor: pointer;
  text-align: center;
  background-color: rgb(49, 137, 196);
  font-size: 1.1rem;
  border-radius: 8px;
  padding: 12px;
  transition: 0.3s ease;

  &:hover {
    background-color: rgb(67, 143, 228);
  }

  &.changed {
    background-color: rgb(238, 78, 78);

    &:hover {
      background-color: rgb(230, 60, 60);
    }
  }
`;

export const ChangePasswordSection = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 400px;  // Augmentez la hauteur de la section
  background-color: white;
  padding: 25px;  // Augmentez l'espacement interne
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

export const PasswordInputField = styled(InputField)`
  width: 100%;
  margin: 10px 0;
`;

export const ChangePasswordButton = styled(SaveButton)`
  margin-top: 15px;
  background-color: rgb(238, 78, 78);
  text-align: center;

  &:hover {
    background-color: rgb(230, 60, 60);
  }
`;

export const ToggleViewButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 20px;
  margin-top: 15px;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;
