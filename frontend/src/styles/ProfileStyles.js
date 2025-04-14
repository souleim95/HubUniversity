import styled from 'styled-components';

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
  margin: 20px auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.83);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(5px);
  top: 20px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;

  h2 {
    color: #333;
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
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
    cursor: pointer;
  }

  &.changed {
    background-color: #d9534f;

    &:hover {
      background-color: #c9302c;
    }
  }
`;

export const ChangePasswordSection = styled.div`
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  h3 {
    margin-bottom: 15px;
    color: #333;
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
    cursor: pointer;
  }
`;


export const ProfilePictureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  background-color: #f9f9f9; /* Subtle background */
  padding: 15px;
  border-radius: 10px;
`;

// Styled component for the profile picture
export const ProfilePicture = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 3px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add shadow */

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
`;

// Styled component for the delete button
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
