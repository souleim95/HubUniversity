/*
 * Composant HeroSection - Bannière principale avec vidéo en arrière-plan
 * 
 * C'est la première chose que les utilisateurs voient en arrivant sur le site.
 * Il se compose de:
 * - Une vidéo en arrière-plan qui tourne en boucle (welcome.mp4)
 * - Un texte de bienvenue centré sur fond semi-transparent
 * 
 */

import React from 'react';
import styled from 'styled-components';
import welcomeVideo from '../assets/welcome.mp4';
import { 
  HeroContainer, 
  Video, 
  HeroContent
} from '../styles/HeroSectionStyles';


const HeroSection = () => {
  return (
    <HeroContainer id="presentation">
      <Video autoPlay muted loop playsInline>
        <source src={welcomeVideo} type="video/mp4" />
      </Video>
      <HeroContent>
        <h1>Bienvenue sur HubCY</h1>
        <p>Découvrez l'école connectée de demain</p>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSection; 