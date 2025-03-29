import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CampusMap from './components/CampusMap';
// import SignupForm from './components/SignupForm';
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

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-primary);
    padding-top: 6vh;
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }

  main {
    flex: 1;
    width: 100%;
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
          <Faq />
          {/* <SignupForm /> */}
        </main>
        <Footer />
      </div>
    </>
  );
}
