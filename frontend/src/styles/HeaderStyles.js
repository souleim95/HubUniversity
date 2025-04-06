import styled from 'styled-components';
import './animations.css';
  // Importation du fichier d'animations CSS

export const HeaderContainer = styled.header`
  background-color: whitesmoke;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  border-bottom: solid rgb(15, 110, 173) 3px;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const WelcomeChoices = styled.div`
  display: flex;
  align-items: center;
  border-right: solid rgb(15, 110, 173) 3px;
  padding-right: 10px;

  a {
    text-decoration: none;
    color: rgb(15, 110, 173);
    font-size: 1.1rem;
    font-weight: 600;
  }

  img {
    height: 45px;
    margin: 5px;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
    justify-content: center;
    border: none;
    padding: 5px 0;
  }
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  span {
    color: #2C5282;
    font-size: 1rem;
    font-weight: 600;
    padding: 8px 12px;
    border-radius: 4px;
    background-color: rgba(44, 82, 130, 0.1);
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
    justify-content: center;
    margin-top: 10px;
  }
`;

export const ConnectButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  background-color: rgb(15, 110, 173);
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: rgb(49, 137, 196);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 13px;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  div {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 24px;
      height: 24px;
      color: rgb(49, 137, 196);
      transition: all 0.3s ease;
    }
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
    justify-content: center;
    margin-top: 10px;
  }
`;

export const SearchBar = styled.input`
  position: fixed;
  top: 70px;
  right: 10px;
  width: 250px;
  padding: 10px;
  border: 2px solid rgb(15, 110, 173);
  border-radius: 4px;
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s ease;
  background-color: white;
  z-index: 1009;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export const LoginFormContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  animation: slideIn 0.5s ease-in-out; /* Douce transition de 0.5 secondes */


  h2 {
    margin-bottom: 15px;
  }

  input, select {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    width: 100%;
    padding: 10px;
    background: rgb(15, 110, 173);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
  }

  .close-btn {
    background: red;
    margin-top: 5px;
  }
`;
