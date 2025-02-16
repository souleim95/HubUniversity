import React from 'react';
import { 
  HeaderContainer, 
  WelcomeChoices, 
  NavLinks,
  ConnectButton 
} from '../styles/HeaderStyles';
import hubCyLogo from '../assets/HubCyLogo.png';

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
    </HeaderContainer>
  );
};

export default Header; 