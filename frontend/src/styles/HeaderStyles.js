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
  padding: 10px 20px;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 115px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 10px;
    gap: 10px;
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
    flex: 1 1 100%;
    justify-content: center;
    border: none;
    padding: 5px 0;
    height: auto;
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
    gap: 10px;
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

  h2 {
    color: rgb(15, 110, 173);
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
  }

  @media (max-width: 480px) {
    width: 90%;
    padding: 20px 15px;

    h2 {
      font-size: 20px;
    }

    input, select {
      padding: 10px 12px;
      font-size: 13px;
    }

    button {
      font-size: 14px;
      padding: 10px;
    }
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