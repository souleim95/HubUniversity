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

import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
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
  //state (état, donées)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [submit, setSubmit] = useState(false); 
  
  //comportements
  const handleClick = (event) => {
    event.preventDefault();
    setIsSearchOpen(!isSearchOpen);
    handleSubmit(event);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchValue(event.target.value);
  }

  //1.copie du state

  //2.manipuler cette copie

  //3.mettre à jour le state avec le setter


  //affichage du header
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
      {isSearchOpen ? (
          <FaTimes onClick={handleClick} size={25} />
        ) : (
          <FaSearch onClick={handleClick} size={35} />
        )}
    </SearchContainer>

    </HeaderContainer>
  );
};

export default Header; 