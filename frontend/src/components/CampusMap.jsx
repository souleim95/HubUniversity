import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fakeObjects, equipments, categories } from '../data/fakeData';
import {
  MapSection,
  MapContainer,
  TabsWrapper,
  Tabs,
  Tab,
  ObjectCard,
  CardInner,
  ObjectFront,
  ObjectBack
} from '../styles/CampusMapStyles';

import salleImage from '../assets/salle.jpg';
import thermostatImage from '../assets/thermostat.jpg';

const CampusMap = () => {
  const navigate = useNavigate();
  const [flippedCard, setFlippedCard] = useState(null);
  const isLoggedIn = !!sessionStorage.getItem('user'); 

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
  const [selectedType, setSelectedType] = useState(objectTypes[0]);

  const getImageForType = (type) => {
    switch (type.toLowerCase()) {
      case 'salle':
        return salleImage;
      case 'thermostat':
        return thermostatImage;
      default:
        return salleImage;
    }
  };

  const handleCardClick = (obj) => {
    setFlippedCard(flippedCard === obj.id ? null : obj.id);
  };

  const handleCardDoubleClick = (obj) => {

    // si pas connecté alors on rien faire 
    if (!isLoggedIn) {
      return;
   }
    let targetCategory = null;
    let targetRoom = null;
    let targetEquipment = null;
   

    if (obj.type === 'Salle') {
      targetRoom = obj.id;
      targetCategory = 'salles';
    } else {
      targetEquipment = obj.id;
      for (const [roomId, roomEquips] of Object.entries(equipments)) {
        if (roomEquips.some(e => e.id === obj.id)) {
          targetRoom = roomId;
          break;
        }
      }
      for (const [key, value] of Object.entries(categories)) {
        if (value.items && value.items.includes(obj.id)) {
          targetCategory = key;
          break;
        }
      }
    }

    navigate('/dashboard', {
      state: {
        category: targetCategory,
        room: targetRoom,
        equipment: targetEquipment
      }
    });
  };

  return (
    <MapSection id="campus-section">
      <h2 style={{ 
        textAlign: 'center', 
        fontSize: '2.5em', 
        fontWeight: 'bold', 
        color: '#202124',
        marginBottom: '20px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        Campus Connecté
      </h2>

      <TabsWrapper>
        <Tabs>
          {objectTypes.map((type) => (
            <Tab 
              key={type} 
              active={selectedType === type} 
              onClick={() => setSelectedType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}s
            </Tab>
          ))}
        </Tabs>
      </TabsWrapper>

      <MapContainer>
        {groupedObjects[selectedType].map((object) => (
          <ObjectCard 
            key={object.id}
            onClick={() => handleCardClick(object)}
            onDoubleClick={() => handleCardDoubleClick(object)}
          >
            <CardInner flipped={flippedCard === object.id}>
              <ObjectFront>
                <img
                  src={getImageForType(object.type)}
                  alt={object.name}
                  style={{ 
                    width: '100%', 
                    height: '70%', 
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                />
                <h4>{object.name}</h4>
              </ObjectFront>
              <ObjectBack>
                <p>{object.description || 'Ajoutez une note personnalisée ici'}</p>
                <p style={{ 
                  marginTop: '10px', 
                  fontSize: '0.8rem', 
                  color: '#1a73e8' 
                }}>
                  Double-cliquez pour accéder aux détails
                </p>
              </ObjectBack>
            </CardInner>
          </ObjectCard>
        ))}
      </MapContainer>
    </MapSection>
  );
};

export default CampusMap;
