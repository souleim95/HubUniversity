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
import { dataObjects, equipments } from '../data/projectData';
import {
  MapSection,
  MapContainer,
  ObjectCard,
  CardInner,
  ObjectFront,
  ObjectBack
} from '../styles/CampusMapStyles';

const CampusMap = () => {
  const categories = [
    {
      name: "Salles principales",
      items: ['salle101', 'amphiA', 'refectoire', 'labo_chimie', 'biblio', 'salle_sport']
    },
    {
      name: "Équipements salle101",
      items: ['proj_salle101', 'thermo123', 'light_salle101', 'store_salle101']
    },
    {
      name: "Équipements amphiA",
      items: ['proj_amphiA', 'thermo_amphiA', 'light_amphiA', 'store_amphiA', 'audio_amphiA']
    },
    {
      name: "Équipements refectoire",
      items: ['distributeur_boissons', 'distributeur_snacks', 'cafetiere_auto', 'microwave_ref', 
              'thermo_ref', 'light_ref', 'store_ref', 'air_quality', 'dishwasher']
    },
    {
      name: "Équipements labo_chimie",
      items: ['hotte_labo', 'detecteur_gaz']
    },
    {
      name: "Équipements biblio",
      items: ['scanner_biblio', 'bornes_pret', 'detecteur_rfid']
    },
    {
      name: "Équipements salle_sport",
      items: ['ventilation_gym', 'score_board', 'sono_gym']
    },
    {
      name: "Objets école",
      items: ['grille_ecole', 'light001', 'door001', 'panneau_info', 'alarme_incendie', 
              'eclairage_urgence', 'detecteur_fumee', 'cam_urgence']
    },
    {
      name: "Objets parking & extérieur",
      items: ['acces_parking', 'cam456', 'cam_entree', 'capteur789', 'eclairage_parking', 
              'borne_recharge', 'panneau_places', 'detecteur_parking']
    }
  ];

  const navigate = useNavigate();
  const [flippedCard, setFlippedCard] = useState(null); // Carte actuellement retournée
  const isLoggedIn = !!sessionStorage.getItem('user'); // Vérification connexion
  const [selectedType, setSelectedType] = useState("Salles principales"); // Type d'objet sélectionné

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
      for (const category of categories) {
        if (category.items.includes(obj.id)) {
          targetCategory = category.name;
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

  const getObjectImage = (object) => {
    const imageUrls = {
      // Salles principales
      'salle101': "data:image/jpeg;base64,...",
      'amphiA': "data:image/jpeg;base64,...",
      'refectoire': "data:image/jpeg;base64,...",
      'labo_chimie': "data:image/jpeg;base64,...",
      'biblio': "data:image/jpeg;base64,...",
      'salle_sport': "data:image/jpeg;base64,...",

      // Équipements salle101
      'proj_salle101': "data:image/jpeg;base64,...",
      'thermo123': "data:image/jpeg;base64,...",
      'light_salle101': "data:image/jpeg;base64,...",
      'store_salle101': "data:image/jpeg;base64,...",

      // Équipements amphiA
      'proj_amphiA': "data:image/jpeg;base64,...",
      'thermo_amphiA': "data:image/jpeg;base64,...",
      'light_amphiA': "data:image/jpeg;base64,...",
      'store_amphiA': "data:image/jpeg;base64,...",
      'audio_amphiA': "data:image/jpeg;base64,...",

      // Équipements refectoire
      'distributeur_boissons': "data:image/jpeg;base64,...",
      'distributeur_snacks': "data:image/jpeg;base64,...",
      'cafetiere_auto': "data:image/jpeg;base64,...",
      'microwave_ref': "data:image/jpeg;base64,...",
      'thermo_ref': "data:image/jpeg;base64,...",
      'light_ref': "data:image/jpeg;base64,...",
      'store_ref': "data:image/jpeg;base64,...",
      'air_quality': "data:image/jpeg;base64,...",
      'dishwasher': "data:image/jpeg;base64,...",

      // Équipements labo_chimie
      'hotte_labo': "data:image/jpeg;base64,...",
      'detecteur_gaz': "data:image/jpeg;base64,...",

      // Équipements biblio
      'scanner_biblio': "data:image/jpeg;base64,...",
      'bornes_pret': "data:image/jpeg;base64,...",
      'detecteur_rfid': "data:image/jpeg;base64,...",

      // Équipements salle_sport
      'ventilation_gym': "data:image/jpeg;base64,...",
      'score_board': "data:image/jpeg;base64,...",
      'sono_gym': "data:image/jpeg;base64,...",

      // Objets école
      'grille_ecole': "data:image/jpeg;base64,...",
      'light001': "data:image/jpeg;base64,...",
      'door001': "data:image/jpeg;base64,...",
      'panneau_info': "data:image/jpeg;base64,...",
      'alarme_incendie': "data:image/jpeg;base64,...",
      'eclairage_urgence': "data:image/jpeg;base64,...",
      'detecteur_fumee': "data:image/jpeg;base64,...",
      'cam_urgence': "data:image/jpeg;base64,...",

      // Objets parking & extérieur
      'acces_parking': "data:image/jpeg;base64,...",
      'cam456': "data:image/jpeg;base64,...",
      'cam_entree': "data:image/jpeg;base64,...",
      'capteur789': "data:image/jpeg;base64,...",
      'eclairage_parking': "data:image/jpeg;base64,...",
      'borne_recharge': "data:image/jpeg;base64,...",
      'panneau_places': "data:image/jpeg;base64,...",
      'detecteur_parking': "data:image/jpeg;base64,...",
    };

    return imageUrls[object.id] || "data:image/jpeg;base64,..."; // Image par défaut
  };

  return (
    <MapSection id="campus-section">
      <div className="campus-container">
        {/* Titre */}
        <div>
          <h2>Campus Connecté</h2>
        </div>

        {/* Boutons de catégories */}
        <div>
          <div>
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedType(category.name)}
                style={{
                  padding: '16px',
                  backgroundColor: selectedType === category.name 
                    ? '#18181B' 
                    : '#ffffff',
                  color: selectedType === category.name 
                    ? '#ffffff' 
                    : '#09090B',
                  border: '1px solid',
                  borderColor: selectedType === category.name 
                    ? '#18181B' 
                    : '#E4E4E7',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedType === category.name
                    ? '0 0 0 1px rgba(24, 24, 27, 0.05), 0 1px 2px rgba(24, 24, 27, 0.1)'
                    : '0 0 0 1px rgba(24, 24, 27, 0.05)',
                  width: '100%',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (selectedType !== category.name) {
                    e.target.style.backgroundColor = '#F4F4F5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedType !== category.name) {
                    e.target.style.backgroundColor = '#ffffff';
                  }
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Container des objets */}
        <MapContainer>
          {categories.find(cat => cat.name === selectedType)?.items.map((itemId) => {
            const object = dataObjects.find(obj => obj.id === itemId) || 
                          Object.values(equipments).flat().find(eq => eq.id === itemId);
            if (!object) return null;
            
            return (
              <ObjectCard 
                key={object.id}
                onClick={() => handleCardClick(object)}
                onDoubleClick={() => handleCardDoubleClick(object)}
              >
                <CardInner flipped={flippedCard === object.id}>
                  <ObjectFront>
                    <img
                      src={getObjectImage(object)}
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
            );
          })}
        </MapContainer>
      </div>
    </MapSection>
  );
};

export default CampusMap;
