import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CampusMap from './components/CampusMap';
import Faq from './components/Faq';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Gestion from './components/Gestion';
import AdminPage from './components/AdminPage';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalStyle from './styles/GlobalStyle'; 
import { PageContainer, Content } from './styles/styles'; 
import InfoBox from './components/InfoBox';
import { PlatformContext, PlatformProvider } from './context/PlatformContext';
import Formation from './components/Formation';
import Toast from './components/Toast';

/*
* Point d'entrée principal de l'application React
* Définit le système de routing avec protection des routes sensibles
* Fournit un contexte global avec PlatformProvider et applique des styles globaux
*/
const ThemedApp = () => {
  const { platformSettings } = useContext(PlatformContext);
  
  return (
    <ThemeProvider theme={platformSettings}>
      <Router>
        <GlobalStyle />
        <PageContainer>
          <Toast />
          <Header />
          <Content>
            <Routes>
              <Route path="/" element={
                <main>
                  <HeroSection />
                  <CampusMap />
                  <InfoBox />
                  <Faq />
                </main>
              } />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/formation" element={<Formation />} />
              <Route path="/gestion" element={
                <ProtectedRoute allowedRoles={['professeur', 'directeur']}>
                  <Gestion />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['directeur']}>
                  <AdminPage />
                </ProtectedRoute>
              } />
              <Route path="/profil" element={<Profile />} />
            </Routes>
          </Content>
          <Footer />
        </PageContainer>
      </Router>
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <PlatformProvider>
      <ThemedApp />
    </PlatformProvider>
  );
}