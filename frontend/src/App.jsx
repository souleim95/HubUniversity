import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CampusMap from './components/CampusMap';
import SignupForm from './components/SignupForm';
import Footer from './components/Footer';
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

function App() {
  return (
    <>
      <GlobalStyle />
      <div className="App">
        <Header />
        <main>
          <HeroSection />
          <CampusMap />
          <SignupForm />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App; 