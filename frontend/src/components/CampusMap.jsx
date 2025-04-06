import React from 'react';
import { 
  MapSection, 
  MapContainer, 
  EventsList 
} from '../styles/CampusMapStyles';

const CampusMap = () => {
  return (
    <MapSection>
      <h2>Campus Connecté</h2>
      <MapContainer>
        {/* Intégrer ici la carte interactive */}
      </MapContainer>
      <EventsList>
        <h3>Événements à venir</h3>
        {/* Liste des événements à ajouter ici */}
      </EventsList>
    </MapSection>
  );
};

export default CampusMap;
