import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CampusMap from './components/CampusMap';
import Footer from './components/Footer';
import RerSchedule from './components/RerSchedule';
import Faq from './components/Faq';
import Dashboard from './components/Dashboard';
import Gestion from './components/Gestion';
import Admin from './components/Admin';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
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
    <Router>
      <GlobalStyle />
      <div className="App">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <HeroSection />
                <CampusMap />
                <RerSchedule />
                <Faq />
              </main>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/gestion"
            element={
              <ProtectedRoute allowedRoles={['gestionnaire', 'admin']}>
                <Gestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="/profil" element={<Profile />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
