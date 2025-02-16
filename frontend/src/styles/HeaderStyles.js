import styled from 'styled-components';

export const HeaderContainer = styled.header`
  background-color: whitesmoke;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  border-bottom: solid rgb(15, 110, 173) 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5vh 2vw;
`;

export const WelcomeChoices = styled.div`
  display: flex;
  align-items: center;
  border-right: solid rgb(15, 110, 173) 3px;
  margin: 0;
  padding-right: 0.85%;
  width: auto;

  a {
    text-decoration: none;
    color: rgb(15, 110, 173);
    font-size: 1.2vw;
    cursor: pointer;
    font-weight: 600;
    background-color: whitesmoke;
    border: none;
    left: 1vw;
  }

  img {
    height: 4.5vw;
    margin-top: 0.2vw;
    margin-right: 1.4vw;
    margin-left: 0.1vw;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

export const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 2vw;

  a {
    text-decoration: none;
    color: rgb(15, 110, 173);
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      color: rgb(49, 137, 196);
      transform: scale(1.1);
    }
  }
`;

export const ConnectButton = styled.button`
  padding: 0.8vw 1.5vw;
  background-color: rgb(15, 110, 173);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1vw;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  margin-right: 2.5vw;

  &:hover {
    background-color: rgb(49, 137, 196);
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }

  &:active {
    transform: translateY(0px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
`; 