import React from 'react';
import { 
  HeaderContainer, 
  WelcomeChoices, 
  NavLinks,
  ConnectButton,
  SearchContainer
} from '../styles/HeaderStyles';
import hubCyLogo from '../assets/HubCyLogo.png';
import MagnifyGlass from '../assets/magnifyGlass.png';

const Header = () => {
  return (
    <HeaderContainer>
      <WelcomeChoices>
        <a href="/">
          <img src={hubCyLogo} alt="HubCY" />
        </a>
      </WelcomeChoices>

      <NavLinks>
        <a href="/faq">FAQ</a>
        <div>
          <a href="/connexion">
            <ConnectButton>Connexion</ConnectButton>
          </a>
        </div>
      </NavLinks>

    <SearchContainer>
      <a href="/">
      <img src={MagnifyGlass} alt="Magnifying Glass" />
      </a>
    </SearchContainer>

    </HeaderContainer>
  );
};

export default Header; 