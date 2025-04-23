import React from 'react';
import RerSchedule from './RerSchedule';
import WeatherInfo from './WeatherInfo';
import {
  InfoContainer,
  InfoTitle,
  InfoContent,
  TrainBox,
  WeatherBox
} from '../styles/InfoBoxStyles';

/*
 * Composant InfoBox : Centre d'informations pratiques
 * 
 * Description :
 * Agrège et présente les informations essentielles pour les utilisateurs
 * du campus, notamment les horaires de transport et la météo.
 * 
 * Sections :
 * 1. Horaires RER
 *    - Affichage des prochains départs
 *    - Mises à jour en temps réel
 *    - Indication des perturbations
 * 
 * 2. Informations météo
 *    - Conditions actuelles
 *    - Prévisions à court terme
 *    - Alertes météo si nécessaire
 * 
 * Architecture :
 * - Composition de sous-composants spécialisés
 * - Styling modulaire via InfoBoxStyles
 * - Structure responsive
 * - Performance optimisée
 * 
 * Accessibilité :
 * - Structure sémantique
 * - Contrastes adaptés
 * - Navigation au clavier
 * - Textes alternatifs
 */

export default function InfoBox() {
  return (
    // Conteneur principal des informations
    <InfoContainer id="info-section">
      {/* Titre de la section */}
      <InfoTitle style={{
        // Styles pour le titre
        fontSize: '2em',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '15px',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
      }}>Informations</InfoTitle>

      {/* Grille des widgets d'information */}
      <InfoContent>
        {/* Widget des horaires de RER */}
        <TrainBox>
          <RerSchedule />
        </TrainBox>

        {/* Widget météo */}
        <WeatherInfo />
      </InfoContent>
    </InfoContainer>
  );
}