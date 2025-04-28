import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { dataObjects, categories, equipments, POINTS_CONFIG } from '../data/projectData';
import { renderControls } from './useDashboard_renderControls';
import { 
    ObjectItem,
    ObjectHeader,
    IconWrapper,
    ObjectGrid,
    SubItemContainer,
    ControlButton
} from '../styles/DashboardStyles';
import { getIcon } from '../utils/iconUtils';

export const useDashboardState = () => {
    const [objects, setObjects] = useState(dataObjects);
    const [selectedCategory, setSelectedCategory] = useState('salles');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roomEquipments, setRoomEquipments] = useState({});
    const [tempInputValues, setTempInputValues] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = !!sessionStorage.getItem('user');
    const [userPoints, setUserPoints] = useState(parseInt(sessionStorage.getItem('points') || '0'));

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
            toast.success(
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  Félicitations !
                </span>
                <span style={{ fontSize: '0.9em', color: '#666' }}>
                  {`Vous êtes maintenant ${newRole === 'professeur' ? 'Gestionnaire' : 'Directeur'} !`}
                </span>
              </div>,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast',
                style: {
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderLeft: '4px solid #4caf50',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }
              }
            );
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
            return;
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
        
        setObjects(prevObjects => {
            const newObjects = prevObjects.map(obj => {
                if (obj.id === id) {
                    // Mettre à jour l'objet selon l'action
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
            });
            
            // Attribuer les points après que l'action a réussi
            if (pointsEarned > 0) {
                updateUserPoints(pointsEarned).then(() => {
                    showPointsToast(pointsEarned);
                });
            }
            
            return newObjects;
        });
    };

    const handleEquipmentControl = (id, action, value) => {
        if (isFireAlarmActive()) {
            return;
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
                    
                    if (equip.id === 'score_board') {
                        switch (action) {
                            case 'scoreboard_toggle':
                                return { ...equip, status: value ? 'Allumé' : 'Éteint' };
                            case 'score_increment':
                                if (equip.status === 'Éteint') return equip;
                                const [team, points] = value.split(':');
                                return {
                                    ...equip,
                                    score: { ...equip.score, [team]: (equip.score[team] || 0) + parseInt(points) }
                                };
                            case 'score_reset':
                                if (equip.status === 'Éteint') return equip;
                                return {
                                    ...equip,
                                    score: { home: 0, away: 0 }
                                };
                            default:
                                return equip;
                        }
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
            
            // Attribuer les points après que l'action a réussi
            if (pointsEarned > 0) {
                updateUserPoints(pointsEarned).then(() => {
                    showPointsToast(pointsEarned);
                });
            }
            
            return {
                ...prev,
                [currentRoom]: updatedEquipmentsForRoom
            };
        });
    };

    // Ajouter un useEffect pour la simulation automatique du score
    useEffect(() => {
      const scoreInterval = setInterval(() => {
        setObjects(prevObjects => {
          return prevObjects.map(obj => {
            if (obj.id === 'score_board' && obj.status === 'Allumé' && obj.autoMode) {
              const randomScoreChange = Math.random() < 0.3; // 30% de chance de marquer
              if (randomScoreChange) {
                const team = Math.random() < 0.5 ? 'home' : 'away';
                return {
                  ...obj,
                  score: {
                    ...obj.score,
                    [team]: obj.score[team] + (Math.random() < 0.8 ? 1 : 2) // 80% chance de marquer 1 point, 20% de marquer 2 points
                  }
                };
              }
            }
            return obj;
          });
        });
      }, 5000); // Mettre à jour toutes les 5 secondes
  
      return () => clearInterval(scoreInterval);
    }, []);

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
                                        {equip.type === 'Chauffage' && (
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

    return {
        objects, setObjects,
        selectedCategory, setSelectedCategory,
        selectedRoom, setSelectedRoom,
        roomEquipments, setRoomEquipments,
        tempInputValues, setTempInputValues,
        location, navigate, isLoggedIn,
        userPoints, setUserPoints,
        isSchoolClosed, isFireAlarmActive,
        handleObjectControl, handleEquipmentControl,
        renderCategoryContent,
        updateUserPoints, showPointsToast
    };
};
