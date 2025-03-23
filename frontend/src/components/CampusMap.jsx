/*
 * Composant CampusMap - Affiche une carte interactive du campus
 * 
 * Ce composant est prévu pour afficher une carte des campus et les événements à venir.
 * Pour l'instant, c'est juste une structure avec des placeholders - on doit encore 
 * implémenter la carte interactive. 
 * La section EventsList est aussi à compléter avec des vrais événements.
 * 
 * - MapSection : le conteneur principal avec fond blanc
 * - MapContainer : la div où on va intégrer la carte
 * - EventsList : liste des événements sous la carte
 */

import React from 'react';
import { 
  MapSection, 
  MapContainer, 
  EventsList 
} from '../styles/CampusMapStyles';

const CampusMap = () => {
  return (
    <MapSection id="quick-access">
      <h2>Campus Connecté</h2>
      <MapContainer>
        {/* Insérer ici notre carte interactive */}
      </MapContainer>
      <EventsList>
        <h3>Événements à venir</h3>
        {/* Liste des événements */}
      </EventsList>
    </MapSection>
  );
};

export default CampusMap; 