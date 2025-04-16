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
import GlobalStyle from './styles/GlobalStyle'; // Import du style global
import { PageContainer, Content } from './styles/styles'; // Importez les styles flexbox
import InfoBox from './components/InfoBox';
import { PlatformProvider } from './context/PlatformContext';

export default function App() {
  return (
    <PlatformProvider>
      <Router>
        <GlobalStyle /> {/* Applique les styles globaux */}
        <PageContainer> {/* Conteneur flexbox pour garantir que le footer reste en bas */}
          <Header /> {/* Affiche le header */}
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
          <Footer /> {/* Affiche le footer */}
        </PageContainer>
      </Router>
    </PlatformProvider>
  );
}
