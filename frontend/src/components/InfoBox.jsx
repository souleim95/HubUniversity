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

export default function InfoBox() {
  return (
    <InfoContainer>
      <InfoTitle>Informations</InfoTitle>
      <InfoContent>
        <TrainBox>
          <RerSchedule />
        </TrainBox>
        <WeatherBox>
          <WeatherInfo /> {/* La boîte météo unique */}
        </WeatherBox>
      </InfoContent>
    </InfoContainer>
  );
}
