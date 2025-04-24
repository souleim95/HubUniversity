/*
 * Composant CampusMap : Carte interactive du campus
 * 
 * Fonctionnalités principales :
 * - Visualisation des objets connectés par type
 * - Navigation interactive entre les différentes catégories
 * - Interface de type "carte retournable" pour plus d'informations
 * - Navigation conditionnelle vers le tableau de bord
 */

// Imports et configuration
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataObjects, equipments, categories } from '../data/projectData';
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
import ChauffageImage from '../assets/thermostat.jpg';

const CampusMap = () => {
  // Gestion de la navigation et des états
  const navigate = useNavigate();
  const [flippedCard, setFlippedCard] = useState(null); // Carte actuellement retournée
  const isLoggedIn = !!sessionStorage.getItem('user'); // Vérification connexion

  // Fonction de regroupement des objets par type
  const groupObjectsByType = () => {
    const grouped = {};
    
    // Groupement des objets principaux
    dataObjects.forEach((object) => {
      if (!grouped[object.type]) {
        grouped[object.type] = [];
      }
      grouped[object.type].push(object);
    });

    // Groupement des équipements par salle
    Object.entries(equipments).forEach(([roomId, roomEquipments]) => {
      roomEquipments.forEach((equipment) => {
        if (!grouped[equipment.type]) {
          grouped[equipment.type] = [];
        }
        // Ajout des informations de la salle parente
        grouped[equipment.type].push({
          ...equipment,
          roomId,
          roomName: dataObjects.find(obj => obj.id === roomId)?.name || '',
          description: `${equipment.description}`
        });
      });
    });

    return grouped;
  };

  const groupedObjects = groupObjectsByType();
  const objectTypes = Object.keys(groupedObjects);
  const [selectedType, setSelectedType] = useState(objectTypes[0]); // Type d'objet sélectionné

  // Sélection de l'image selon le type d'objet
  const getImageForType = (type) => {
    switch (type.toLowerCase()) {
      case 'salle':
        return salleImage;
      case 'chauffage':
        return ChauffageImage;
      default:
        return salleImage; // Image par défaut
    }
  };

  // Gestionnaires d'événements pour les interactions
  const handleCardClick = (obj) => {
    // Gestion du retournement des cartes
    setFlippedCard(flippedCard === obj.id ? null : obj.id);
  };

  const handleCardDoubleClick = (obj) => {
    // Navigation vers le dashboard avec les paramètres appropriés

    // si pas connecté alors on fait rien
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
      {/* Interface utilisateur avec :
          - En-tête avec titre
          - Système d'onglets pour la navigation
          - Grille de cartes interactives */}
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
        {groupedObjects[selectedType]?.map((object) => (
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
