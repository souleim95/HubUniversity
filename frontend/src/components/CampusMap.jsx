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
      
      // Mapping des noms de catégories
      const categoryMapping = {
        "Objets école": "ecole",
        "Objets parking & extérieur": "parking",
        // Ajoutez d'autres mappings si nécessaire
      };

      for (const category of categories) {
        if (category.items.includes(obj.id)) {
          // Utilisez le mapping pour convertir le nom de catégorie
          targetCategory = categoryMapping[category.name] || category.name.toLowerCase();
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
      'salle101': "data:image/jpeg;base64,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",
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
