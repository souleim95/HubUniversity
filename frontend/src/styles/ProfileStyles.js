import styled, { createGlobalStyle } from 'styled-components';

// Ajouter ces styles globaux
export const GlobalStyle = createGlobalStyle`
  select option {
    background-color: #1d124e;
    color: white;
    padding: 10px;
  }

  select:hover {
    border-color: #4a90e2;
  }

  select:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

// Animation (si besoin)
export const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background-color: #000;

  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

export const ProfileContainer = styled.div`
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 120px; /* Décalage pour éviter que le header ne masque le contenu */
  background-color: rgba(29, 18, 78, 0.94);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(5px);

  @media (max-width: 768px) {
    padding-top: 130px; /* Un peu plus d’espace sur tablette/mobile */
  }

  @media (max-width: 480px) {
    padding: 10px;
    padding-top: 130px; /* On garde aussi le décalage ici */
    top: 10px; /* Optionnel : à supprimer si tu n’en as pas besoin */
  }
`;


export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;

  h2 {
    color: #fff;
  }

  @media (max-width: 480px) {
  flex-direction: column;
  align-items: flex-start;
  h2 {
    font-size: 1.3rem;
  }
}

`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ProfileCard = styled.div`
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  background-color: rgb(54, 94, 141);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  color: white;
`;

export const InputField = styled.input`
  padding: 15px;
  margin: 10px 0;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1.1rem;
  background-color: #fefefe;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
  }
`;

export const SaveButton = styled.button`
  background-color: #5cb85c;
  color: white;
  padding: 15px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #4cae4c;
  }

  &.changed {
    background-color: #d9534f;

    &:hover {
      background-color: #c9302c;
    }
  }

  &:focus {
    outline: 3px dashed #4cae4c;
    outline-offset: 3px;
  }
`;

export const ChangePasswordSection = styled.div`
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  background-color: rgb(96, 80, 139);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  h3 {
    margin-bottom: 15px;
    color: white;
  }
`;

export const PasswordInputField = styled.input`
  padding: 15px;
  margin: 10px 0;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1.1rem;
  background-color: #fefefe;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
  }
`;

export const ToggleViewButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: 3px dashed #0056b3;
    outline-offset: 3px;
  }
`;

export const ProfilePictureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.94);
  padding: 15px;
  border-radius: 10px;
`;

export const ProfilePicture = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 3px solid #ddd;
  box-shadow: 0 4px 8px rgba(2, 2, 2, 0.94);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

export const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c0392b;
  }

  &:focus {
    outline: 3px dashed #c0392b;
    outline-offset: 3px;
  }
`;

export const FileInputContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

export const FileInputLabel = styled.label`
  display: inline-block;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  text-align: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2563eb;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const FileNameDisplay = styled.span`
  display: block;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #374151;
  text-align: center;
`;
