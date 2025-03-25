/*
 * Composant App - Le composant racine de notre application
 * 
 * Ce fichier est le point central de notre site web. Il fait deux choses importantes:
 * - Il définit le style global (polices, marges, etc.) pour toute l'application
 * - Il assemble tous les composants principaux dans leur ordre d'affichage
 * 
 * Structure:
 * - GlobalStyle: définit les polices (Poppins pour le texte, Playfair pour les titres)
 * - Le conteneur principal avec Header en haut, Footer en bas, et les trois sections 
 *   principales (HeroSection, CampusMap, SignupForm) dans la balise <main>
 *
 */

import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CampusMap from './components/CampusMap';
//import SignupForm from './components/SignupForm';
import Footer from './components/Footer';
import RerSchedule from './components/RerSchedule';
import Faq from './components/Faq';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');

  :root {
    --font-primary: 'Poppins', sans-serif;
    --font-secondary: 'Playfair Display', serif;
  }

  body {
    font-family: var(--font-primary);
    padding-top: 6vh;
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
  }

  h1, h2, h3 {
    font-family: var(--font-secondary);
  }
`;

export default function App() {
  return (
    <>
      <GlobalStyle />
      <div className="App">
        <Header />
        <main>
          <HeroSection />
          <CampusMap />
          <RerSchedule />
          <Faq/> 
          {/* <SignupForm /> */}
        </main>
        <Footer />
      </div>
    </>
  );
}
