import styled from 'styled-components';

export const HeaderContainer = styled.header`
  background-color: whitesmoke;
  width: 100%;
  position: fixed;
  left: 0;
  z-index: 1000;
  border-bottom: solid rgb(15, 110, 173) 3px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  flex-wrap: wrap;
  height: auto;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 10px;
    gap: 12px;
  }
`;

export const WelcomeChoices = styled.div`
  display: flex;
  align-items: center;
  border-right: solid rgb(15, 110, 173) 3px;
  padding-right: 20px;

  a {
    text-decoration: none;
    color: rgb(15, 110, 173);
    font-size: 1.1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
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
    border: none;
    padding: 0;
    flex-direction: column;
    align-items: center;
  }
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1 1 100%;
  width: 100%;

  span {
    color: #2C5282;
    font-size: 1rem;
    font-weight: 600;
    padding: 8px 12px;
    border-radius: 4px;
    background-color: rgba(44, 82, 130, 0.1);
  }

  @media (max-width: 480px) {
    gap: 6px;
    span {
      font-size: 0.85rem;
      padding: 6px 10px;
    }
  }
`;

export const ConnectButton = styled.button`
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
`;

export const SearchContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: rgb(15, 110, 173);
  z-index: 1001;

  div {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }
`;



export const SearchBar = styled.input`
  position: fixed;
  top: 70px;
  right: 60px;
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

  @media (max-width: 480px) {
    width: 200px;
    padding: 8px;
    right: 10px;
  }
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
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 380px;
  animation: slideIn 0.5s ease-in-out;

  @media (max-width: 480px) {
    width: 90%;
    padding: 20px;
  }
`;

export const Filter = styled.select`
  flex: 1;
  min-width: 100px;
  padding: 8px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  background-color: white;
  cursor: pointer;
  outline: none;
  font-size: 14px;
  color: #333;
  transition: all 0.2s ease;

  option {
    padding: 8px;
    background-color: white;
    color: #333;
    font-size: 14px;

    &:first-child {
      font-weight: bold;
      color: #0f6ead;
    }

    &:hover {
      background-color: #e3f2fd;
    }
  }

  &:hover {
    border-color: #0f6ead;
    box-shadow: 0 2px 4px rgba(15, 110, 173, 0.1);
  }

  &:focus {
    border-color: #0f6ead;
    box-shadow: 0 0 0 2px rgba(15, 110, 173, 0.2);
  }

  &:not([multiple]) option:checked {
    background-color: #e3f2fd;
    color: #0f6ead;
  }

  @media (max-width: 480px) {
    min-width: 80px;
    font-size: 13px;
  }
`;