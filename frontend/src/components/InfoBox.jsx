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
* Composant InfoBox : regroupe les informations utiles (horaires + météo)
* Affiche côte à côte le composant RerSchedule et le composant WeatherInfo
*/
export default function InfoBox() {
  return (
    <InfoContainer id="info-section">
      <InfoTitle style={{
        fontSize: '2em',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '15px',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
      }}>Informations</InfoTitle>
      <InfoContent>
        {/* Section pour les horaires de RER */}
        <TrainBox>
          <RerSchedule />
        </TrainBox>

        {/* Section météo intégrée directement */}
        <WeatherInfo />
      </InfoContent>
    </InfoContainer>
  );
}