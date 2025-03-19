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

const HeroContainer = styled.section`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  backdrop-filter: blur(5px);
  width: 100%;
  max-width: 1200px;
`;

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