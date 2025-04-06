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
        <h1 className="fade-in">Bienvenue sur HubCY</h1>
        <p className="fade-in">Découvrez l'école connectée de demain</p>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSection;
