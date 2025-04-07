import React from 'react';
import { fakeObjects } from '../data/fakeData'; // Import des objets
import { MapSection, MapContainer, EventsList } from '../styles/CampusMapStyles';
import { ObjectCard, ObjectFront, ObjectBack } from '../styles/InteractiveCardStyles'; // Styles des cartes interactives
import salleImage from '../assets/salle.jpg'; // Importer l'image de salle
//import thermostatImage from '../assets/thermostat.jpg'; // Importer l'image de thermostat

const CampusMap = () => {
  // Fonction pour obtenir les objets uniques par type
  const getUniqueObjects = () => {
    const seen = new Set();
    return fakeObjects.filter((object) => {
      if (seen.has(object.type)) {
        return false;
      }
      seen.add(object.type);
      return true;
    });
  };

  const uniqueObjects = getUniqueObjects(); // Récupérer les objets uniques

  // Fonction pour choisir l'image en fonction du type
  const getImageForType = (type) => {
    switch (type.toLowerCase()) {
      case 'salle':
        return salleImage;
      //case 'thermostat':
        //return thermostatImage;
      // Ajouter des cas pour d'autres types si nécessaire
      default:
        return null; // Image par défaut si type non défini
    }
  };

  return (
    <MapSection>
      <h2>Campus Connecté</h2>
      <MapContainer>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {uniqueObjects.map((object) => (
            <ObjectCard key={object.id}>
              {/* Face avant de la carte */}
              <ObjectFront>
                <img 
                  src={getImageForType(object.type)} // Utiliser la fonction pour obtenir l'image
                  alt={object.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <h4>{object.type}</h4> {/* Affichage du type comme titre */}
              </ObjectFront>

              {/* Face arrière de la carte */}
              <ObjectBack>
                <p><strong>Type:</strong> {object.type}</p>
                <p><strong>Status:</strong> {object.status}</p>
                {object.capacity && <p><strong>Capacité:</strong> {object.capacity} personnes</p>}
                {object.temperature && <p><strong>Température:</strong> {object.temperature}°C</p>}
                {object.nextReservation && <p><strong>Prochaine réservation:</strong> {new Date(object.nextReservation).toLocaleString() || 'Aucune réservation prévue'}</p>}
              </ObjectBack>
            </ObjectCard>
          ))}
        </div>
      </MapContainer>
      <EventsList>
        <h3>Événements à venir</h3>
        {/* Liste des événements à ajouter ici */}
      </EventsList>
    </MapSection>
  );
};

export default CampusMap;
