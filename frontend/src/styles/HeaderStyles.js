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
  align-items: center;
  padding: 10px 20px;
  min-height: 60px;
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
    height: 50px;
    margin: 5px 15px 5px 2px;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

export const NavLinks = styled.nav`
  position: absolute;
  right: 80px;
  display: flex;
  align-items: center;

  a {
    font-size: 16px;
    text-decoration: none;
    color: rgb(15, 110, 173);
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      color: rgb(49, 137, 196);
      transform: scale(1.1);
    }
  }

  div  a{
    padding: 0.4vw 1vw;
  }
`;

export const ConnectButton = styled.button`
  padding: 8px 20px;
  font-size: 16px;
  z-index: 998;
  background-color: rgb(15, 110, 173);
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  margin-right: 30vw;


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

export const SearchContainer = styled.div`
  position: fixed;
  right: 20px;
  top: 30px;
  z-index: 1010;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  div {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 20px;
      height: 20px;
      color: rgb(49, 137, 196);
      transition: all 0.3s ease;
    }
  }
`;

export const SearchBar = styled.input`
  position: fixed;
  top: 70px; // Positionné sous le header
  right: 20px;
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
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`;