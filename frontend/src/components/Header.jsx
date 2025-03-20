/*
 * Composant Header - Barre de navigation principale du site
 * 
 * Ce header contient:
 * - Le logo HubCY à gauche qui renvoie à l'accueil
 * - Des liens de navigation (FAQ et bouton Connexion)
 * - Une icône de recherche qui peut s'ouvrir/se fermer
 * 
 * Fonctionnalités:
 * - L'icône de recherche est interactive (clic pour ouvrir/fermer)
 * - Le state isSearchOpen contrôle l'affichage de l'icône (loupe ou croix)
 *
 */

import React from 'react';
import { 
  HeaderContainer, 
  WelcomeChoices, 
  NavLinks,
  ConnectButton
} from '../styles/HeaderStyles';
import hubCyLogo from '../assets/HubCyLogo.png';
import SearchBox from './SearchBox';

const Header = () => {
  // Supprimer isSearchOpen et handleClick car ils sont gérés dans SearchBox
  
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
  
      <SearchBox />
    </HeaderContainer>
  );
};

export default Header;