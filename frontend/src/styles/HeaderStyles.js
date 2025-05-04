import styled from 'styled-components';


export const HeaderContainer = styled.header`
  background-color: whitesmoke;
  width: 100%;
  position: fixed;
  top: ${props => props.isVisible ? '0' : '-123px'};
  left: 0;
  z-index: 1000;
  border-bottom: solid rgb(15, 110, 173) 3px;
  display: flex;
  align-items: center;
  padding: 8px 20px;
  flex-wrap: wrap;
  justify-content: space-between;
  min-height: 72px;
  transition: top 0.3s ease-in-out;
  backdrop-filter: blur(8px);
  background-color: rgba(245, 245, 245, 0.95);

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 6px 10px;
    gap: 6px;
    top: ${props => props.isVisible ? '-165px' : '-300px'};
  }
`;




export const WelcomeChoices = styled.div`
  display: flex;
  align-items: center;
  border-right: solid rgb(15, 110, 173) 3px;
  padding-right: 20px;
  height: 100%;

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
  padding: 4px 0;
  margin-bottom: 4px;
  img {
    height: 36px;
  }
}


  @media (max-width: 480px) {
    flex-direction: column;
    gap: 5px;
    text-align: center;

    img {
      height: 40px;
    }

    a {
      font-size: 1rem;
    }
  }
`;


export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  height: 100%;
  flex: 1;

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
    height: auto;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;

    span {
      font-size: 0.95rem;
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
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  height: 100%;
  color: rgb(15, 110, 173);

  div {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
    justify-content: center;
    margin-top: 10px;
    height: auto;
  }

@media (max-width: 480px) {
  flex-direction: column;
  gap: 5px;
  margin-bottom: 0;
  padding-bottom: 0;
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

  @media (max-width: 480px) {
    width: 90%;
    top: 100px;
    right: 5%;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  z-index: 999;
  animation: fadeOverlay 0.3s ease-in-out;

  @keyframes fadeOverlay {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const LoginFormContainer = styled.div`
  position: fixed;
  top: 50vh;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  width: 90%;
  max-width: 400px;
  max-height: 85vh;
  overflow-y: auto;
  animation: popIn 0.3s ease-out;

  @keyframes popIn {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  /* Styliser la barre de défilement */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #0f6ead;
    border-radius: 4px;
  }

  h2 {
    color: #0f6ead;
    font-size: 24px;
    margin-bottom: 25px;
    text-align: center;
    font-weight: 600;
  }

  input, select {
    width: 100%;
    padding: 12px 16px;
    margin-bottom: 16px;
    border: 2px solid #eef2f7;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
    background: #f8fafc;

    &:focus {
      outline: none;
      border-color: rgb(15, 110, 173);
      background: white;
      box-shadow: 0 0 0 3px rgba(15, 110, 173, 0.1);
    }
  }

  button {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;

    &:not(.switch-form):not(.close-btn) {
      background: rgb(15, 110, 173);
      color: white;
      margin-top: 10px;

      &:hover {
        background: rgb(12, 90, 143);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(15, 110, 173, 0.2);
      }
    }
  }

  .switch-form {
    background: none;
    color: rgb(15, 110, 173);
    text-decoration: underline;
    padding: 0;
    margin: 0;
    width: auto;
    display: inline;

    &:hover {
      color: rgb(12, 90, 143);
    }
  }

  p {
    margin: 20px 0;
    text-align: center;
    color: #64748b;
    font-size: 14px;
  }

  .close-btn {
    background: #ef4444;
    color: white;
    margin-top: 15px;

    &:hover {
      background: #dc2626;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
    }
  }

  .password-input {
    position: relative;
    width: 100%;
    margin-bottom: 16px;

    input {
      margin-bottom: 0;
      padding-right: 40px;
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      top: 2px;
      background: none;
      border: none;
      padding: 0;
      width: auto;
      height: auto;
      color: #666;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 24px;
        height: 24px;
        transition: transform 0.2s ease;
      }

      &:hover svg {
        transform: scale(1.15);
      }

      &:active svg {
        transform: scale(0.95);
        opacity: 0.1;
      }
    }
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 25px;
    margin: 10px;
  }

  @media (max-width: 480px) {
    width: 90%;
    max-height: 85vh;
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

  @media (max-width: 768px) {
    min-width: 80px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    min-width: 70px;
  }
`;