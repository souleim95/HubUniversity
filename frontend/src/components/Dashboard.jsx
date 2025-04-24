import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom'; 
import dashboardBackground from '../assets/dashboard.png';
import { 
  DashboardContainer,
  Header,
  CategoryContainer,
  CategoryButton,
  ObjectItem,
  ObjectHeader,
  IconWrapper,
  ObjectGrid,
  SubItemContainer,
  ControlButton
} from '../styles/DashboardStyles';
import { getIcon } from '../utils/iconUtils';
import {categories, equipments} from '../data/projectData';
import { useDashboardState } from '../hooks/useDashboard';
import { renderControls } from '../hooks/useDashboard_renderControls';

/*
 * Composant Dashboard : Interface principale de contrôle des objets connectés
 * 
 * Fonctionnalités principales :
 * - Gestion des points utilisateur et progression
 * - Contrôle en temps réel des objets et équipements
 * - Surveillance des états et statuts
 * - Gestion des alertes et maintenances
 * 
 * Architecture :
 * 1. États et Configurations
 *    - Gestion des états des objets et équipements
 *    - Configuration des points et niveaux
 *    - États des modals et interfaces
 * 
 * 2. Gestionnaires d'événements
 *    - handleObjectControl : Contrôle des objets principaux
 *    - handleEquipmentControl : Contrôle des équipements
 *    - handleSelectResult : Navigation et sélection
 * 
 * 3. Systèmes de surveillance
 *    - Surveillance des filtres de ventilation
 *    - Monitoring des niveaux de cafetière
 *    - Suivi des cycles de lave-vaisselle
 *    - Contrôle du micro-ondes
 * 
 * 4. Sécurité et Validation
 *    - Vérification des accès
 *    - Gestion des alertes incendie
 *    - Validation des actions utilisateur
 * 
 * 5. Interface utilisateur
 *    - Rendu conditionnel selon les rôles
 *    - Gestion des contrôles par type d'objet
 *    - Organisation par catégories
 * 
 * 6. Système de points
 *    - Attribution des points par action
 *    - Multiplicateurs selon les rôles
 *    - Niveaux et progressions
 */

const Dashboard = () => {
  const {
    objects, 
    selectedCategory, setSelectedCategory,
    selectedRoom, setSelectedRoom,
    roomEquipments, setRoomEquipments,
    tempInputValues, setTempInputValues,
    location, navigate, isLoggedIn,
    setUserPoints,
    isSchoolClosed, isFireAlarmActive,
    handleObjectControl, handleEquipmentControl,
  } = useDashboardState();

  const renderCategoryContent = () => {
    const handlers = {
      handleObjectControl,
      handleEquipmentControl,
      isSchoolClosed,
      isFireAlarmActive,
      selectedRoom,
      objects,
      tempInputValues,
      setTempInputValues
    };

    if (selectedRoom) {
      const room = objects.find(obj => obj.id === selectedRoom);
      if (!room) {
        setSelectedRoom(null);
        return (
          <div>
            <ControlButton onClick={() => setSelectedRoom(null)}>← Retour</ControlButton>
            <p style={{color: 'red', marginTop: '20px'}}>Erreur: Salle non trouvée.</p>
          </div>
        );
      }

      const isOccupied = room.status === 'Occupée';
      const currentEquipments = roomEquipments[selectedRoom] || equipments[selectedRoom] || [];

      return (
        <>
          <ControlButton onClick={() => setSelectedRoom(null)}>← Retour</ControlButton>
          <ObjectItem>
            <ObjectHeader>
              <IconWrapper>{getIcon('Salle')}</IconWrapper>
              <div>
                <strong>{room.name}</strong>
                <p>État: {room.status}</p>
                {room.capacity && <p>Capacité: {room.capacity} places</p>}
              </div>
            </ObjectHeader>
            {renderControls(room, false, handlers)}
          </ObjectItem>
          <SubItemContainer>
            {currentEquipments.map(equip => (
              <ObjectItem key={equip.id} id={`equipment-${equip.id}`}>
                <ObjectHeader>
                  <IconWrapper>{getIcon(equip.type)}</IconWrapper>
                  <div>
                    <strong>{equip.name}</strong>
                    <p>État: {equip.status}</p>
                    {equip.type === 'Chauffage' && equip.mode && (
                      <>
                        <p>Mode: {equip.mode}</p>
                        <p>Température: {equip.targetTemp}°C</p>
                      </>
                    )}
                  </div>
                </ObjectHeader>
                {!isOccupied && renderControls(equip, true, handlers)}
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
          .sort((a, b) => a.id === 'grille_ecole' ? -1 : b.id === 'grille_ecole' ? 1 : 0)
          .map(obj => (
            <ObjectItem 
              key={obj.id} 
              id={`equipment-${obj.id}`}
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
              {renderControls(obj, false, handlers)}
            </ObjectItem>
          ))}
      </ObjectGrid>
    );
  };

  //gestion des points 
  useEffect(() => {
    const updatePointsFromStorage = () => {
      setUserPoints(parseInt(sessionStorage.getItem('points') || '0'));
    };

    window.addEventListener('storage', updatePointsFromStorage);
    const intervalId = setInterval(updatePointsFromStorage, 1000); // Met à jour toutes les secondes

    return () => {
      window.removeEventListener('storage', updatePointsFromStorage);
      clearInterval(intervalId);
    };
  }, [setUserPoints]);

  // Initialisation des équipements lors de la sélection d'une salle
  useEffect(() => {
    if (selectedRoom && equipments[selectedRoom] && !roomEquipments[selectedRoom]) {
        // Initialise seulement si pas déjà fait pour éviter de reset les états modifiés
        setRoomEquipments(prev => ({
            ...prev,
            [selectedRoom]: equipments[selectedRoom].map(equip => ({ ...equip }))
        }));
    }
  }, [selectedRoom, roomEquipments, setRoomEquipments]); // Dépendance à selectedRoom et roomEquipments pour éviter boucle

  // Récupérer les sélections depuis l'état de la navigation (passé par SearchBox via Header)
  useEffect(() => {
    const navigationState = location.state;
    if (navigationState) {
      const { category, room, equipment } = navigationState;

      if (category) {
        setSelectedCategory(category);
      }
      if (room) {
        setSelectedRoom(room);
      }

      if (equipment) {
        // Faire défiler et mettre en évidence l'équipement
        setTimeout(() => {
          const element = document.getElementById(`equipment-${equipment}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlight-equipment');
            setTimeout(() => {
              element.classList.remove('highlight-equipment');
            }, 3000);
          } else {
            console.warn(`Équipement avec ID 'equipment-${equipment}' non trouvé dans le DOM pour la mise en évidence.`);
          }
        }, 500); // Délai pour laisser le temps au DOM de se mettre à jour
      }

      // Réinitialiser l'état de la navigation pour éviter sa réutilisation
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, navigate, location.pathname, setSelectedCategory, setSelectedRoom]); // Dépendance à l'état de la navigation et à navigate

  // useEffect pour la dégradation du filtre de la hotte
  useEffect(() => {
    const interval = setInterval(() => {
      setRoomEquipments(prevEquipments => {
        const updatedEquipments = { ...prevEquipments };
        let changed = false;
        Object.keys(updatedEquipments).forEach(roomId => {
          // Vérifie si la room existe dans les équipements avant de mapper
          if(updatedEquipments[roomId]) {
            updatedEquipments[roomId] = updatedEquipments[roomId].map(equip => {
              if (equip.id === 'hotte_labo' && equip.status === 'Actif' && equip.filterLife > 0) {
                // Augmentation du taux de dégradation
                const degradationRate = (equip.speed / equip.maxSpeed) * 1; // Était 0.1
                const newFilterLife = Math.max(0, equip.filterLife - degradationRate);
                let newFilterStatus = equip.filterStatus;
                if (newFilterLife < equip.filterChangeThreshold && equip.filterStatus === 'OK') {
                  newFilterStatus = 'À remplacer';
                }
                if (newFilterLife !== equip.filterLife || newFilterStatus !== equip.filterStatus) {
                  changed = true;
                  return {
                    ...equip,
                    filterLife: parseFloat(newFilterLife.toFixed(2)),
                    filterStatus: newFilterStatus
                  };
                }
              }
              return equip;
            });
          }
        });

        // Retourne le nouvel état seulement si quelque chose a changé
        return changed ? updatedEquipments : prevEquipments;
      });
    }, 5000); // Vérifie toutes les 5 secondes

    return () => clearInterval(interval); // Nettoyer l'intervalle
  }, [setRoomEquipments]); // Exécuter une seule fois au montage

  // Ajouter un useEffect pour la consommation de la cafetière
  useEffect(() => {
    const cafeInterval = setInterval(() => {
      setRoomEquipments(prevEquipments => {
        const updatedEquipments = { ...prevEquipments };
        let changed = false;

        Object.keys(updatedEquipments).forEach(roomId => {
          if (updatedEquipments[roomId]) {
            updatedEquipments[roomId] = updatedEquipments[roomId].map(equip => {
              // Consommation si la cafetière est active et non en nettoyage
              if (equip.id === 'cafetiere_auto' && (equip.status === 'Actif' || equip.status === 'Prêt')) {
                const isCleaning = equip.isCleaning;
                // Consommation plus rapide en mode nettoyage
                const waterConsumption = isCleaning ? 0.8 : 0.2; // Augmenté pour le nettoyage
                const beansConsumption = isCleaning ? 0 : 0.1; // Pas de consommation de grains pendant le nettoyage
                const newWaterLevel = Math.max(0, equip.waterLevel - waterConsumption);
                const newBeansLevel = Math.max(0, equip.beansLevel - beansConsumption);

                if (newWaterLevel !== equip.waterLevel || newBeansLevel !== equip.beansLevel) {
                  changed = true;
                  return {
                    ...equip,
                    waterLevel: parseFloat(newWaterLevel.toFixed(2)),
                    beansLevel: parseFloat(newBeansLevel.toFixed(2))
                  };
                }
              }
              return equip;
            });
          }
        });

        return changed ? updatedEquipments : prevEquipments;
      });
    }, 7000); // Vérifie toutes les 7 secondes

    return () => clearInterval(cafeInterval);
  }, [setRoomEquipments]);

  // Ajouter un useEffect pour la consommation du liquide de rinçage du lave-vaisselle
  useEffect(() => {
    const dishwasherInterval = setInterval(() => {
      setRoomEquipments(prevEquipments => {
        const updatedEquipments = { ...prevEquipments };
        let changed = false;

        Object.keys(updatedEquipments).forEach(roomId => {
          if (updatedEquipments[roomId]) {
            updatedEquipments[roomId] = updatedEquipments[roomId].map(equip => {
              // Consommation pour lave-vaisselle en cours
              if (equip.id === 'lave_vaisselle' && equip.status === 'En cours' && equip.timeRemaining > 0) {
                // Consommation selon programme
                let consumptionRate;
                switch(equip.program) {
                  case 'Intensif':
                    consumptionRate = 0.6; // Consommation plus élevée
                    break;
                  case 'Normal':
                    consumptionRate = 0.3;
                    break;
                  case 'Eco':
                    consumptionRate = 0.1; // Basse consommation
                    break;
                  case 'Rapide':
                    consumptionRate = 0.2;
                    break;
                  default:
                    consumptionRate = 0.3;
                }
                
                const newRinseAidLevel = Math.max(0, equip.rinseAidLevel - consumptionRate);
                const newTimeRemaining = Math.max(0, equip.timeRemaining - 1);
                const newStatus = newTimeRemaining === 0 ? 'Prêt' : equip.status;
                
                changed = true;
                return {
                  ...equip,
                  rinseAidLevel: parseFloat(newRinseAidLevel.toFixed(2)),
                  timeRemaining: newTimeRemaining,
                  status: newStatus
                };
              }
              return equip;
            });
          }
        });

        return changed ? updatedEquipments : prevEquipments;
      });
    }, 10000); // Vérifie toutes les 10 secondes

    return () => clearInterval(dishwasherInterval);
  }, [setRoomEquipments]);

  // Modifier l'useEffect pour le décompte du micro-ondes
  useEffect(() => {
    const microwaveInterval = setInterval(() => {
      setRoomEquipments(prevEquipments => {
        let changed = false;
        const updatedEquipments = { ...prevEquipments };

        Object.keys(updatedEquipments).forEach(roomId => {
          if (updatedEquipments[roomId]) {
            updatedEquipments[roomId] = updatedEquipments[roomId].map(equip => {
              // Chercher tous les types de micro-ondes possibles
              if (equip.type === 'Microwave' && equip.status === 'En cours' && equip.timer > 0) {
                
                const newTimer = equip.timer - 1;
                const newStatus = newTimer <= 0 ? 'Terminé' : 'En cours';
                
                changed = true;
                return {
                  ...equip,
                  timer: newTimer,
                  status: newStatus
                };
              }
              return equip;
            });
          }
        });
        
        return changed ? updatedEquipments : prevEquipments;
      });
    }, 1000); // Vérifie chaque seconde

    return () => clearInterval(microwaveInterval);
  }, [setRoomEquipments]);

  // Ajouter un useEffect pour la gestion du mode auto
  useEffect(() => {
    const autoModeInterval = setInterval(() => {
      setRoomEquipments(prevEquipments => {
        const updatedEquipments = { ...prevEquipments };
        let changed = false;

        Object.keys(updatedEquipments).forEach(roomId => {
          if (updatedEquipments[roomId]) {
            updatedEquipments[roomId] = updatedEquipments[roomId].map(equip => {
              // Pour les objets en mode auto
              if (equip.mode?.toLowerCase() === 'auto') {
                changed = true;
                
                // Pour le chauffage en mode auto
                if (equip.type === 'Chauffage') {
                  // Simuler une température extérieure qui varie
                  const hour = new Date().getHours();
                  let targetTemp;
                  
                  // Ajuster la température selon l'heure
                  if (hour >= 8 && hour <= 18) { // Heures de travail
                    targetTemp = 21 + Math.sin(Date.now() / 10000) * 0.5; // Variation autour de 21°C
                  } else { // Heures creuses
                    targetTemp = 19 + Math.sin(Date.now() / 10000) * 0.5; // Variation autour de 19°C
                  }
                  
                  return {
                    ...equip,
                    targetTemp: Math.round(targetTemp * 10) / 10,
                    status: 'Actif'
                  };
                }
                
                // Pour la ventilation en mode auto
                if (equip.type === 'Ventilation') {
                  // Simuler des variations de qualité d'air
                  const baseSpeed = 40;
                  const variation = Math.sin(Date.now() / 8000) * 10;
                  const newSpeed = Math.max(equip.minSpeed, Math.min(equip.maxSpeed, baseSpeed + variation));
                  
                  return {
                    ...equip,
                    speed: Math.round(newSpeed),
                    status: 'Actif'
                  };
                }
              }
              return equip;
            });
          }
        });

        return changed ? updatedEquipments : prevEquipments;
      });
    }, 3000); // Mise à jour toutes les 3 secondes

    return () => clearInterval(autoModeInterval);
  }, [setRoomEquipments]);

  
  if (!isLoggedIn) {
    //renvoie vers la page d'acceuil
    return <Navigate to="/" replace />;
  }
  
  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      <bodyDashboard 
        style={{ 
          backgroundImage: `url(${dashboardBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1
        }} 
      />
      <DashboardContainer>
        <Header>
          <h2>Mon Tableau de Bord</h2>
          <p>Suivez votre progression et gérez vos objets connectés</p>
        </Header>
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
    </div>
  );
};

export default Dashboard;
