import React, { useState, useEffect } from 'react';
import { 
  DashboardContainer,
  ProfileCard,
  ObjectList,
  ObjectItem,
  LevelBox,
  ChangeLevelButton,
  ProgressBar,
  IconWrapper,
  Header,
  InfoSection,
  ObjectGrid,
  ObjectHeader,
  ObjectControls,
  ControlButton,
  RangeSlider,
  ValueDisplay,
  ToggleButton,
  SectionTitle,
  CategoryContainer,
  CategoryButton,
  SubItemContainer,
} from '../styles/DashboardStyles';

import { fakeUser, fakeObjects, categories, equipments } from '../data/fakeData';
import { 
  FaWifi, 
  FaThermometerHalf, 
  FaVideo, 
  FaRadiation, 
  FaLightbulb, 
  FaDoorClosed,
  FaChalkboard,
  FaVolumeUp,  
  FaUtensils,     
  FaCoffee,       
  FaFan,          
  FaPumpSoap,
  FaBook,
  FaRunning,
  FaFlask,
  FaBarcode,
  FaBullhorn,
  FaCarAlt,
  FaBars  // Pour l'icône de la grille
} from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState(fakeUser);
  const [objects, setObjects] = useState(fakeObjects);
  const [selectedCategory, setSelectedCategory] = useState('salles');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomEquipments, setRoomEquipments] = useState({});  // Nouveau state pour les équipements

  // Initialisation des équipements lors de la sélection d'une salle
  useEffect(() => {
    if (selectedRoom) {
      setRoomEquipments(equipments[selectedRoom] || {});
    }
  }, [selectedRoom]);

  const handleLevelChange = () => {
    if (user.points >= 3 && user.level === 'Débutant') {
      setUser({ ...user, level: 'Intermédiaire' });
    } else if (user.points >= 5 && user.level === 'Intermédiaire') {
      setUser({ ...user, level: 'Avancé' });
    } else if (user.points >= 7 && user.level === 'Avancé') {
      setUser({ ...user, level: 'Expert' });
    } else {
      alert('Pas assez de points pour changer de niveau');
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'Salle':
        return <FaChalkboard />;
      case 'Thermostat':
        return <FaThermometerHalf />;
      case 'Caméra':
        return <FaVideo />;
      case 'Capteur':
        return <FaRadiation />;
      case 'Éclairage':
        return <FaLightbulb />;
      case 'Porte':
        return <FaDoorClosed />;
      case 'Audio':
        return <FaVolumeUp />;
      case 'Distributeur':
        return <FaUtensils />;
      case 'Cafetiere':
        return <FaCoffee />;
      case 'Microwave':
        return <FaUtensils />;
      case 'AirSensor':
        return <FaFan />;
      case 'Dishwasher':
        return <FaPumpSoap />;
      case 'Scanner':
        return <FaBarcode />;
      case 'Ventilation':
        return <FaFan />;
      case 'Detecteur':
      case 'Securite':
        return <FaRadiation />;
      case 'Barriere':
        return <FaCarAlt />;
      case 'Panneau':
      case 'Affichage':
        return <FaBullhorn />;
      case 'Grille':
        return <FaBars />;
      default:
        return <FaWifi />;
    }
  };

  const isSchoolClosed = () => {
    const grille = objects.find(obj => obj.id === 'grille_ecole');
    return grille?.status === 'Fermée';
  };

  const handleObjectControl = (id, action, value) => {
    setObjects(objects.map(obj => {
      if (obj.id === id) {
        switch (action) {
          case 'salle':
            return { ...obj, status: value };
          case 'temperature':
            return { 
              ...obj, 
              targetTemp: parseInt(value),
            };
          case 'mode':
            return { 
              ...obj, 
              mode: value, 
            };
          case 'brightness':
            return { 
              ...obj, 
              brightness: parseInt(value),
              status: 'Allumé'
            };
          case 'light':
            return { 
              ...obj, 
              status: value ? 'Allumé' : 'Éteint',
            };
          case 'camera':
            return { ...obj, status: value ? 'Actif' : 'Inactif' };
          case 'door':
            return { ...obj, status: value ? 'Déverrouillée' : 'Verrouillée' };
          case 'sensor':
            return { ...obj, status: value ? 'Actif' : 'Inactif' };
          case 'volume':
            return { 
              ...obj, 
              volume: parseInt(value),
              status: 'Allumé'
            };
          case 'audio':
            return { 
              ...obj, 
              status: value ? 'Allumé' : 'Éteint'
            };
          case 'grille':
            const newStatus = value ? 'Ouverte' : 'Fermée';
            // Si on ferme la grille, désactiver tous les autres équipements
            if (!value) {
              objects.forEach(otherObj => {
                if (otherObj.id !== id && otherObj.status === 'Actif') {
                  handleObjectControl(otherObj.id, 'status', 'Inactif');
                }
              });
            }
            return { ...obj, status: newStatus };
          case 'barriere':
            return { ...obj, status: value ? 'Ouverte' : 'Fermée' };
          case 'store':
            return { 
              ...obj, 
              status: value ? 'Ouvert' : 'Fermé',
              position: value ? (obj.position || 100) : 0
            };
          case 'position':
            return { 
              ...obj, 
              position: parseInt(value),
              status: parseInt(value) > 0 ? 'Ouvert' : 'Fermé'
            };
          default:
            return obj;
        }
      }
      return obj;
    }));
  };

  const handleEquipmentControl = (id, action, value) => {
    setRoomEquipments(prev => {
      const currentRoom = selectedRoom;
      const updatedEquipments = { ...prev };
      
      // Si pas encore d'équipements pour cette salle, les initialiser depuis fakeData
      if (!updatedEquipments[currentRoom]) {
        updatedEquipments[currentRoom] = [...equipments[currentRoom]];
      }

      // Mise à jour de l'équipement spécifique
      updatedEquipments[currentRoom] = updatedEquipments[currentRoom].map(equip => {
        if (equip.id === id) {
          switch (action) {
            case 'light':
              return { ...equip, status: value ? 'Allumé' : 'Éteint' };
            case 'temperature':
              return { 
                ...equip, 
                targetTemp: parseInt(value),
                status: parseInt(value) === 0 ? 'Inactif' : 'Actif'
              };
            case 'mode':
              return { ...equip, mode: value };
            case 'brightness':
              return { 
                ...equip, 
                brightness: parseInt(value),
                status: value > 0 ? 'Allumé' : 'Éteint'
              };
            case 'volume':
              return { 
                ...equip, 
                volume: parseInt(value),
                status: parseInt(value) === 0 ? 'Inactif' : 'Actif'
              };
            case 'audio':
              return { ...equip, status: value ? 'Allumé' : 'Éteint' };
            case 'store':
              return {
                ...equip,
                status: value ? 'Ouvert' : 'Fermé',
                position: value ? 100 : 0
              };
            case 'store_position':
              const newPosition = parseInt(value);
              return {
                ...equip,
                position: newPosition,
                status: newPosition > 0 ? 'Ouvert' : 'Fermé'
              };
            case 'ventilation_speed':
              return { ...equip, speed: parseInt(value) };
            case 'ventilation_mode':
              return { ...equip, mode: value };
            case 'dishwasher_program':
              return {
                ...equip,
                program: value,
                status: 'En cours',
                timeRemaining: 60 // Exemple: 60 minutes
              };
            case 'scanner_status':
            case 'borne_status':
            case 'rfid_status':
              return { ...equip, status: value ? 'Actif' : 'Inactif' };
            case 'score':
              return {
                ...equip,
                score: { ...equip.score, ...value }
              };
            default:
              return equip;
          }
        }
        return equip;
      });

      return updatedEquipments;
    });
  };

  // Modifier useEffect pour initialiser correctement les équipements
  useEffect(() => {
    if (selectedRoom && equipments[selectedRoom]) {
      setRoomEquipments(prev => ({
        ...prev,
        [selectedRoom]: equipments[selectedRoom].map(equip => ({ ...equip }))
      }));
    }
  }, [selectedRoom]);

  const renderControls = (obj, isEquipment = false) => {
    // Si la grille est fermée et ce n'est pas la grille elle-même, désactiver tous les contrôles
    if (obj.id !== 'grille_ecole' && isSchoolClosed()) {
      return (
        <ObjectControls>
          <ValueDisplay style={{color: 'red'}}>École fermée - Contrôles désactivés</ValueDisplay>
        </ObjectControls>
      );
    }

    // Si c'est un équipement et que la salle n'est pas disponible, ne pas rendre les contrôles
    if (isEquipment && selectedRoom) {
      const room = objects.find(r => r.id === selectedRoom);
      if (room.status === 'Occupée') {
        return (
          <ObjectControls>
            <ValueDisplay style={{color: 'red'}}>Salle occupée - Contrôles désactivés</ValueDisplay>
          </ObjectControls>
        );
      }
    }

    // Si c'est une salle, toujours montrer les contrôles
    if (obj.type === 'Salle') {
      return (
        <ObjectControls>
          <ControlButton 
            active={obj.status === 'Disponible'}
            onClick={() => handleObjectControl(obj.id, 'salle', 'Disponible')}>
            Disponible
          </ControlButton>
          <ControlButton 
            active={obj.status === 'Occupée'}
            onClick={() => handleObjectControl(obj.id, 'salle', 'Occupée')}>
            Occuper
          </ControlButton>
        </ObjectControls>
      );
    }

    const handler = isEquipment ? handleEquipmentControl : handleObjectControl;
    
    switch (obj.type) {
      case 'Thermostat':
        return (
          <ObjectControls>
            <ValueDisplay>{obj.targetTemp}°C</ValueDisplay>
            <RangeSlider
              type="range"
              min="0"
              max="30"
              step="1"
              value={obj.targetTemp}
              onChange={(e) => handler(obj.id, 'temperature', e.target.value)}
              disabled={obj.mode === 'auto'}
            />
            <ToggleButton 
              active={obj.mode === 'auto'}
              onClick={() => handler(obj.id, 'mode', obj.mode === 'auto' ? 'manual' : 'auto')}>
              {obj.mode === 'auto' ? 'Mode Auto' : 'Mode Manuel'}
            </ToggleButton>
          </ObjectControls>
        );

      case 'Éclairage':
        return (
          <ObjectControls>
            <RangeSlider
              type="range"
              min="0"
              max="100"
              value={obj.status === 'Éteint' ? 0 : obj.brightness}
              onChange={(e) => handler(obj.id, 'brightness', e.target.value)}
              disabled={obj.status === 'Éteint'}
            />
            <ValueDisplay>{obj.status === 'Éteint' ? '0' : obj.brightness}%</ValueDisplay>
            <ToggleButton 
              active={obj.status === 'Allumé'}
              onClick={() => handler(obj.id, 'light', obj.status !== 'Allumé')}>
              {obj.status === 'Allumé' ? 'Éteindre' : 'Allumer'}
            </ToggleButton>
          </ObjectControls>
        );

      case 'Caméra':
        return (
          <ObjectControls>
            <ToggleButton 
              active={obj.status === 'Actif'}
              onClick={() => handler(obj.id, 'camera', obj.status !== 'Actif')}>
              {obj.status === 'Actif' ? 'Désactiver' : 'Activer'}
            </ToggleButton>
          </ObjectControls>
        );

      case 'Porte':
        return (
          <ObjectControls>
            <ToggleButton 
              active={obj.status === 'Déverrouillée'}
              onClick={() => handler(obj.id, 'door', obj.status !== 'Déverrouillée')}>
              {obj.status === 'Déverrouillée' ? 'Verrouiller' : 'Déverrouiller'}
            </ToggleButton>
          </ObjectControls>
        );

      case 'Capteur':
        return (
          <ObjectControls>
            <ToggleButton 
              active={obj.status === 'Actif'}
              onClick={() => handler(obj.id, 'sensor', obj.status !== 'Actif')}>
              {obj.status === 'Actif' ? 'Désactiver' : 'Activer'}
            </ToggleButton>
          </ObjectControls>
        );

      case 'Audio':
        return (
          <ObjectControls>
            <RangeSlider
              type="range"
              min="0"
              max="100"
              value={obj.status === 'Éteint' ? 0 : obj.volume}
              onChange={(e) => handler(obj.id, 'volume', e.target.value)}
              disabled={obj.status === 'Éteint'}
            />
            <ValueDisplay>{obj.status === 'Éteint' ? '0' : obj.volume}%</ValueDisplay>
            <ToggleButton 
              active={obj.status === 'Allumé'}
              onClick={() => handler(obj.id, 'audio', obj.status !== 'Allumé')}>
              {obj.status === 'Allumé' ? 'Éteindre' : 'Allumer'}
            </ToggleButton>
          </ObjectControls>
        );

      case 'Distributeur':
        return (
          <ObjectControls>
            <div>
              <h4>Niveaux de Stock:</h4>
              {Object.entries(obj.stock).map(([item, level]) => (
                <div key={item}>
                  <span>{item}: {level}%</span>
                </div>
              ))}
            </div>
            <ValueDisplay>Température: {obj.temperature}°C</ValueDisplay>
            <ToggleButton
              active={obj.status === 'Actif'}
              onClick={() => handler(obj.id, 'maintenance', !obj.needsMaintenance)}>
              {obj.needsMaintenance ? 'Maintenance Requise' : 'Fonctionnel'}
            </ToggleButton>
          </ObjectControls>
        );

      case 'Cafetiere':
        return (
          <ObjectControls>
            <ValueDisplay>Eau: {obj.waterLevel}%</ValueDisplay>
            <ValueDisplay>Grains: {obj.beansLevel}%</ValueDisplay>
            <ValueDisplay>Température: {obj.temperature}°C</ValueDisplay>
            <ToggleButton
              active={obj.mode !== 'Veille'}
              onClick={() => handler(obj.id, 'mode', obj.mode === 'Veille' ? 'Actif' : 'Veille')}>
              {obj.mode === 'Veille' ? 'Activer' : 'Mettre en Veille'}
            </ToggleButton>
          </ObjectControls>
        );

      case 'Microwave':
      case 'Dishwasher':
        return (
          <ObjectControls>
            <ValueDisplay>Programme: {obj.program || 'Aucun'}</ValueDisplay>
            {obj.timeRemaining > 0 && (
              <ValueDisplay>Temps restant: {obj.timeRemaining}min</ValueDisplay>
            )}
            <ToggleButton
              active={obj.status === 'En cours'}
              onClick={() => handler(obj.id, 'status', obj.status === 'Disponible' ? 'En cours' : 'Disponible')}>
              {obj.status === 'En cours' ? 'Arrêter' : 'Démarrer'}
            </ToggleButton>
          </ObjectControls>
        );

      case 'Ventilation':
        return (
          <ObjectControls>
            <RangeSlider
              type="range"
              min="0"
              max="100"
              value={obj.speed}
              onChange={(e) => handler(obj.id, 'speed', e.target.value)}
              disabled={obj.mode === 'auto'}
            />
            <ValueDisplay>Vitesse: {obj.speed}%</ValueDisplay>
            <ToggleButton
              active={obj.mode === 'auto'}
              onClick={() => handler(obj.id, 'mode', obj.mode === 'auto' ? 'manual' : 'auto')}>
              {obj.mode === 'auto' ? 'Auto' : 'Manuel'}
            </ToggleButton>
          </ObjectControls>
        );
      case 'Scanner':
      case 'Borne':
        return (
          <ObjectControls>
            <ToggleButton
              active={obj.status === 'Actif'}
              onClick={() => handler(obj.id, 'status', obj.status === 'Actif' ? 'Inactif' : 'Actif')}>
              {obj.status === 'Actif' ? 'Désactiver' : 'Activer'}
            </ToggleButton>
          </ObjectControls>
        );
      case 'Barriere':
        return (
          <ObjectControls>
            <ToggleButton
              active={obj.status === 'Ouverte'}
              onClick={() => handleObjectControl(obj.id, 'barriere', obj.status !== 'Ouverte')}>
              {obj.status === 'Ouverte' ? 'Fermer' : 'Ouvrir'}
            </ToggleButton>
          </ObjectControls>
        );
      case 'Grille':
        return (
          <ObjectControls>
            <ToggleButton
              active={obj.status === 'Ouverte'}
              onClick={() => handleObjectControl(obj.id, 'grille', obj.status !== 'Ouverte')}>
              {obj.status === 'Ouverte' ? 'Fermer' : 'Ouvrir'}
            </ToggleButton>
          </ObjectControls>
        );
      case 'Projecteur':
        return (
          <ObjectControls>
            <ToggleButton 
              active={obj.status === 'Allumé'}
              onClick={() => handler(obj.id, 'light', obj.status !== 'Allumé')}>
              {obj.status === 'Allumé' ? 'Éteindre' : 'Allumer'}
            </ToggleButton>
          </ObjectControls>
        );

      case 'Store':
        return (
          <ObjectControls>
            <RangeSlider
              type="range"
              min="0"
              max="100"
              step="1"  // Pour un mouvement plus fluide
              value={obj.position || 0}
              onChange={(e) => handler(obj.id, 'store_position', e.target.value)}
            />
            <ValueDisplay>Position: {obj.position || 0}%</ValueDisplay>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <ControlButton 
                onClick={() => handler(obj.id, 'store_position', 0)}>
                Fermer complètement
              </ControlButton>
              <ControlButton 
                onClick={() => handler(obj.id, 'store_position', 100)}>
                Ouvrir complètement
              </ControlButton>
            </div>
          </ObjectControls>
        );
      case 'AirSensor':
        return (
          <ObjectControls>
            <ValueDisplay>CO2: {obj.co2Level} ppm</ValueDisplay>
            <ValueDisplay>Humidité: {obj.humidity}%</ValueDisplay>
            <ValueDisplay>Dernière mesure: {new Date(obj.lastMeasure).toLocaleTimeString()}</ValueDisplay>
          </ObjectControls>
        );

      case 'Detecteur':
        return (
          <ObjectControls>
            <ValueDisplay>Batterie: {obj.batteryLevel}%</ValueDisplay>
            <ValueDisplay>État: {obj.status}</ValueDisplay>
            {obj.lastAlert && (
              <ValueDisplay>Dernière alerte: {new Date(obj.lastAlert).toLocaleString()}</ValueDisplay>
            )}
          </ObjectControls>
        );

      case 'Affichage':
        return (
          <ObjectControls>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
              <div>
                <label>Équipe 1</label>
                <input
                  type="number"
                  min="0"
                  value={obj.score.home}
                  onChange={(e) => handler(obj.id, 'score', { home: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label>Équipe 2</label>
                <input
                  type="number"
                  min="0"
                  value={obj.score.away}
                  onChange={(e) => handler(obj.id, 'score', { away: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <ToggleButton
              active={obj.status === 'Allumé'}
              onClick={() => handler(obj.id, 'light', obj.status !== 'Allumé')}>
              {obj.status === 'Allumé' ? 'Éteindre' : 'Allumer'}
            </ToggleButton>
          </ObjectControls>
        );

      default:
        return null;
    }
  };

  const renderCategoryContent = () => {
    if (selectedRoom) {
      const room = objects.find(obj => obj.id === selectedRoom);
      const isOccupied = room.status === 'Occupée';
      const currentEquipments = roomEquipments[selectedRoom] || equipments[selectedRoom] || [];

      return (
        <>
          <ControlButton onClick={() => setSelectedRoom(null)}>
            ← Retour
          </ControlButton>
          <ObjectItem>
            <ObjectHeader>
              <IconWrapper>{getIcon('Salle')}</IconWrapper>
              <div>
                <strong>{room.name}</strong>
                <p>État: {room.status}</p>
                {room.capacity && <p>Capacité: {room.capacity} places</p>}
              </div>
            </ObjectHeader>
            {renderControls(room)}
          </ObjectItem>
          <SubItemContainer>
            {currentEquipments.map(equip => (
              <ObjectItem key={equip.id}>
                <ObjectHeader>
                  <IconWrapper>{getIcon(equip.type)}</IconWrapper>
                  <div>
                    <strong>{equip.name}</strong>
                    <p>État: {equip.status}</p>
                    {equip.type === 'Thermostat' && (
                      <>
                        <p>Mode: {equip.mode}</p>
                        <p>Température: {equip.targetTemp}°C</p>
                      </>
                    )}
                    {equip.type === 'Éclairage' && (
                      <p>Luminosité: {equip.brightness}%</p>
                    )}
                    {equip.type === 'Audio' && (
                      <p>Volume: {equip.volume}%</p>
                    )}
                  </div>
                </ObjectHeader>
                {!isOccupied && renderControls(equip, true)}
              </ObjectItem>
            ))}
          </SubItemContainer>
        </>
      );
    }

    return (
      <ObjectGrid>
        {objects
          .filter(obj => categories[selectedCategory].items.includes(obj.id))
          .sort((a, b) => a.id === 'grille_ecole' ? -1 : b.id === 'grille_ecole' ? 1 : 0)  // Mettre la grille en premier
          .map(obj => (
            <ObjectItem 
              key={obj.id} 
              onClick={() => obj.type === 'Salle' ? setSelectedRoom(obj.id) : null}
              style={{ cursor: obj.type === 'Salle' ? 'pointer' : 'default' }}
            >
              <ObjectHeader>
                <IconWrapper>{getIcon(obj.type)}</IconWrapper>
                <div>
                  <strong>{obj.name}</strong>
                  <p>État: {obj.status}</p>
                </div>
              </ObjectHeader>
              {renderControls(obj)}
            </ObjectItem>
          ))}
      </ObjectGrid>
    );
  };

  return (
    <DashboardContainer>
      <Header>
        <h2>Mon Tableau de Bord</h2>
        <p>Suivez votre progression et gérez vos objets connectés</p>
      </Header>
      <InfoSection>
        <ProfileCard>
          <h3>Profil</h3>
          <p><strong>Pseudo :</strong> {user.login}</p>
          <p><strong>Âge :</strong> {user.age}</p>
          <p><strong>Genre :</strong> {user.genre}</p>
          <p><strong>Niveau :</strong> {user.level}</p>
          <p><strong>Points :</strong> {user.points}</p>
          
          <ProgressBar>
            <div style={{ width: `${(user.points / 10) * 100}%` }} />
          </ProgressBar>

          <LevelBox>Niveau actuel : {user.level}</LevelBox>
          <ChangeLevelButton onClick={handleLevelChange}>Changer de niveau</ChangeLevelButton>
        </ProfileCard>
      </InfoSection>

      <SectionTitle>Gestion des Équipements</SectionTitle>
      <CategoryContainer>
        {Object.keys(categories).map(cat => (
          <CategoryButton
            key={cat}
            active={selectedCategory === cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedRoom(null);
            }}
          >
            {categories[cat].name}
          </CategoryButton>
        ))}
      </CategoryContainer>
      {renderCategoryContent()}
    </DashboardContainer>
  );
};

export default Dashboard;
