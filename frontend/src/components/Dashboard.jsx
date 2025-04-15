import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dashboardBackground from '../assets/dashboard.png';
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
  bodyDashboard
} from '../styles/DashboardStyles';

import { fakeObjects, categories, equipments } from '../data/fakeData';
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
  FaBars,
  FaBroom,
  FaExclamationTriangle,
  FaMinus,
  FaPlus,
  FaFillDrip,
  FaWind,
  FaFilter,
  FaGasPump,
  FaSkullCrossbones,
  FaTint,
  FaSeedling,
  FaUserCheck,
  FaUserTimes,
  FaBookMedical,
  FaBookReader,
  FaBell,
  FaStopwatch,
  FaRegClock,
  FaDoorOpen,
  FaChargingStation,
  FaCar,
  FaFire,
  FaSmog,
} from 'react-icons/fa';

import { getIcon } from '../utils/iconUtils'; 

// Configuration pour le système de points et de niveaux
const POINTS_CONFIG = {
  // Points par interaction
  BASIC_INTERACTION: 5,    // Pour les interactions simples
  DEVICE_TOGGLE: 10,       // Pour allumer/éteindre un appareil
  ADJUST_SETTING: 15,      // Pour ajuster des paramètres (thermostat, volume)
  SPECIAL_TASK: 25,        // Pour des tâches spéciales (préparer café, utiliser microonde)
  
  // Multiplicateurs de points par rôle
  ROLE_MULTIPLIERS: {
    'eleve': 1,          // Élève : multiplicateur de base
    'professeur': 1.5,     // Professeur : 1.5x les points
    'directeur': 2         // Directeur : 2x les points
  },

  // Seuils de niveau
  LEVEL_THRESHOLDS: {
    'eleve': 0,
    'professeur': 200,    // 200 points pour devenir gestionnaire
    'directeur': 500      // 500 points pour devenir directeur
  }
};

// Fonction utilitaire pour mettre à jour les points en communiquant avec le backend
const updateUserPoints = async (pointsToAdd) => {
  // Récupérer le rôle actuel et appliquer le multiplicateur de points
  const currentRole = sessionStorage.getItem('role') || 'eleve';
  const roleMultiplier = POINTS_CONFIG.ROLE_MULTIPLIERS[currentRole] || 1;
  const adjustedPointsToAdd = pointsToAdd * roleMultiplier;
  
  // Récupérer l'identifiant de l'utilisateur (vous devez le stocker lors de la connexion/inscription)
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    console.error("L'identifiant de l'utilisateur n'est pas défini.");
    return;
  }
  
  try {
    // Envoyer la requête PATCH au backend pour mettre à jour le score
    const response = await fetch(`http://localhost:5001/api/users/${userId}/score`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ increment: adjustedPointsToAdd })
    });
    
    if (response.ok) {
      const data = await response.json();
      const newPoints = data.score;
      sessionStorage.setItem('points', newPoints.toString());
      
      // Vérifier si l'utilisateur a atteint un nouveau niveau
      let newRole = currentRole;
      
      if (currentRole === 'eleve' && newPoints >= POINTS_CONFIG.LEVEL_THRESHOLDS.professeur) {
        newRole = 'professeur';
      } else if (currentRole === 'professeur' && newPoints >= POINTS_CONFIG.LEVEL_THRESHOLDS.directeur) {
        newRole = 'directeur';
      }
      
      if (newRole !== currentRole) {
        sessionStorage.setItem('role', newRole);
        alert(`Félicitations ! Vous êtes maintenant ${newRole === 'professeur' ? 'Gestionnaire' : 'Directeur'} !`);
        window.location.reload();
      }
      
      return { points: newPoints, role: newRole, levelUp: newRole !== currentRole };
    } else {
      console.error("Erreur lors de la mise à jour du score :", response.statusText);
    }
  } catch (error) {
    console.error("Erreur réseau lors de la mise à jour du score", error);
  }
};


// Fonction pour afficher un toast de gain de points
const showPointsToast = (points) => {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.backgroundColor = '#4CAF50';
  toast.style.color = 'white';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '4px';
  toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
  toast.style.zIndex = '1000';
  toast.style.transition = 'all 0.5s ease-in-out';
  toast.style.opacity = '0';
  toast.textContent = `+${points} points !`;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 100);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
};

const Dashboard = () => {
  const [objects, setObjects] = useState(fakeObjects);
  const [selectedCategory, setSelectedCategory] = useState('salles');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomEquipments, setRoomEquipments] = useState({});
  const [tempInputValues, setTempInputValues] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const [userPoints, setUserPoints] = useState(parseInt(sessionStorage.getItem('points') || '0'));


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
  }, []);
  // Initialisation des équipements lors de la sélection d'une salle
  useEffect(() => {
    if (selectedRoom && equipments[selectedRoom] && !roomEquipments[selectedRoom]) {
        // Initialise seulement si pas déjà fait pour éviter de reset les états modifiés
        setRoomEquipments(prev => ({
            ...prev,
            [selectedRoom]: equipments[selectedRoom].map(equip => ({ ...equip }))
        }));
    }
  }, [selectedRoom]); // Dépendance à selectedRoom et roomEquipments pour éviter boucle

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
  }, [location.state, navigate]); // Dépendance à l'état de la navigation et à navigate

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
  }, []); // Exécuter une seule fois au montage


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
  }, []);

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
  }, []);

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
  }, []);

  const isSchoolClosed = () => {
    const grille = objects.find(obj => obj.id === 'grille_ecole');
    return grille?.status === 'Fermée';
  };

  // Helper function to check if fire alarm is active
  const isFireAlarmActive = () => {
    const fireAlarm = objects.find(obj => obj.id === 'alarme_incendie');
    return fireAlarm?.status === 'Alarme Incendie';
  };


  const handleObjectControl = (id, action, value) => {
    if (isFireAlarmActive() && action !== 'reset_fire_alarm') {
      return; // Prevent state update
    }

    // Attribuer des points selon le type d'action
    let pointsEarned = 0;
    
    // Définir les points en fonction du type d'action
    switch (action) {
      case 'temperature':
      case 'brightness':
      case 'volume':
      case 'position':
        pointsEarned = POINTS_CONFIG.ADJUST_SETTING;
        break;
      case 'light':
      case 'camera':
      case 'door':
      case 'sensor':
      case 'audio':
      case 'thermo_toggle':
      case 'grille':
      case 'barriere':
      case 'store':
        pointsEarned = POINTS_CONFIG.DEVICE_TOGGLE;
        break;
      case 'reset_fire_alarm':
      case 'reset_smoke_detector':
        pointsEarned = POINTS_CONFIG.SPECIAL_TASK;
        break;
      default:
        pointsEarned = POINTS_CONFIG.BASIC_INTERACTION;
    }
    
    // Attribuer les points si une action a été effectuée
    if (pointsEarned > 0) {
      const result = updateUserPoints(pointsEarned);
      showPointsToast(pointsEarned);
    }

    setObjects(objects.map(obj => {
      if (obj.id === id) {
        switch (action) {
          case 'salle':
            return { ...obj, status: value };
          case 'temperature':
            const newGlobalTemp = parseInt(value);
            return { 
              ...obj, 
              targetTemp: newGlobalTemp,
              status: newGlobalTemp <= 0 ? 'Inactif' : 'Actif',
              previousTargetTemp: newGlobalTemp > 0 ? newGlobalTemp : obj.previousTargetTemp
            };
          case 'mode':
            return { 
              ...obj, 
              mode: value.toLowerCase(), 
            };
          case 'brightness':
            const newGlobalBrightness = parseInt(value);
            return { 
              ...obj, 
              brightness: newGlobalBrightness,
              status: newGlobalBrightness <= 0 ? 'Éteint' : 'Allumé',
              previousBrightness: newGlobalBrightness > 0 ? newGlobalBrightness : obj.previousBrightness
            };
          case 'light':
            const currentGlobalBrightness = obj.brightness;
            return { 
              ...obj, 
              status: value ? 'Allumé' : 'Éteint',
              brightness: value ? (obj.previousBrightness > 0 ? obj.previousBrightness : 1) : 0,
              previousBrightness: !value && currentGlobalBrightness > 0 ? currentGlobalBrightness : (obj.previousBrightness || 1)
            };
          case 'camera':
            return { ...obj, status: value ? 'Actif' : 'Inactif' };
          case 'door':
            return { ...obj, status: value ? 'Déverrouillée' : 'Verrouillée' };
          case 'sensor':
            return { ...obj, status: value ? 'Actif' : 'Inactif' };
          case 'volume':
            const newGlobalVolume = parseInt(value);
            return { 
              ...obj, 
              volume: newGlobalVolume,
              status: newGlobalVolume === 0 ? 'Mute' : 'Allumé',
              previousVolume: newGlobalVolume > 0 ? newGlobalVolume : obj.previousVolume // Ne change pas si 0
            };
          case 'audio':
            const currentGlobalVolume = obj.volume;
            return { 
              ...obj, 
              status: value ? 'Allumé' : 'Mute',
              volume: value ? (obj.previousVolume > 0 ? obj.previousVolume : 1) : 0, // Retourne à 1 si previousVolume était 0
              previousVolume: !value && currentGlobalVolume > 0 ? currentGlobalVolume : (obj.previousVolume || 1) // Sauvegarde si > 0, sinon garde ou met 1
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
          case 'thermo_toggle':
            const currentGlobalTemp = obj.targetTemp;
            return {
              ...obj,
              status: value ? 'Actif' : 'Inactif',
              targetTemp: value ? (obj.previousTargetTemp > 0 ? obj.previousTargetTemp : 1) : 0,
              previousTargetTemp: !value && currentGlobalTemp > 0 ? currentGlobalTemp : (obj.previousTargetTemp || 1)
            };
          case 'update_message':
            return {
              ...obj,
              message: value
            };
          case 'clear_temp_input':
            setTempInputValues(prev => {
              const { [id]: _, ...rest } = prev;
              return rest;
            });
            return obj;
          case 'simulate_access_request': // For acces_parking
            const previousStatus = obj.status; // Store previous status
            // Use setTimeout to reset status after a delay
            setTimeout(() => {
              handleObjectControl(id, 'reset_access_status', previousStatus);
            }, 2000);
            return { ...obj, status: 'Demande en cours...' };
          case 'reset_access_status': // Used by setTimeout
            return {
              ...obj, 
              status: value // Restore previous status passed as value
            };
          case 'simulate_car_enter':
            if (obj.id === 'affichage_parking' && obj.freeSpots > 0) {
              return { ...obj, freeSpots: obj.freeSpots - 1 };
            }
            return obj;
          case 'simulate_car_leave':
            if (obj.id === 'affichage_parking' && obj.freeSpots < obj.totalSpots) {
              return { ...obj, freeSpots: obj.freeSpots + 1 };
            }
            return obj;
          case 'simulate_fire_alarm':
            return { ...obj, status: 'Alarme Incendie' };
          case 'reset_fire_alarm':
            return { ...obj, status: 'Normal' };
          case 'simulate_smoke_detection':
            return { ...obj, status: 'Fumée détectée' };
          case 'reset_smoke_detector':
            return { ...obj, status: 'Normal' };
          case 'simulate_charge_start':
            return { ...obj, status: 'En charge' };
          case 'simulate_charge_end':
            return { ...obj, status: 'Libre' };
          case 'toggle_service_status':
            const newChargerStatus = obj.status === 'Hors service' ? 'Libre' : 'Hors service';
            return { ...obj, status: newChargerStatus };
          default:
            return obj;
        }
      }
      return obj;
    }));
  };

  const handleEquipmentControl = (id, action, value) => {
    if (isFireAlarmActive()) {
      return; // Prevent state update
    }

    // Attribuer des points selon le type d'action
    let pointsEarned = 0;
    
    // Définir les points en fonction du type d'action
    switch (action) {
      case 'temperature':
      case 'brightness':
      case 'volume':
      case 'store_position':
      case 'ventilation_speed':
      case 'timer':
      case 'cafetiere_water':
      case 'cafetiere_beans':
        pointsEarned = POINTS_CONFIG.ADJUST_SETTING;
        break;
      case 'light':
      case 'audio':
      case 'store':
      case 'toggle':
        pointsEarned = POINTS_CONFIG.DEVICE_TOGGLE;
        break;
      case 'cafetiere_prepare':
      case 'cafetiere_pour':
      case 'microwave_start':
      case 'dishwasher_start':
        pointsEarned = POINTS_CONFIG.SPECIAL_TASK;
        break;
      default:
        pointsEarned = POINTS_CONFIG.BASIC_INTERACTION;
    }
    
    // Attribuer les points si une action a été effectuée
    if (pointsEarned > 0) {
      const result = updateUserPoints(pointsEarned);
      showPointsToast(pointsEarned);
    }

    setRoomEquipments(prev => {
      const currentRoom = selectedRoom;
      if (!currentRoom || !prev[currentRoom]) {
        return prev;
      }

      const updatedEquipmentsForRoom = prev[currentRoom].map(equip => {
        if (equip.id === id) {
          // Bloquer les interactions si la cafetière est en nettoyage (sauf pour arrêter le nettoyage)
          if (equip.type === 'Cafetiere' && equip.isCleaning && action !== 'cafetiere_clean') {
            return equip;
          }
          
          switch (action) {
            case 'light':
              const currentBrightness = equip.brightness;
                return { 
                  ...equip, 
                  status: value ? 'Allumé' : 'Éteint',
                brightness: value ? (equip.previousBrightness > 0 ? equip.previousBrightness : 1) : 0,
                previousBrightness: !value && currentBrightness > 0 ? currentBrightness : (equip.previousBrightness || 1)
                };
            case 'temperature':
              const newTemp = parseInt(value);
              return { 
                ...equip, 
                targetTemp: newTemp,
                status: newTemp <= 0 ? 'Inactif' : 'Actif',
                previousTargetTemp: newTemp > 0 ? newTemp : equip.previousTargetTemp
              };
            case 'mode':
              return { ...equip, mode: value.toLowerCase() };
            case 'brightness':
              const newBrightness = parseInt(value);
              return { 
                ...equip, 
                brightness: newBrightness,
                status: newBrightness <= 0 ? 'Éteint' : 'Allumé',
                previousBrightness: newBrightness > 0 ? newBrightness : equip.previousBrightness
              };
            case 'volume':
              const newVolume = parseInt(value);
              return { 
                ...equip, 
                volume: newVolume,
                status: newVolume === 0 ? 'Mute' : 'Allumé',
                previousVolume: newVolume > 0 ? newVolume : equip.previousVolume // Ne change pas si 0
              };
            case 'audio':
              const currentVolume = equip.volume;
              return {
                ...equip,
                status: value ? 'Allumé' : 'Mute',
                volume: value ? (equip.previousVolume > 0 ? equip.previousVolume : 1) : 0, // Retourne à 1 si previousVolume était 0
                previousVolume: !value && currentVolume > 0 ? currentVolume : (equip.previousVolume || 1) // Sauvegarde si > 0, sinon garde ou met 1
              };
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
              if (equip.id === 'hotte_labo' && equip.status === 'Actif') {
                const hotteSpeed = Math.max(equip.minSpeed, Math.min(equip.maxSpeed, parseInt(value)));
                return { ...equip, speed: hotteSpeed };
              }
              if (equip.id === 'ventilation_gym' && equip.mode === 'Manual') {
                const gymSpeed = parseInt(value);
                const effectiveGymSpeed = gymSpeed < equip.minSpeed ? 0 : gymSpeed;
              return {
                ...equip,
                  speed: Math.min(equip.maxSpeed, effectiveGymSpeed),
                  status: effectiveGymSpeed > 0 ? 'Actif' : 'Inactif' 
                };
              }
              return equip;
            case 'ventilation_gym_mode':
              const gymMode_newMode = value;
              let gymMode_newSpeed = equip.speed;
              let gymMode_newStatus = equip.status;
              if (gymMode_newMode === 'Off') {
                gymMode_newSpeed = 0;
                gymMode_newStatus = 'Inactif';
              } else if (gymMode_newMode === 'Manual' && (equip.status === 'Inactif' || equip.mode === 'Off')) {
                gymMode_newSpeed = equip.minSpeed;
                gymMode_newStatus = 'Actif';
              } else if (gymMode_newMode === 'Auto' && (equip.status === 'Inactif' || equip.mode === 'Off')) {
                gymMode_newStatus = 'Actif';
                gymMode_newSpeed = 40; // Vitesse auto simulée
              } else if (equip.mode === 'Auto' && gymMode_newMode === 'Manual') {
                 gymMode_newSpeed = equip.speed >= equip.minSpeed ? equip.speed : equip.minSpeed;
                 gymMode_newStatus = 'Actif';
              } else if (equip.mode === 'Manual' && gymMode_newMode === 'Auto'){
                  gymMode_newStatus = 'Actif';
                  gymMode_newSpeed = 40; // Vitesse auto simulée
              }
              if (gymMode_newMode !== 'Off') gymMode_newStatus = 'Actif';
              
              return {
                ...equip,
                mode: gymMode_newMode,
                speed: gymMode_newSpeed,
                status: gymMode_newStatus
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
            case 'maintenance':
              return { 
                ...equip, 
                needsMaintenance: value,
                status: value ? 'Maintenance' : 'Actif'
              };
            case 'cafetiere_mode':
              return {
                ...equip,
                mode: value,
                status: value === 'Veille' ? 'Inactif' : 'Actif'
              };
            case 'cafetiere_toggle':
              return {
                ...equip,
                status: value ? 'Actif' : 'Inactif'
              };
            case 'cafetiere_clean':
              return {
                ...equip,
                isCleaning: value,
                status: value ? 'Nettoyage' : 'Actif' // Mise à jour du statut pour refléter le nettoyage
              };
            case 'ventilation_status':
              return {
                ...equip,
                status: value ? 'Actif' : 'Inactif',
                speed: value ? equip.speed : 0
              };
            case 'ventilation_filter':
              return {
                ...equip,
                filterStatus: value ? 'OK' : 'À remplacer',
                lastMaintenance: value ? new Date().toISOString() : equip.lastMaintenance
              };
            case 'detector_battery':
              const batteryLevel = parseInt(value);
              return {
                ...equip,
                batteryLevel,
                status: batteryLevel < 20 ? 'Batterie faible' : 'Actif'
              };
            case 'detector_alert':
              return {
                ...equip,
                lastAlert: value ? new Date().toISOString() : null,
                status: value ? 'Alerte' : 'Actif'
              };
            case 'scanner_action':
              return {
                ...equip,
                status: value ? 'En cours' : 'Disponible',
                lastScan: value ? new Date().toISOString() : equip.lastScan
              };
            case 'borne_transaction':
              return {
                ...equip,
                status: value ? 'En cours' : 'Disponible',
                lastTransaction: value ? new Date().toISOString() : equip.lastTransaction
              };
            case 'take_provision':
              if (!equip.stock || !equip.capacity) return equip;
              const currentStock = equip.stock[value] || 0;
              if (currentStock <= 0) return equip;
              
              return {
                ...equip,
                stock: {
                  ...equip.stock,
                  [value]: currentStock - 1
                }
              };
            case 'refill_stock':
              if (!equip.stock || !equip.capacity) return equip;
              
              const newStock = {};
              Object.keys(equip.capacity).forEach(item => {
                newStock[item] = equip.capacity[item];
              });
              
              return {
                ...equip,
                stock: newStock
              };
            case 'microwave_timer':
              return {
                ...equip,
                timer: parseInt(value)
              };
            case 'microwave_start_stop':
              return {
                ...equip,
                status: value ? 'En cours' : 'Prêt'
              };
            case 'microwave_door':
              return {
                ...equip,
                doorStatus: value ? 'Ouverte' : 'Fermée',
                status: value ? 'Prêt' : equip.status // Si on ouvre la porte, ça arrête la cuisson
              };
            case 'dishwasher_select_program':
              return {
                ...equip,
                program: value
              };
            case 'dishwasher_start_stop':
              if (value && equip.rinseAidLevel <= 0) {
                // Ne pas démarrer si pas de liquide de rinçage
                return equip;
              }
              
              // Calculer le temps selon le programme
              let cycleTime;
              let initialConsumption = 0; // Consommation immédiate au démarrage
              
              switch(equip.program) {
                case 'Intensif':
                  cycleTime = 120; // 2 heures
                  initialConsumption = 25; // 25% de consommation immédiate
                  break;
                case 'Normal':
                  cycleTime = 60; // 1 heure
                  initialConsumption = 15; // 15% de consommation immédiate
                  break;
                case 'Eco':
                  cycleTime = 90; // 1 heure et demi
                  initialConsumption = 8; // 8% de consommation immédiate
                  break;
                case 'Rapide':
                  cycleTime = 30; // 30 minutes
                  initialConsumption = 12; // 12% de consommation immédiate
                  break;
                default:
                  cycleTime = 60;
                  initialConsumption = 15;
              }
              
              // Calculer le nouveau niveau de liquide de rinçage (seulement si on démarre)
              const newRinseAidLevel = value 
                ? Math.max(0, equip.rinseAidLevel - initialConsumption)
                : equip.rinseAidLevel;
              
              return {
                ...equip,
                status: value ? 'En cours' : 'Prêt',
                timeRemaining: value ? cycleTime : 0,
                rinseAidLevel: parseFloat(newRinseAidLevel.toFixed(2)) // Appliquer la consommation immédiate
              };
            case 'fill_rinse_aid':
              return {
                ...equip,
                rinseAidLevel: equip.rinseAidMaxCapacity || 100
              };
            case 'score_reset':
              return {
                ...equip,
                score: { home: 0, away: 0 }
              };
            case 'score_increment':
              if (equip.status !== 'Allumé') return equip;
              const [team, pointsStr] = value.split(':');
              const points = parseInt(pointsStr);
              const currentScore = equip.score[team] || 0;
              return {
                ...equip,
                score: { ...equip.score, [team]: currentScore + points }
              };
            case 'scoreboard_toggle':
               if (equip.id === 'score_board') {
                  return { ...equip, status: value ? 'Allumé' : 'Éteint' };
               }
               return equip;
            case 'scoreboard_timer':
              if (equip.id === 'score_board') {
                const newTimer = Math.max(0, parseInt(value) || 0); // Ensure non-negative integer
                return { ...equip, timer: newTimer };
              }
              return equip;
            case 'scoreboard_period':
               if (equip.id === 'score_board') {
                 const newPeriod = Math.max(1, parseInt(value) || 1); // Ensure integer >= 1
                 return { ...equip, period: newPeriod };
               }
               return equip;
            case 'sono_input':
              return { ...equip, input: value };
            case 'ventilate_room':
              const newCO2 = Math.max(400, equip.co2Level - 200);
              const newHumidity = Math.max(30, equip.humidity - 5);
              return {
                ...equip,
                co2Level: newCO2,
                humidity: newHumidity,
                lastMeasure: new Date().toISOString()
              };
            case 'ventilation_toggle':
              const minSpeed = equip.minSpeed || 20;
              return {
                ...equip,
                status: value ? 'Actif' : 'Éteint',
                speed: value ? minSpeed : 0
              };
            case 'replace_filter':
              return {
                ...equip,
                filterStatus: 'OK',
                filterLife: 100,
                lastMaintenance: new Date().toISOString()
              };
            case 'simulate_gas_detection':
              if (equip.status === 'Inactif') return equip;
              const detectedGas = value || 'Ammonia';
              return {
                ...equip,
                status: 'Alerte',
                detectedGases: [...equip.detectedGases, detectedGas],
                lastAlert: new Date().toISOString()
              };
            case 'reset_gas_alert':
              const nextStatus = equip.status === 'Inactif' ? 'Inactif' : 'Actif';
              return {
                ...equip,
                status: nextStatus,
                detectedGases: [],
                lastAlert: null
              };
            case 'detector_toggle':
              return {
                ...equip,
                status: value ? 'Actif' : 'Inactif'
              };
            case 'fill_water':
              return {
                ...equip,
                waterLevel: 100
              };
            case 'fill_beans':
              return {
                ...equip,
                beansLevel: 100
              };
            case 'simulate_scan':
              const scanSuccess = Math.random() > 0.2;
              const scannedItem = scanSuccess
                ? { id: `ISBN${Math.floor(Math.random() * 1000)}`, title: 'Livre Aléatoire' }
                : null;
              const result = scanSuccess ? 'success' : (Math.random() > 0.5 ? 'not_found' : 'error');

              return {
                ...equip,
                status: 'Disponible',
                lastScan: new Date().toISOString(),
                lastScannedItem: scannedItem,
                scanResult: result
              };
            case 'simulate_auth':
              const authSuccess = value;
                return {
                  ...equip,
                authState: authSuccess ? 'authenticated' : 'failed',
                status: authSuccess ? 'Authentifié' : 'Échec Authentification'
              };
            case 'simulate_transaction':
              const transactionType = value;
              const transactionItem = `ISBN${Math.floor(Math.random() * 1000)}`;
              const transactionUser = 'user123';
              return {
                ...equip,
                status: 'Actif',
                authState: 'idle',
                lastTransaction: new Date().toISOString(),
                lastTransactionDetails: {
                  type: transactionType,
                  itemId: transactionItem,
                  userId: transactionUser
                }
              };
            case 'simulate_rfid_alarm':
              const alarmItem = { id: `ISBN${Math.floor(Math.random() * 1000)}`, title: 'Objet suspect' };
              return {
                ...equip,
                status: 'Alarme',
                lastDetection: new Date().toISOString(),
                alarmTriggerItem: alarmItem
              };
            case 'reset_rfid_alarm':
              return {
                ...equip,
                status: 'Actif',
                lastDetection: null,
                alarmTriggerItem: null
              };
            case 'thermo_toggle':
              const currentTemp = equip.targetTemp;
              return {
                ...equip,
                status: value ? 'Actif' : 'Inactif',
                targetTemp: value ? (equip.previousTargetTemp > 0 ? equip.previousTargetTemp : 1) : 0,
                previousTargetTemp: !value && currentTemp > 0 ? currentTemp : (equip.previousTargetTemp || 1)
              };
            case 'reset_microwave':
              return {
                ...equip,
                status: 'Prêt',
                showCompletionMessage: false
              };
            default:
              return equip;
          }
        }
        return equip;
      });
      
      return {
        ...prev,
        [currentRoom]: updatedEquipmentsForRoom
      };
    });
  };

  const renderControls = (obj, isEquipment = false) => {
    const alwaysActiveObjects = [
      'detecteur_fumee',
      'alarme_incendie', 
      'cam_urgence',
      'cam456',
      'cam_entree',
      'capteur789',
      'detecteur_parking',
      'acces_parking'
    ];

    if (obj.id !== 'grille_ecole' && isSchoolClosed() && !alwaysActiveObjects.includes(obj.id)) {
      return (
        <ObjectControls>
          <ValueDisplay style={{color: 'red'}}>École fermée - Contrôles désactivés</ValueDisplay>
        </ObjectControls>
      );
    }

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

    if (isFireAlarmActive() && obj.id !== 'alarme_incendie') {
      return (
        <ObjectControls>
          <ValueDisplay style={{color: 'red', fontWeight: 'bold'}}>ALARME INCENDIE - CONTRÔLES BLOQUÉS</ValueDisplay>
        </ObjectControls>
      );
    }

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
            <ValueDisplay>{obj.status === 'Inactif' ? 'Inactif' : `${obj.targetTemp}°C`}</ValueDisplay>
            <RangeSlider
              type="range"
              min="0"
              max="30"
              step="1"
              value={obj.status === 'Inactif' ? 0 : obj.targetTemp}
              onChange={(e) => handler(obj.id, 'temperature', e.target.value)}
              disabled={obj.status === 'Inactif' || obj.mode?.toLowerCase() === 'auto'}
            />
            <ToggleButton
              active={obj.status === 'Actif'}
              onClick={() => handler(obj.id, 'thermo_toggle', obj.status !== 'Actif')}>
              {obj.status === 'Actif' ? 'Désactiver' : 'Activer'}
            </ToggleButton>
            <ToggleButton 
              active={obj.mode?.toLowerCase() === 'auto'}
              onClick={() => handler(obj.id, 'mode', obj.mode?.toLowerCase() === 'auto' ? 'manual' : 'auto')}
              disabled={obj.status === 'Inactif'}>
              {obj.mode?.toLowerCase() === 'auto' ? 'Mode Auto' : 'Mode Manuel'}
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
        if (obj.id === 'air_quality') {
            const co2High = obj.co2Level > obj.co2Threshold;
            return (
                <ObjectControls>
                <ValueDisplay style={{ color: co2High ? 'red' : 'inherit' }}>
                    CO2: {obj.co2Level} ppm {co2High && <FaExclamationTriangle title="Niveau élevé" />}
                </ValueDisplay>
                <ValueDisplay>Humidité: {obj.humidity}%</ValueDisplay>
                <ValueDisplay>Dernière mesure: {new Date(obj.lastMeasure).toLocaleTimeString()}</ValueDisplay>
                <ControlButton
                    onClick={() => handler(obj.id, 'ventilate_room')}
                    style={{ marginTop: '10px' }}>
                    <FaWind /> Aérer la pièce
                </ControlButton>
                </ObjectControls>
            );
        }
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
              value={obj.status === 'Mute' ? 0 : obj.volume}
              onChange={(e) => handler(obj.id, 'volume', e.target.value)}
              disabled={obj.status === 'Mute'}
            />
            <ValueDisplay>{obj.status === 'Mute' ? '0' : obj.volume}%</ValueDisplay>
            <ToggleButton 
              active={obj.status === 'Allumé'}
              onClick={() => handler(obj.id, 'audio', obj.status !== 'Allumé')}>
              {obj.status === 'Allumé' ? 'Mute' : 'Démute'}
            </ToggleButton>
          </ObjectControls>
        );

      case 'Distributeur':
        return (
          <ObjectControls>
            <div>
              <h4>Niveaux de Stock:</h4>
              {Object.entries(obj.stock).map(([item, level]) => (
                <div key={item} style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ display: 'inline-block', width: '80px' }}>{item}:</span>
                  <progress value={level} max={obj.capacity[item]} style={{ width: '50%', marginRight: '5px' }}></progress>
                  <span style={{ marginRight: '10px' }}>{level}/{obj.capacity[item]}</span>
                  <ControlButton
                    onClick={() => handler(obj.id, 'take_provision', item)}
                    disabled={level === 0 || obj.status === 'Maintenance'}
                    title={`Prendre un(e) ${item}`}
                    style={{ padding: '2px 5px', minWidth: 'auto' }}>
                    <FaMinus />
                  </ControlButton>
                </div>
              ))}
            </div>
            <ValueDisplay>Température: {obj.temperature}°C</ValueDisplay>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <ControlButton onClick={() => handler(obj.id, 'refill_stock')}>
                Réapprovisionner
              </ControlButton>
            <ToggleButton
                active={obj.needsMaintenance}
              onClick={() => handler(obj.id, 'maintenance', !obj.needsMaintenance)}>
                {obj.needsMaintenance ? 'Maintenance Requise' : 'Fonctionnel'}
            </ToggleButton>
            </div>
          </ObjectControls>
        );

      case 'Cafetiere':
        const waterLow = obj.waterLevel < obj.waterLowThreshold;
        const beansLow = obj.beansLevel < obj.beansLowThreshold;
        const isCleaning = obj.isCleaning;
        return (
          <ObjectControls>
            <ValueDisplay>État: {isCleaning ? 'Nettoyage en cours' : obj.status}</ValueDisplay>
            <ValueDisplay>Mode: {obj.mode}</ValueDisplay>
            <div style={{ margin: '5px 0' }}>
              <span style={{ color: waterLow ? 'orange' : 'inherit' }}>
                Eau: {waterLow && <FaExclamationTriangle title="Niveau bas" />}
              </span>
              <progress value={obj.waterLevel} max="100" style={{ width: '60%' }}></progress>
              <span> {obj.waterLevel}% </span>
              <ControlButton
                onClick={() => handler(obj.id, 'fill_water')}
                disabled={obj.waterLevel === 100 || isCleaning}
                title="Remplir Eau">
                <FaTint />
              </ControlButton>
            </div>
            <div style={{ margin: '5px 0' }}>
              <span style={{ color: beansLow ? 'orange' : 'inherit' }}>
                Grains: {beansLow && <FaExclamationTriangle title="Niveau bas" />}
              </span>
              <progress value={obj.beansLevel} max="100" style={{ width: '60%' }}></progress>
              <span> {obj.beansLevel}% </span>
              <ControlButton
                onClick={() => handler(obj.id, 'fill_beans')}
                disabled={obj.beansLevel === 100 || isCleaning}
                title="Remplir Grains">
                <FaSeedling />
              </ControlButton>
            </div>
            <ValueDisplay>Température: {obj.temperature}°C</ValueDisplay>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <ToggleButton
                active={obj.status === 'Actif' || obj.status === 'Prêt'}
                onClick={() => handler(obj.id, 'cafetiere_toggle', obj.status === 'Inactif' || obj.status === 'Veille')}
                disabled={isCleaning || waterLow || beansLow}>
                {obj.status === 'Inactif' || obj.status === 'Veille' ? 'Allumer' : 'Éteindre'}
            </ToggleButton>
              <ControlButton
                onClick={() => handler(obj.id, 'cafetiere_clean', !isCleaning)}
                disabled={obj.status === 'Inactif' || obj.status === 'Veille' || waterLow}
                style={{ backgroundColor: isCleaning ? '#e74c3c' : undefined }}>
                {isCleaning ? <><FaBroom /> Arrêter Nettoyage</> : <><FaBroom /> Nettoyer</>}
              </ControlButton>
            </div>
            {isCleaning && (
              <ValueDisplay style={{ color: 'orange', marginTop: '10px' }}>
                Nettoyage en cours - Autres commandes désactivées
              </ValueDisplay>
            )}
          </ObjectControls>
        );

      case 'Microwave':
        const isCooking = obj.status === 'En cours';
        const isFinished = obj.status === 'Terminé';
        const doorOpen = obj.doorStatus === 'Ouverte';
        
        return (
          <ObjectControls>
            <ValueDisplay style={{ fontWeight: 'bold', color: isFinished ? 'red' : 'inherit' }}>
              État: {obj.status}
            </ValueDisplay>
            <ValueDisplay>Porte: {obj.doorStatus}</ValueDisplay>
            
            {/* Timer avec animation */}
            <div 
              style={{ 
                margin: '15px 0', 
                textAlign: 'center',
                padding: '8px',
                backgroundColor: '#000',
                color: isFinished ? '#ff3b30' : (isCooking ? '#0f0' : '#333'),
                fontFamily: 'monospace',
                fontSize: '2em',
                borderRadius: '4px',
                letterSpacing: '2px',
                boxShadow: isCooking ? '0 0 8px #0f0' : 'none',
                animation: isCooking ? 'pulse 1s infinite' : 'none'
              }}
            >
              {obj.timer} sec
              {isCooking && (
                <span style={{marginLeft: '8px', display: 'inline-block'}}>
                  ▶
                </span>
              )}
            </div>
            
            <div style={{ margin: '10px 0' }}>
              <label>Temps (sec): </label>
              <RangeSlider
                type="range"
                min="0"
                max={obj.maxTime || 180}
                step="10"
                value={obj.timer}
                onChange={(e) => handler(obj.id, 'microwave_timer', e.target.value)}
                disabled={isCooking || doorOpen || isFinished}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <ControlButton 
                  onClick={() => handler(obj.id, 'microwave_timer', Math.max(0, obj.timer - 10))}
                  disabled={isCooking || doorOpen || obj.timer <= 0 || isFinished}>
                  <FaMinus />
                </ControlButton>
                <ValueDisplay>{obj.timer}s</ValueDisplay>
                <ControlButton 
                  onClick={() => handler(obj.id, 'microwave_timer', Math.min(obj.maxTime || 180, obj.timer + 10))}
                  disabled={isCooking || doorOpen || obj.timer >= (obj.maxTime || 180) || isFinished}>
                  <FaPlus />
                </ControlButton>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <ToggleButton
                active={isCooking}
                onClick={() => handler(obj.id, isFinished ? 'reset_microwave' : 'microwave_start_stop', !isCooking)}
                disabled={(obj.timer === 0 && !isCooking && !isFinished) || doorOpen}
                style={{ 
                  backgroundColor: isFinished ? '#2ecc71' : (isCooking ? '#e74c3c' : (obj.timer > 0 ? '#2ecc71' : undefined)),
                  flex: '1',
                  animation: isFinished ? 'pulse 1s infinite' : 'none'
                }}>
                {isFinished ? 'Réinitialiser' : (isCooking ? 'Arrêter' : 'Démarrer')}
              </ToggleButton>
              <ToggleButton
                active={doorOpen}
                onClick={() => handler(obj.id, 'microwave_door', !doorOpen)}
                disabled={isCooking}
                style={{ flex: '1' }}>
                {doorOpen ? 'Fermer Porte' : 'Ouvrir Porte'}
              </ToggleButton>
            </div>
            
            {isCooking && (
              <div style={{ 
                marginTop: '15px', 
                textAlign: 'center', 
                color: '#e74c3c',
                padding: '5px',
                border: '1px solid #e74c3c',
                borderRadius: '4px'
              }}>
                Cuisson en cours...
              </div>
            )}
            
            {isFinished && (
              <div style={{ 
                marginTop: '15px', 
                textAlign: 'center', 
                backgroundColor: '#e74c3c',
                color: 'white',
                padding: '10px',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}>
                CUISSON TERMINÉE !
              </div>
            )}
          </ObjectControls>
        );

      case 'AirSensor':
        const co2High = obj.co2Level > obj.co2Threshold;
        return (
          <ObjectControls>
            <ValueDisplay style={{ color: co2High ? 'red' : 'inherit' }}>
              CO2: {obj.co2Level} ppm {co2High && <FaExclamationTriangle title="Niveau élevé" />}
            </ValueDisplay>
            <ValueDisplay>Humidité: {obj.humidity}%</ValueDisplay>
            <ValueDisplay>Dernière mesure: {new Date(obj.lastMeasure).toLocaleTimeString()}</ValueDisplay>
            <ControlButton
              onClick={() => handler(obj.id, 'ventilate_room')}
              style={{ marginTop: '10px' }}>
              <FaWind /> Aérer la pièce
            </ControlButton>
          </ObjectControls>
        );

      case 'Dishwasher':
        const rinseAidLow = obj.rinseAidLevel < obj.rinseAidLowThreshold;
        const rinseAidEmpty = obj.rinseAidLevel <= 0;
        return (
          <ObjectControls>
            <ValueDisplay>État: {obj.status}</ValueDisplay>
            {obj.status === 'En cours' && obj.timeRemaining > 0 && (
              <ValueDisplay>Temps restant: {obj.timeRemaining} min</ValueDisplay>
            )}
            <div style={{ margin: '10px 0' }}>
              <label>Programme: </label>
              <select
                value={obj.program}
                onChange={(e) => handler(obj.id, 'dishwasher_select_program', e.target.value)}
                disabled={obj.status === 'En cours'}>
                {obj.availablePrograms.map(prog => (
                  <option key={prog} value={prog}>{prog}</option>
                ))}
              </select>
              {obj.program === 'Intensif' && (
                <small style={{ display: 'block', color: 'orange', marginTop: '3px' }}>
                  Consommation élevée de liquide de rinçage
                </small>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <ValueDisplay style={{ color: rinseAidEmpty ? 'red' : (rinseAidLow ? 'orange' : 'inherit'), marginRight: '10px' }}>
                Liquide Rinçage: {obj.rinseAidLevel}% {rinseAidEmpty ? <FaExclamationTriangle title="Vide" /> : (rinseAidLow && <FaExclamationTriangle title="Niveau bas" />)}
              </ValueDisplay>
              <ControlButton
                onClick={() => handler(obj.id, 'fill_rinse_aid')}
                disabled={obj.rinseAidLevel === obj.rinseAidMaxCapacity}
                title="Remplir liquide de rinçage">
                <FaFillDrip />
              </ControlButton>
            </div>
            <ToggleButton
              active={obj.status === 'En cours'}
              onClick={() => handler(obj.id, 'dishwasher_start_stop', obj.status !== 'En cours')}
              disabled={rinseAidEmpty && obj.status !== 'En cours'}>
              {obj.status === 'En cours' ? 'Arrêter' : 'Démarrer'}
            </ToggleButton>
            {rinseAidEmpty && obj.status !== 'En cours' && (
              <ValueDisplay style={{ color: 'red', marginTop: '10px' }}>
                Impossible de démarrer: Liquide de rinçage vide
              </ValueDisplay>
            )}
          </ObjectControls>
        );

      case 'Ventilation':
        if (obj.id === 'hotte_labo') {
          const filterLow = obj.filterLife < obj.filterChangeThreshold;
          return (
            <ObjectControls>
              <ValueDisplay>État: {obj.status}</ValueDisplay>
              <div style={{ margin: '10px 0' }}>
                <label>Vitesse: </label>
              <RangeSlider
                type="range"
                min="0"
                  max={obj.maxSpeed}
                value={obj.speed}
                onChange={(e) => handler(obj.id, 'ventilation_speed', e.target.value)}
                  disabled={obj.status === 'Éteint'}
              />
                <ValueDisplay>{obj.speed}%</ValueDisplay>
              </div>
                <ToggleButton
                  active={obj.status === 'Actif'}
                onClick={() => handler(obj.id, 'ventilation_toggle', obj.status !== 'Actif')}>
                {obj.status === 'Actif' ? 'Éteindre' : 'Allumer'}
                </ToggleButton>
              <div style={{ marginTop: '15px' }}>
                <ValueDisplay style={{ color: filterLow ? 'orange' : 'inherit' }}>
                  Filtre: {obj.filterStatus} ({obj.filterLife}%) {filterLow && <FaExclamationTriangle title="Remplacement requis" />}
                </ValueDisplay>
                <ControlButton
                  onClick={() => handler(obj.id, 'replace_filter')}
                  disabled={obj.filterStatus === 'OK' && obj.filterLife === 100}>
                  <FaFilter /> Remplacer Filtre
                </ControlButton>
                <ValueDisplay style={{ fontSize: '0.8em', marginTop: '5px' }}>
                Dernière maintenance: {new Date(obj.lastMaintenance).toLocaleDateString()}
              </ValueDisplay>
              </div>
            </ObjectControls>
          );
        }
        if (obj.id === 'ventilation_gym') {
          const isManual = obj.mode === 'Manual';
          const isOff = obj.mode === 'Off' || obj.status === 'Inactif';
          return (
            <ObjectControls>
              <ValueDisplay>État: {obj.status}</ValueDisplay>
              <ValueDisplay>Mode: {obj.mode}</ValueDisplay>
              <div style={{ margin: '15px 0', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <label style={{ alignSelf: 'center' }}>Mode:</label>
                {obj.availableModes.map(mode => (
                  <ControlButton
                    key={mode}
                    active={obj.mode === mode}
                    onClick={() => handler(obj.id, 'ventilation_gym_mode', mode)}
                    style={{ flexGrow: 1, textAlign: 'center' }} // Make buttons fill space
                  >
                    {mode}
                  </ControlButton>
                ))}
              </div>
              <div style={{ margin: '10px 0' }}>
                <label>Vitesse:</label>
              <RangeSlider
                type="range"
                min="0"
                  max={obj.maxSpeed}
                  value={isOff ? 0 : obj.speed}
                  onChange={(e) => handler(obj.id, 'ventilation_speed', e.target.value)}
                  disabled={!isManual}
                />
                <ValueDisplay>{isOff ? 0 : obj.speed}%</ValueDisplay>
              </div>
            </ObjectControls>
          );
        }
        return null;

      case 'Scanner':
        if (obj.id === 'scanner_biblio') {
          let resultText = 'Inconnu';
          let resultColor = 'grey';
          if (obj.scanResult === 'success') { resultText = 'Succès'; resultColor = 'green'; }
          else if (obj.scanResult === 'not_found') { resultText = 'Non trouvé'; resultColor = 'orange'; }
          else if (obj.scanResult === 'error') { resultText = 'Erreur Scan'; resultColor = 'red'; }
          
          return (
            <ObjectControls>
                <ValueDisplay>État: {obj.status}</ValueDisplay>
              <ControlButton
                onClick={() => handler(obj.id, 'simulate_scan')}
                disabled={obj.status === 'Scanning'}> 
                <FaBarcode /> Simuler Scan
              </ControlButton>
                {obj.lastScan && (
                <ValueDisplay style={{ fontSize: '0.8em', marginTop: '5px' }}>
                    Dernier scan: {new Date(obj.lastScan).toLocaleString()}
                  </ValueDisplay>
                )}
              {obj.scanResult && (
                <div style={{ marginTop: '5px' }}>
                  Résultat: <span style={{ color: resultColor, fontWeight: 'bold' }}>{resultText}</span>
                  {obj.scanResult === 'success' && obj.lastScannedItem && (
                    <div style={{ fontSize: '0.8em' }}>
                      Item: {obj.lastScannedItem.title} ({obj.lastScannedItem.id})
                </div>
                  )}
              </div>
              )}
            </ObjectControls>
          );
        }
        return null;

      case 'Borne':
        if (obj.id === 'borne_recharge') {
          const isCharging = obj.status === 'En charge';
          const isOutOfService = obj.status === 'Hors service';
          let statusColor = isOutOfService ? 'grey' : (isCharging ? 'orange' : 'green');

          return (
            <ObjectControls>
              <ValueDisplay style={{ color: statusColor, fontWeight: 'bold' }}>État: {obj.status}</ValueDisplay>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <ControlButton onClick={() => handler(obj.id, 'simulate_charge_start')} disabled={isCharging || isOutOfService}>
                  <FaChargingStation /> Démarrer Charge
                </ControlButton>
                <ControlButton onClick={() => handler(obj.id, 'simulate_charge_end')} disabled={!isCharging || isOutOfService}>
                  Arrêter Charge
                </ControlButton>
                <ControlButton onClick={() => handler(obj.id, 'toggle_service_status')} style={{backgroundColor: isOutOfService ? '#4CAF50' : '#ffcc00'}}>
                  {isOutOfService ? 'Remettre en service' : 'Mettre Hors Service'}
                </ControlButton>
              </div>
            </ObjectControls>
          );
        }
        if (obj.id === 'bornes_pret') {
          const isAuthenticated = obj.authState === 'authenticated';
          let authStateText = 'Inactif';
          if (obj.authState === 'authenticated') authStateText = 'Authentifié';
          else if (obj.authState === 'failed') authStateText = 'Échec';

          return (
            <ObjectControls>
              <ValueDisplay>État Borne: {obj.status}</ValueDisplay>
                  <ValueDisplay>
                Authentification: <span style={{ fontWeight: 'bold', color: isAuthenticated ? 'green' : (obj.authState === 'failed' ? 'red' : 'grey') }}>{authStateText}</span>
                  </ValueDisplay>
              {!isAuthenticated && (
                <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
                  <ControlButton onClick={() => handler(obj.id, 'simulate_auth', true)}>
                    <FaUserCheck /> Simuler Auth Réussie
                  </ControlButton>
                  <ControlButton onClick={() => handler(obj.id, 'simulate_auth', false)}>
                    <FaUserTimes /> Simuler Auth Échouée
                  </ControlButton>
                </div>
              )}
              {isAuthenticated && (
                <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
                  <ControlButton onClick={() => handler(obj.id, 'simulate_transaction', 'loan')}>
                    <FaBookReader /> Simuler Prêt
                  </ControlButton>
                  <ControlButton onClick={() => handler(obj.id, 'simulate_transaction', 'return')}>
                    <FaBookMedical /> Simuler Retour
                  </ControlButton>
                </div>
              )}
              {obj.lastTransactionDetails && obj.lastTransactionDetails.type && (
                 <ValueDisplay style={{ fontSize: '0.8em', marginTop: '5px', borderTop: '1px solid #eee', paddingTop: '5px' }}>
                  Dernière transac: {obj.lastTransactionDetails.type === 'loan' ? 'Prêt' : 'Retour'} de {obj.lastTransactionDetails.itemId} par {obj.lastTransactionDetails.userId} le {new Date(obj.lastTransaction).toLocaleString()}
                </ValueDisplay>
              )}
            </ObjectControls>
          );
        }
        return null;

      case 'Securite':
        if (obj.id === 'detecteur_rfid') {
          const isAlarm = obj.status === 'Alarme';
          return (
            <ObjectControls>
              <ValueDisplay style={{ color: isAlarm ? 'red' : 'inherit', fontWeight: isAlarm ? 'bold' : 'normal' }}>
                État: {obj.status} {isAlarm && <FaBell title="Alarme Antivol!" />}
              </ValueDisplay>
              {isAlarm && obj.lastDetection && (
                <ValueDisplay style={{ fontSize: '0.8em', color: 'red' }}>
                  Alarme déclenchée: {new Date(obj.lastDetection).toLocaleString()}
                </ValueDisplay>
              )}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <ControlButton onClick={() => handler(obj.id, 'simulate_rfid_alarm')} disabled={isAlarm}>
                  Simuler Alarme Antivol
                </ControlButton>
                <ControlButton onClick={() => handler(obj.id, 'reset_rfid_alarm')} disabled={!isAlarm} style={{ backgroundColor: isAlarm ? '#4CAF50' : '#cccccc' }}>
                  Réinitialiser Alarme
                </ControlButton>
              </div>
            </ObjectControls>
          );
        }
        if (obj.id === 'alarme_incendie') {
          const isAlarm = obj.status === 'Alarme Incendie';
          return (
            <ObjectControls>
              <ValueDisplay style={{ color: isAlarm ? 'red' : 'green', fontWeight: 'bold' }}>
                État: {obj.status} {isAlarm && <FaFire title="Alarme Incendie!" />}
              </ValueDisplay>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <ControlButton onClick={() => handler(obj.id, 'simulate_fire_alarm')} disabled={isAlarm}>
                  Simuler Alarme Incendie
                </ControlButton>
                <ControlButton onClick={() => handler(obj.id, 'reset_fire_alarm')} disabled={!isAlarm} style={{ backgroundColor: isAlarm ? '#4CAF50' : '#cccccc' }}>
                  Réinitialiser Alarme
                </ControlButton>
              </div>
            </ObjectControls>
          );
        }
        return null;

      case 'Barriere':
        return (
          <ObjectControls>
            <ValueDisplay style={{ marginBottom: '10px', fontWeight: 'bold' }}>
              État actuel : {obj.status}
            </ValueDisplay>
            <ControlButton
              onClick={() => handleObjectControl(obj.id, 'barriere', obj.status !== 'Ouverte')}
              style={{ width: '100%', padding: '10px', fontSize: '1em' }} // Larger button
            >
              {obj.status === 'Ouverte' ? 
                <><FaCarAlt style={{ marginRight: '8px' }} /> Fermer la barrière</> : 
                <><FaCarAlt style={{ marginRight: '8px' }} /> Ouvrir la barrière</>
              }
            </ControlButton>
          </ObjectControls>
        );

      case 'Grille':
        return (
          <ObjectControls>
            <ValueDisplay style={{ marginBottom: '10px', fontWeight: 'bold' }}>
              État actuel : {obj.status}
            </ValueDisplay>
            <ControlButton
              onClick={() => handleObjectControl(obj.id, 'grille', obj.status !== 'Ouverte')}
              style={{ width: '100%', padding: '10px', fontSize: '1em' }} // Larger button
            >
              {obj.status === 'Ouverte' ? 
                <><FaDoorClosed style={{ marginRight: '8px' }} /> Fermer la grille principale</> : 
                <><FaDoorOpen style={{ marginRight: '8px' }} /> Ouvrir la grille principale</>
              }
            </ControlButton>
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
              step="1"
              value={obj.position || 0}
              onChange={(e) => handler(obj.id, 'store_position', e.target.value)}
            />
            <ValueDisplay>Position: {obj.position || 0}%</ValueDisplay>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <ControlButton onClick={() => handler(obj.id, 'store_position', 0)}>
                Fermer complètement
              </ControlButton>
              <ControlButton onClick={() => handler(obj.id, 'store_position', 100)}>
                Ouvrir complètement
              </ControlButton>
            </div>
          </ObjectControls>
        );

      case 'Detecteur':
        if (obj.id === 'detecteur_fumee') {
          const isSmokeDetected = obj.status === 'Fumée détectée';
        return (
          <ObjectControls>
              <ValueDisplay style={{ color: isSmokeDetected ? 'orange' : 'green', fontWeight: 'bold' }}>
                État: {obj.status} {isSmokeDetected && <FaSmog title="Fumée détectée!" />}
              </ValueDisplay>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <ControlButton onClick={() => handler(obj.id, 'simulate_smoke_detection')} disabled={isSmokeDetected}>
                  Simuler Détection Fumée
                </ControlButton>
                <ControlButton onClick={() => handler(obj.id, 'reset_smoke_detector')} disabled={!isSmokeDetected} style={{ backgroundColor: isSmokeDetected ? '#4CAF50' : '#cccccc' }}>
                  Réinitialiser Détecteur
                </ControlButton>
              </div>
          </ObjectControls>
        );
        }
        if (obj.id === 'detecteur_gaz') {
          const batteryLow = obj.batteryLevel < obj.batteryLowThreshold;
          const isAlert = obj.status === 'Alerte';
          const isInactive = obj.status === 'Inactif';

          let statusColor = 'inherit';
          if (isAlert) statusColor = 'red';
          else if (isInactive) statusColor = 'grey';
          else if (batteryLow) statusColor = 'orange';

          return (
            <ObjectControls>
              <ValueDisplay style={{ color: statusColor }}>
                État: {obj.status}
                {isAlert && <FaSkullCrossbones title="Alerte Gaz!" />}
                {isInactive && <span> (Désactivé)</span>}
              </ValueDisplay>
              <ValueDisplay style={{ color: batteryLow ? 'orange' : 'inherit' }}>
                Batterie: {obj.batteryLevel}% {batteryLow && <FaExclamationTriangle title="Batterie faible" />}
              </ValueDisplay>
              {isAlert && obj.detectedGases.length > 0 && (
                 <div style={{ color: 'red', marginTop: '5px' }}>
                   Gaz détecté(s): {obj.detectedGases.join(', ')}
              </div>
               )}
               {isAlert && obj.lastAlert && (
                 <ValueDisplay style={{ fontSize: '0.8em', color: 'red' }}>
                   Alerte depuis: {new Date(obj.lastAlert).toLocaleString()}
                  </ValueDisplay>
                )}
               <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <ToggleButton
                   active={obj.status !== 'Inactif'}
                   onClick={() => handler(obj.id, 'detector_toggle', obj.status === 'Inactif')}>
                   {obj.status === 'Inactif' ? 'Activer' : 'Désactiver'}
                </ToggleButton>
                 <ControlButton
                   onClick={() => handler(obj.id, 'simulate_gas_detection')}
                   disabled={isAlert || isInactive}>
                   <FaGasPump /> Simuler Détection
                 </ControlButton>
                 <ControlButton
                   onClick={() => handler(obj.id, 'reset_gas_alert')}
                   disabled={!isAlert}
                   style={{ backgroundColor: isAlert ? '#4CAF50' : '#cccccc' }}>
                   Réinitialiser Alerte
                 </ControlButton>
              </div>
            </ObjectControls>
          );
        }
        else {
        return (
          <ObjectControls>
            <ValueDisplay>État: {obj.status}</ValueDisplay>
          </ObjectControls>
        );
        }

      case 'Affichage':
        if (obj.id === 'affichage_parking') {
          const free = obj.freeSpots !== undefined ? obj.freeSpots : 'N/A';
          const total = obj.totalSpots !== undefined ? obj.totalSpots : 'N/A';
          const color = (free === 0 || free === 'N/A') ? 'red' : 'green';

          return (
            <ObjectControls>
              <ValueDisplay style={{ fontSize: '1.2em', fontWeight: 'bold', color: color }}>
                Places Libres: {free} / {total}
              </ValueDisplay>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <ControlButton onClick={() => handler(obj.id, 'simulate_car_enter')} disabled={free === 0 || free === 'N/A'}>
                  <FaCar /> Entrée Voiture
                </ControlButton>
                <ControlButton onClick={() => handler(obj.id, 'simulate_car_leave')} disabled={free === total || free === 'N/A'}>
                  <FaCar style={{transform: 'scaleX(-1)'}}/> Sortie Voiture
                </ControlButton>
              </div>
            </ObjectControls>
          );
        }
        if (obj.id === 'score_board') {
          const isOn = obj.status === 'Allumé';
          return (
            <ObjectControls>
              <ValueDisplay>État: {obj.status}</ValueDisplay>
                <ToggleButton
                active={isOn}
                onClick={() => handler(obj.id, 'scoreboard_toggle', !isOn)}
                  style={{ width: '100%', marginBottom: '20px' }}>
                {isOn ? 'Éteindre Tableau' : 'Allumer Tableau'}
                </ToggleButton>

              {isOn && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
                      <div style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '8px', margin: '0 5px' }}>
                      <h3 style={{ margin: '0 0 10px 0' }}>LOCAUX</h3>
                      <div style={{ fontSize: '3.5em', fontWeight: 'bold', margin: '10px 0', color: '#333' }}>
                          {obj.score.home || 0}
                        </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <ControlButton onClick={() => handler(obj.id, 'score_increment', 'home:1')} style={{ padding: '8px 12px' }}>+1</ControlButton>
                        <ControlButton onClick={() => handler(obj.id, 'score_increment', 'home:2')} style={{ padding: '8px 12px' }}>+2</ControlButton>
                        <ControlButton onClick={() => handler(obj.id, 'score_increment', 'home:3')} style={{ padding: '8px 12px' }}>+3</ControlButton>
                        </div>
                      </div>
                      <div style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '8px', margin: '0 5px' }}>
                      <h3 style={{ margin: '0 0 10px 0' }}>VISITEURS</h3>
                      <div style={{ fontSize: '3.5em', fontWeight: 'bold', margin: '10px 0', color: '#333' }}>
                          {obj.score.away || 0}
                        </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <ControlButton onClick={() => handler(obj.id, 'score_increment', 'away:1')} style={{ padding: '8px 12px' }}>+1</ControlButton>
                        <ControlButton onClick={() => handler(obj.id, 'score_increment', 'away:2')} style={{ padding: '8px 12px' }}>+2</ControlButton>
                        <ControlButton onClick={() => handler(obj.id, 'score_increment', 'away:3')} style={{ padding: '8px 12px' }}>+3</ControlButton>
                        </div>
                      </div>
                    </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', margin: '25px 0', alignItems: 'center', padding: '10px', backgroundColor: '#f8f8f8', borderRadius: '8px' }}>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaStopwatch /> Timer:</label>
                     <input type="number" value={obj.timer} onChange={e => handler(obj.id, 'scoreboard_timer', e.target.value)} style={{width: '70px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px'}}/> sec
                     <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '15px' }}><FaRegClock /> Période:</label>
                     <input type="number" min="1" value={obj.period} onChange={e => handler(obj.id, 'scoreboard_period', e.target.value)} style={{width: '50px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px'}}/>
                   </div>
                    <ControlButton
                      onClick={() => handler(obj.id, 'score_reset')}
                      style={{ width: '100%', marginTop: '15px', backgroundColor: '#ff4444', color: 'white' }}>
                      Réinitialiser Score
                    </ControlButton>
                  </>
                )}
            </ObjectControls>
          );
        }
        const currentInputValue = tempInputValues[obj.id] !== undefined ? tempInputValues[obj.id] : (obj.message || '');

        return (
          <ObjectControls>
            <ValueDisplay>Message actuel: "{obj.message || 'Aucun'}"</ValueDisplay>
                <input
              type="text" 
              value={currentInputValue}
              onChange={(e) => setTempInputValues(prev => ({ ...prev, [obj.id]: e.target.value }))} 
              placeholder="Nouveau message..." 
              style={{ margin: '10px 0', padding: '8px', width: 'calc(100% - 16px)', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <ControlButton onClick={() => { 
              handler(obj.id, 'update_message', currentInputValue); 
            }}>
              Mettre à jour le message
            </ControlButton>
          </ObjectControls>
        );

      default:
        if (obj.id === 'detecteur_parking') {
          const statusText = obj.status === 'Actif' ? 'Place Occupée' : 'Place Libre';
          const statusColor = obj.status === 'Actif' ? 'orange' : 'green';
          return <ObjectControls><ValueDisplay style={{ color: statusColor, fontWeight: 'bold' }}>État: {statusText}</ValueDisplay></ObjectControls>;
        }
        if (obj.id === 'acces_parking') {
          return (
            <ObjectControls>
                <ValueDisplay>État: {obj.status}</ValueDisplay>
              <ControlButton onClick={() => handler(obj.id, 'simulate_access_request')}>
                Simuler Demande d'Accès
              </ControlButton>
            </ObjectControls>
          );
        }
        return <ObjectControls><ValueDisplay>État: {obj.status}</ValueDisplay></ObjectControls>;
    }
  };

  const renderCategoryContent = () => {
    if (selectedRoom) {
      const room = objects.find(obj => obj.id === selectedRoom);

      if (!room) {
        console.error(`Salle avec ID '${selectedRoom}' non trouvée.`);
        setSelectedRoom(null); // Revenir à la vue par défaut pour éviter des erreurs répétées
        return (
          <div>
            <ControlButton onClick={() => setSelectedRoom(null)}>
              ← Retour
            </ControlButton>
            <p style={{color: 'red', marginTop: '20px'}}>Erreur: Salle non trouvée.</p>
          </div>
        );
      }

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
              <ObjectItem 
                key={equip.id} 
                id={`equipment-${equip.id}`}
              >
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
              {renderControls(obj)}
            </ObjectItem>
          ))}
      </ObjectGrid>
    );
  };

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
