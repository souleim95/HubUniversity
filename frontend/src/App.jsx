import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { PlatformProvider } from './context/PlatformContext';
import Formation from './components/Formation';

/*
* Point d'entrée principal de l'application React
* Définit le système de routing avec protection des routes sensibles
* Fournit un contexte global avec PlatformProvider et applique des styles globaux
*/
export default function App() {
  return (
    <PlatformProvider> {/* Contexte global pour la configuration de la plateforme */}
      <Router>
        <GlobalStyle /> {/* Applique les styles globaux */}
        <PageContainer> {/* Conteneur principal pour la structure de la page */}
          <Header /> {/* En-tête visible sur toutes les pages */}
          <Content>
            <Routes>
              <Route path="/" element={
                <main>
                  <HeroSection /> {/* Section d'accueil avec vidéo */}
                  <CampusMap /> {/* Carte interactive du campus */}
                  <InfoBox /> {/* Boîte contenant horaires et météo */}
                  <Faq /> {/* Foire aux questions */}
                </main>
              } />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/formation" element={<Formation />} />

              {/* Routes protégées selon le rôle */}
              <Route path="/gestion" element={
                <ProtectedRoute allowedRoles={['gestionnaire', 'admin']}>
                  <Gestion />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPage />
                </ProtectedRoute>
              } />

              <Route path="/profil" element={<Profile />} />
            </Routes>
          </Content>
          <Footer /> {/* Pied de page commun */}
        </PageContainer>
      </Router>
    </PlatformProvider>
  );
}