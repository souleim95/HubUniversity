import React, { useState } from 'react';
import { fakeObjects } from '../data/fakeData';
import {
  MapSection,
  MapContainer,
  EventsList,
  TabsWrapper,
  Tabs,
  Tab
} from '../styles/CampusMapStyles';

import { ObjectCard, CardInner, ObjectFront, ObjectBack } from '../styles/InteractiveCardStyles';

import salleImage from '../assets/salle.jpg';
import thermostatImage from '../assets/thermostat.jpg';
//import capteurImage from '../assets/capteur.jpg';
//import cameraImage from '../assets/camera.jpg';
//import borneImage from '../assets/borne.jpg';


const CampusMap = () => {
  // Groupe les objets par type
  const groupObjectsByType = () => {
    const grouped = {};
    fakeObjects.forEach((object) => {
      if (!grouped[object.type]) {
        grouped[object.type] = [];
      }
      grouped[object.type].push(object);
    });
    return grouped;
  };

  const groupedObjects = groupObjectsByType();
  const objectTypes = Object.keys(groupedObjects);

  // État de l’onglet actif
  const [selectedType, setSelectedType] = useState(objectTypes[0]);

  const getImageForType = (type) => {
    switch (type.toLowerCase()) {
      case 'salle':
        return salleImage;
      case 'thermostat':
        return thermostatImage;
      case 'capteur':
        //return capteurImage;
      case 'camera':
        //return cameraImage;
      case 'borne':
       // return borneImage;
      default:
        //return salleImage; // fallback
    }
  };

  return (
    <MapSection>
      <h2 style={{ textAlign: 'center' }}>Campus Connecté</h2>

      {/* Onglets */}
      <TabsWrapper>
        <Tabs>
          {objectTypes.map((type) => (
            <Tab key={type} active={selectedType === type} onClick={() => setSelectedType(type)}>
              {type.charAt(0).toUpperCase() + type.slice(1)}s
            </Tab>
          ))}
        </Tabs>
      </TabsWrapper>


      {/* Contenu de l’onglet actif */}
      <h3 style={{ textAlign: 'center' }}>
        {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}s
      </h3>
      <MapContainer>
        {groupedObjects[selectedType].map((object) => (
          <ObjectCard key={object.id}>
          <CardInner>
            <ObjectFront>
              <img
                src={getImageForType(object.type)}
                alt={object.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <h4>{object.name}</h4>
            </ObjectFront>
            <ObjectBack>
              <p>{object.description || 'Ajoutez une note personnalisée ici'}</p>
            </ObjectBack>
          </CardInner>
        </ObjectCard>
        
        
          ))}
      </MapContainer>

      <EventsList>
        <h3>Événements à venir</h3>
        {/* Liste des événements à venir */}
      </EventsList>
    </MapSection>
  );
};

export default CampusMap;
