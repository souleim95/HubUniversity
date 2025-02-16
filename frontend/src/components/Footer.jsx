import React from 'react';
import { 
  FooterContainer, 
  Names, 
  About,
  Logo 
} from '../styles/FooterStyles';
import cytechLogo from '../assets/cytech.png';
import cyuLogo from '../assets/cyu.png';

const Footer = () => {
  return (
    <FooterContainer>
      <Names>
        <a href="mailto:saghirloua@cy-tech.fr">Louaye Saghir</a>
        <a href="mailto:paul.pitiot@etu.cyu.fr">Paul Pitiot</a>
        <a href="mailto:florian.delsuc@etu.cyu.fr">Florian Delsuc</a>
        <a href="mailto:e-sghoudi@etu.cyu.fr">Souleim Ghoudi</a>
      </Names>

      <About>
        <h6>About</h6>
        <p>
          Cette plateforme a été développée dans le cadre d'un projet de développement web à CY TECH, 
          avec l'ambition de moderniser l'expérience universitaire numérique. Notre interface intuitive 
          permet aux étudiants et aux enseignants de collaborer efficacement, tout en simplifiant la 
          gestion administrative quotidienne.
        </p>
      </About>

      <a href="https://cytech.cyu.fr" target="_blank" rel="noopener noreferrer">
        <Logo src={cytechLogo} alt="CY Tech" type="cytech" />
      </a>

      <a href="https://www.cyu.fr" target="_blank" rel="noopener noreferrer">
        <Logo src={cyuLogo} alt="CYU" type="cyu" />
      </a>
    </FooterContainer>
  );
};

export default Footer; 