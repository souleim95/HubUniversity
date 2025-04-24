import React from 'react';
import welcomeVideo from '../assets/welcome.mp4';
import { 
  HeroContainer, 
  Video, 
  HeroContent 
} from '../styles/HeroSectionStyles';

/*
* Composant visuel principal (Hero) avec une vidéo de fond immersive
* Utilisé pour présenter l'application de manière engageante dès l'arrivée
*/

const HeroSection = () => {
  return (
    <HeroContainer id="presentation">
      {/* Vidéo de fond jouée automatiquement, sans son, en boucle */}
      <Video autoPlay muted loop playsInline>
        <source src={welcomeVideo} type="video/mp4" />
      </Video>

      {/* Texte d'accroche centré sur la vidéo */}
      <HeroContent>
        <h1 className="fade-in">Bienvenue sur HubCY</h1>
        <p className="fade-in">Découvrez l'école connectée de demain</p>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSection;