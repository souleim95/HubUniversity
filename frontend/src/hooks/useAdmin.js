import { useState, useEffect, useCallback  } from 'react';
import { useHeaderState } from '../hooks/useHeader';
import axios from 'axios';
// Importer les données depuis fakeData.js
import { dataObjects, equipments } from '../data/projectData';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// Constantes pour les statuts
export const OBJECT_STATUS = {
    // Statuts pour les salles
    ROOM: {
        AVAILABLE: 'Disponible',
        OCCUPIED: 'Occupée'
    },
    // Statuts pour les équipements
    EQUIPMENT: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour les services
    SERVICE: {
        RUNNING: 'En cours',
        STOPPED: 'Arrêté',
        MAINTENANCE: 'En maintenance'
    },
    // Statuts pour les outils
    TOOL: {
        AVAILABLE: 'Disponible',
        IN_USE: 'En utilisation',
        MAINTENANCE: 'En maintenance'
    },
    // Statuts pour les caméras
    CAMERA: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        DISCONNECTED: 'Déconnecté',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour les projecteurs
    PROJECTOR: {
        ON: 'Allumé',
        OFF: 'Éteint',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour le chauffage
    HEATING: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        AUTO: 'Mode Auto',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour l'éclairage
    LIGHTING: {
        ON: 'Allumé',
        OFF: 'Éteint',
        AUTO: 'Mode Auto',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour les stores
    BLIND: {
        OPEN: 'Ouvert',
        CLOSED: 'Fermé',
        PARTIAL: 'Partiellement ouvert',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour l'audio
    AUDIO: {
        ON: 'Allumé',
        OFF: 'Éteint',
        MUTE: 'Mute',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour la ventilation
    VENTILATION: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        AUTO: 'Mode Auto',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour les distributeurs
    DISTRIBUTOR: {
        AVAILABLE: 'Disponible',
        OUT_OF_STOCK: 'Rupture de stock',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour la cafetière
    COFFEE_MAKER: {
        AVAILABLE: 'Disponible',
        BREWING: 'Préparation en cours',
        CLEANING: 'Nettoyage en cours',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour le micro-ondes
    MICROWAVE: {
        AVAILABLE: 'Disponible',
        IN_USE: 'En cours',
        FINISHED: 'Terminé',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour les capteurs d'air
    AIR_SENSOR: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        ALERT: 'Alerte',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour le lave-vaisselle
    DISHWASHER: {
        AVAILABLE: 'Disponible',
        RUNNING: 'En cours',
        FINISHED: 'Terminé',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour le scanner
    SCANNER: {
        AVAILABLE: 'Disponible',
        SCANNING: 'Scan en cours',
        ERROR: 'Erreur',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour les bornes
    TERMINAL: {
        AVAILABLE: 'Disponible',
        IN_USE: 'En cours',
        OUT_OF_SERVICE: 'Hors service',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour les capteurs
    SENSOR: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        ALERT: 'Alerte',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour les détecteurs
    DETECTOR: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        ALERT: 'Alerte',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour les panneaux
    DISPLAY: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        ERROR: 'Erreur',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour les barrières
    BARRIER: {
        OPEN: 'Ouverte',
        CLOSED: 'Fermée',
        ERROR: 'Erreur',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour les grilles
    GATE: {
        OPEN: 'Ouverte',
        CLOSED: 'Fermée',
        ERROR: 'Erreur',
        MAINTENANCE: 'Maintenance'
    },
    // Statuts pour la sécurité
    SECURITY: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        ALERT: 'Alerte',
        MAINTENANCE: 'Maintenance'
    }
};

// Fonction utilitaire pour vérifier le statut
export const getObjectStatus = (status, type) => {
    switch (type) {
        case 'Salle':
            return status === OBJECT_STATUS.ROOM.AVAILABLE ? 'active' : 'inactive';
        case 'Équipement':
            if (status === OBJECT_STATUS.EQUIPMENT.ACTIVE) return 'active';
            if (status === OBJECT_STATUS.EQUIPMENT.MAINTENANCE) return 'maintenance';
            return 'inactive';
        case 'Service':
            if (status === OBJECT_STATUS.SERVICE.RUNNING) return 'active';
            if (status === OBJECT_STATUS.SERVICE.MAINTENANCE) return 'maintenance';
            return 'inactive';
        case 'Outil':
            if (status === OBJECT_STATUS.TOOL.AVAILABLE) return 'active';
            if (status === OBJECT_STATUS.TOOL.MAINTENANCE) return 'maintenance';
            return 'inactive';
        case 'Caméra':
            if (status === OBJECT_STATUS.CAMERA.ACTIVE) return 'active';
            if (status === OBJECT_STATUS.CAMERA.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.CAMERA.DISCONNECTED) return 'error';
            return 'inactive';
        case 'Projecteur':
            if (status === OBJECT_STATUS.PROJECTOR.ON) return 'active';
            if (status === OBJECT_STATUS.PROJECTOR.MAINTENANCE) return 'maintenance';
            return 'inactive';
        case 'Chauffage':
            if (status === OBJECT_STATUS.HEATING.ACTIVE) return 'active';
            if (status === OBJECT_STATUS.HEATING.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.HEATING.AUTO) return 'active';
            return 'inactive';
        case 'Éclairage':
            if (status === OBJECT_STATUS.LIGHTING.ON) return 'active';
            if (status === OBJECT_STATUS.LIGHTING.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.LIGHTING.AUTO) return 'active';
            return 'inactive';
        case 'Store':
            if (status === OBJECT_STATUS.BLIND.OPEN) return 'active';
            if (status === OBJECT_STATUS.BLIND.PARTIAL) return 'active';
            if (status === OBJECT_STATUS.BLIND.MAINTENANCE) return 'maintenance';
            return 'inactive';
        case 'Audio':
            if (status === OBJECT_STATUS.AUDIO.ON) return 'active';
            if (status === OBJECT_STATUS.AUDIO.MAINTENANCE) return 'maintenance';
            return 'inactive';
        case 'Ventilation':
            if (status === OBJECT_STATUS.VENTILATION.ACTIVE) return 'active';
            if (status === OBJECT_STATUS.VENTILATION.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.VENTILATION.AUTO) return 'active';
            return 'inactive';
        case 'Distributeur':
            if (status === OBJECT_STATUS.DISTRIBUTOR.AVAILABLE) return 'active';
            if (status === OBJECT_STATUS.DISTRIBUTOR.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.DISTRIBUTOR.OUT_OF_STOCK) return 'error';
            return 'inactive';
        case 'Cafetiere':
            if (status === OBJECT_STATUS.COFFEE_MAKER.AVAILABLE) return 'active';
            if (status === OBJECT_STATUS.COFFEE_MAKER.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.COFFEE_MAKER.BREWING || status === OBJECT_STATUS.COFFEE_MAKER.CLEANING) return 'warning';
            return 'inactive';
        case 'Microwave':
            if (status === OBJECT_STATUS.MICROWAVE.AVAILABLE) return 'active';
            if (status === OBJECT_STATUS.MICROWAVE.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.MICROWAVE.IN_USE) return 'warning';
            return 'inactive';
        case 'AirSensor':
            if (status === OBJECT_STATUS.AIR_SENSOR.ACTIVE) return 'active';
            if (status === OBJECT_STATUS.AIR_SENSOR.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.AIR_SENSOR.ALERT) return 'error';
            return 'inactive';
        case 'Dishwasher':
            if (status === OBJECT_STATUS.DISHWASHER.AVAILABLE) return 'active';
            if (status === OBJECT_STATUS.DISHWASHER.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.DISHWASHER.RUNNING) return 'warning';
            return 'inactive';
        case 'Scanner':
            if (status === OBJECT_STATUS.SCANNER.AVAILABLE) return 'active';
            if (status === OBJECT_STATUS.SCANNER.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.SCANNER.ERROR) return 'error';
            if (status === OBJECT_STATUS.SCANNER.SCANNING) return 'warning';
            return 'inactive';
        case 'Borne':
            if (status === OBJECT_STATUS.TERMINAL.AVAILABLE) return 'active';
            if (status === OBJECT_STATUS.TERMINAL.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.TERMINAL.OUT_OF_SERVICE) return 'error';
            return 'inactive';
        case 'Capteur':
            if (status === OBJECT_STATUS.SENSOR.ACTIVE) return 'active';
            if (status === OBJECT_STATUS.SENSOR.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.SENSOR.ALERT) return 'error';
            return 'inactive';
        case 'Detecteur':
            if (status === OBJECT_STATUS.DETECTOR.ACTIVE) return 'active';
            if (status === OBJECT_STATUS.DETECTOR.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.DETECTOR.ALERT) return 'error';
            return 'inactive';
        case 'Panneau':
            if (status === OBJECT_STATUS.DISPLAY.ACTIVE) return 'active';
            if (status === OBJECT_STATUS.DISPLAY.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.DISPLAY.ERROR) return 'error';
            return 'inactive';
        case 'Barriere':
            if (status === OBJECT_STATUS.BARRIER.OPEN) return 'active';
            if (status === OBJECT_STATUS.BARRIER.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.BARRIER.ERROR) return 'error';
            return 'inactive';
        case 'Grille':
            if (status === OBJECT_STATUS.GATE.OPEN) return 'active';
            if (status === OBJECT_STATUS.GATE.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.GATE.ERROR) return 'error';
            return 'inactive';
        case 'Securite':
            if (status === OBJECT_STATUS.SECURITY.ACTIVE) return 'active';
            if (status === OBJECT_STATUS.SECURITY.MAINTENANCE) return 'maintenance';
            if (status === OBJECT_STATUS.SECURITY.ALERT) return 'error';
            return 'inactive';
        default:
            return 'inactive';
    }
};

// Fonction pour compter les objets par statut
export const countObjectsByStatus = (objects) => {
	return {
		active: objects.filter(obj => {
			switch (obj.type) {
				case 'Salle':
					return obj.status === OBJECT_STATUS.ROOM.AVAILABLE;
				case 'Équipement':
					return obj.status === OBJECT_STATUS.EQUIPMENT.ACTIVE;
				case 'Service':
					return obj.status === OBJECT_STATUS.SERVICE.RUNNING;
				case 'Outil':
					return obj.status === OBJECT_STATUS.TOOL.AVAILABLE;
				default:
					return false;
			}
		}).length,
		inactive: objects.filter(obj => {
			switch (obj.type) {
				case 'Salle':
					return obj.status === OBJECT_STATUS.ROOM.OCCUPIED;
				case 'Équipement':
					return obj.status === OBJECT_STATUS.EQUIPMENT.INACTIVE;
				case 'Service':
					return obj.status === OBJECT_STATUS.SERVICE.STOPPED;
				case 'Outil':
					return obj.status === OBJECT_STATUS.TOOL.IN_USE;
				default:
					return false;
			}
		}).length,
		maintenance: objects.filter(obj => {
			switch (obj.type) {
				case 'Équipement':
					return obj.status === OBJECT_STATUS.EQUIPMENT.MAINTENANCE;
				case 'Service':
					return obj.status === OBJECT_STATUS.SERVICE.MAINTENANCE;
				case 'Outil':
					return obj.status === OBJECT_STATUS.TOOL.MAINTENANCE;
				default:
					return false;
			}
		}).length
	};
};

// Fonction pour gérer les équipements d'une salle
export const handleRoomEquipment = (roomId) => {
	const room = dataObjects.find(obj => obj.id === roomId);
	if (!room) return null;

	const roomEquipment = equipments[roomId] || [];
	const equipmentStatus = countObjectsByStatus(roomEquipment);

	return {
		room,
		equipment: roomEquipment,
		status: equipmentStatus
	};
};

export const useAdminState = (platformSettings, setPlatformSettings) => {
	const navigate = useNavigate();
	const raw = localStorage.getItem('currentUser');
  	const currentUser = raw ? JSON.parse(raw) : null;
	

	// États pour la gestion des utilisateurs
	const [users, setUsers] = useState([]);
	const [loadingUsers, setLoadingUsers] = useState(true);
	const [showUserModal, setShowUserModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [showUserPassword, setShowUserPassword] = useState(false);
	const [userFormData, setUserFormData] = useState({
		login: '',
		email: '',
		role: 'eleve',
		points: 0,
		password: ''
	});
	const { handleLogout } = useHeaderState();

	// États pour la gestion des objets connectés
	const [objects, setObjects] = useState([]); // Sera rempli avec dataObjects
	const [categoryList, setCategoryList] = useState([]); // Liste des catégories
	const [showObjectModal, setShowObjectModal] = useState(false);
	const [objectFormData, setObjectFormData] = useState({
		name: '',
		type: categoryList[0] || 'Salle',
		status: OBJECT_STATUS.ROOM.AVAILABLE, // Valeur par défaut pour les salles
		priority: 'normal'
	});
	const [newCategory, setNewCategory] = useState('');
	const [showCategoryModal, setShowCategoryModal] = useState(false);
	const [globalRules, setGlobalRules] = useState({
		energyPriority: 'balanced',
		alertThreshold: 80,
		maintenanceSchedule: 'weekly',
		autoShutdown: true,
		shutdownTime: '22:00',
		startupTime: '06:00',
		maxConcurrentUsers: 100,
		backupFrequency: 'daily',
		notificationSettings: {
			email: true,
			sms: false,
			push: true
		}
	});

	// États pour les rapports et statistiques
	const [reports, setReports] = useState({
		energyConsumption: [],
		userActivity: [],
		serviceUsage: []
	});
	const [selectedReport, setSelectedReport] = useState(null);

	// Navigation par onglets et gestion des alertes
	const [activeTab, setActiveTab] = useState('users');
	const [showAlertModal, setShowAlertModal] = useState(false);
	const [selectedObject, setSelectedObject] = useState(null);
	const [selectedAlert, setSelectedAlert] = useState(null);
	// Ajout des états pour l'historique
	const [userHistory, setUserHistory] = useState([]);
	const [selectedUserHistory, setSelectedUserHistory] = useState(null);
	const [historyFilter, setHistoryFilter] = useState({
		type: 'all',
		dateFrom: '',
		dateTo: ''
	});

	// Ajout des états pour les alertes
	const [alerts, setAlerts] = useState([
		{
			id: 1,
			type: 'alert',
			title: 'Salle B101 en surchauffe',
			message: 'La température dépasse le seuil critique',
			objectId: 'obj_1',
			priority: 'high',
			timestamp: '2024-03-20T10:30:00',
			status: 'pending'
		},
		{
			id: 2,
			type: 'request',
			title: 'Demande de suppression',
			message: 'Le gestionnaire demande la suppression de l\'objet PC-203',
			objectId: 'obj_2',
			priority: 'medium',
			timestamp: '2024-03-20T09:15:00',
			status: 'pending',
			requester: 'gestionnaire1'
		}
	]);

	// États pour les modaux de confirmation
	const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
	const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
	const [showDeleteObjectModal, setShowDeleteObjectModal] = useState(false);
	const [showEquipmentModal, setShowEquipmentModal] = useState(false);
	const [showApproveModal, setShowApproveModal] = useState(false);
	const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
	const [selectedEquipmentInfo, setSelectedEquipmentInfo] = useState(null);
	const [selectedAlertToApprove, setSelectedAlertToApprove] = useState(null);

	// États pour la gestion des sauvegardes et vérifications
	const [lastBackup, setLastBackup] = useState('2024-03-20 00:00');
	const [lastIntegrityCheck, setLastIntegrityCheck] = useState('2024-03-20 00:00');
	const [isBackupInProgress, setIsBackupInProgress] = useState(false);
	const [isIntegrityCheckInProgress, setIsIntegrityCheckInProgress] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	// Fonction pour réinitialiser le formulaire d'objet
	const resetObjectForm = (type = 'Salle') => {
		let defaultStatus;
		switch (type) {
			case 'Salle':
				defaultStatus = OBJECT_STATUS.ROOM.AVAILABLE;
				break;
			case 'Équipement':
				defaultStatus = OBJECT_STATUS.EQUIPMENT.ACTIVE;
				break;
			case 'Service':
				defaultStatus = OBJECT_STATUS.SERVICE.RUNNING;
				break;
			case 'Outil':
				defaultStatus = OBJECT_STATUS.TOOL.AVAILABLE;
				break;
			default:
				defaultStatus = OBJECT_STATUS.ROOM.AVAILABLE;
		}
		
		setObjectFormData({
			name: '',
			type: type,
			status: defaultStatus,
			priority: 'normal'
		});
	};

	// --------- Chargement initial des données ---------
	


	// Récupère la liste des utilisateurs depuis l'API
	// À remplacer par une vraie implémentation d'API plus tard
	const fetchUsers = useCallback(async () => {
		setLoadingUsers(true);
		try {
		  const { data } = await axios.get('/api/users');
		  const formatted = data.map(u => ({
			id: u.id,
			login: u.name,
			email: u.email,
			role: u.role,
			points: u.score,
			createdAt: new Date(u.created_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
			lastLogin: u.last_login
			  ? new Date(u.last_login).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })
			  : '—'
		  }));
		  setUsers(formatted);
		} catch (err) {
		  const message = err.response?.data?.error || err.message;
		  toast.error(`Erreur fetchUsers : ${message}`);
		} finally {
		  setLoadingUsers(false);
		}
	  }, []);
	

	// Récupère la liste des objets et catégories depuis fakeData.js
	const fetchObjects = async () => {
		try {
		  // On récupère l'URL de base depuis .env (ou utilise '' si non défini pour les appels relatifs)
		  const API_URL = process.env.REACT_APP_API_URL || '';
		  // Appel GET vers /api/objets
		  const response = await axios.get(`${API_URL}/api/objets`);
		  const data = response.data; // on attend un tableau d'objets { id, type, nom, etat }
	
		  // On reformate pour le front
		  const shaped = data.map(o => ({
			id:     o.id,
			type:   o.type,
			name:   o.nom,
			status: o.etat
		  }));
	
		  // On stocke les objets et la liste unique des catégories
		  setObjects(shaped);
		  setCategoryList([...new Set(shaped.map(obj => obj.type))]);
		} catch (error) {
		  console.error('Erreur fetchObjects:', error);
		  toast.error(`Impossible de charger les objets : ${error.message}`);
		}
	  };
		
		  // On charge utilisateurs + objets une fois au montage
		  useEffect(() => {
		    fetchUsers();
		    fetchObjects();
		    fetchReports();
		  }, []);

	// Récupère les données pour les rapports
	const fetchReports = useCallback(async () => {
		// Générer des données sur 30 jours
		const days = Array.from({length: 30}, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - i);
			return date;
		});

		// Consommation énergétique basée sur les objets réels
		const energyData = days.map(date => {
			// Calculer la consommation en fonction des objets actifs
			const activeObjects = objects.filter(obj => 
				obj.status === 'Actif' || obj.status === 'Allumé' || obj.status === 'Disponible'
			);

			// Calculer la consommation par type d'objet en fonction de leurs propriétés réelles
			const totalConsumption = activeObjects.reduce((total, obj) => {
				let consumption = 0;
				
				// Calculer la consommation en fonction des propriétés spécifiques de chaque objet
				switch(obj.type) {
					case 'Éclairage':
						consumption = obj.brightness ? (obj.brightness * 0.5) : 50;
						break;
					case 'Chauffage':
						consumption = obj.temperature ? (obj.temperature * 100) : 1000;
						break;
					case 'Ventilation':
						consumption = obj.speed ? (obj.speed * 2) : 200;
						break;
					case 'Projecteur':
						consumption = 300;
						break;
					case 'Audio':
						consumption = obj.volume ? (obj.volume * 3) : 150;
						break;
					case 'Distributeur':
						consumption = obj.temperature ? (obj.temperature * 20) : 100;
						break;
					case 'Cafetiere':
						consumption = obj.waterLevel ? (obj.waterLevel * 8) : 800;
						break;
					case 'Microwave':
						consumption = obj.power ? (obj.power * 1.2) : 1200;
						break;
					case 'Dishwasher':
						consumption = obj.waterTemp ? (obj.waterTemp * 20) : 1500;
						break;
					default:
						consumption = 50;
				}

				return total + consumption;
			}, 0);

			// Ajouter une variation journalière réaliste basée sur l'heure
			const hour = date.getHours();
			let hourlyMultiplier = 1;
			
			// Heures de pointe (8h-18h)
			if (hour >= 8 && hour <= 18) {
				hourlyMultiplier = 1.2;
			}
			// Heures creuses (22h-6h)
			else if (hour >= 22 || hour <= 6) {
				hourlyMultiplier = 0.5;
			}

			// Réduction le weekend
			const weekendMultiplier = [0, 6].includes(date.getDay()) ? 0.7 : 1;

			return {
				date: date.toISOString().split('T')[0],
				value: Math.round(totalConsumption * hourlyMultiplier * weekendMultiplier),
				peak_hours: Math.round(totalConsumption * 1.2),
				off_peak: Math.round(totalConsumption * 0.8),
				total_devices: objects.length,
				active_devices: activeObjects.length
			};
		});

		// Activité utilisateurs basée sur les données réelles
		const userActivityData = days.map(date => {
			// Calculer le nombre d'utilisateurs actifs en fonction des connexions réelles
			const activeUsers = users.filter(user => {
				const lastLogin = new Date(user.lastLogin);
				return lastLogin.toDateString() === date.toDateString();
			}).length;

			// Calculer le taux de connexion
			const connectionRate = users.length > 0 ? 
				Math.round((activeUsers / users.length) * 100) : 0;

			// Déterminer les heures de pointe en fonction des connexions
			const peakHours = activeUsers > 0 ? '10:00-16:00' : '—';

			// Calculer la durée moyenne de session (en minutes)
			const avgSessionDuration = Math.round(30 + Math.random() * 90);

			return {
				date: date.toISOString().split('T')[0],
				total_users: users.length,
				active_users: activeUsers,
				connection_rate: connectionRate,
				peak_time: peakHours,
				new_registrations: Math.floor(Math.random() * 5),
				avg_session_duration: avgSessionDuration
			};
		});

		// Usage des services basé sur les équipements réels
		const serviceUsageData = Object.entries(equipments).map(([roomId, equipmentList]) => {
			const room = objects.find(obj => obj.id === roomId);
			const activeEquipment = equipmentList.filter(eq => 
				eq.status === 'Actif' || eq.status === 'Allumé' || eq.status === 'Disponible'
			);

			// Calculer le taux d'utilisation par type d'équipement
			const equipmentTypes = {};
			const usageByType = {};
			
			equipmentList.forEach(eq => {
				// Compter le nombre d'équipements par type
				equipmentTypes[eq.type] = (equipmentTypes[eq.type] || 0) + 1;

				// Calculer l'utilisation en fonction des propriétés spécifiques
				let usage = 0;
				switch(eq.type) {
					case 'Éclairage':
						usage = eq.brightness ? (eq.brightness / 100) * 8 : 4;
						break;
					case 'Chauffage':
						usage = eq.temperature ? (eq.temperature / 30) * 8 : 6;
						break;
					case 'Ventilation':
						usage = eq.speed ? (eq.speed / 100) * 8 : 5;
						break;
					case 'Audio':
						usage = eq.volume ? (eq.volume / 100) * 8 : 4;
						break;
					case 'Distributeur':
						usage = eq.stock ? Object.values(eq.stock).reduce((a, b) => a + b, 0) / 400 : 6;
						break;
					default:
						usage = 4 + Math.random() * 2;
				}
				usageByType[eq.type] = usage;
			});

			// Calculer la moyenne d'utilisation
			const avgDailyUsage = Object.values(usageByType).reduce((a, b) => a + b, 0) / 
				Object.keys(usageByType).length;

			// Trouver la dernière maintenance
			const lastMaintenance = equipmentList.reduce((latest, eq) => {
				if (eq.lastMaintenance) {
					const maintenanceDate = new Date(eq.lastMaintenance);
					return !latest || maintenanceDate > latest ? maintenanceDate : latest;
				}
				return latest;
			}, null);

			return {
				service: room ? room.name : roomId,
				total_equipment: equipmentList.length,
				active_equipment: activeEquipment.length,
				usage_rate: Math.round((activeEquipment.length / equipmentList.length) * 100),
				avg_daily_usage: Math.round(avgDailyUsage * 10) / 10,
				maintenance_needed: equipmentList.filter(eq => eq.status === 'Maintenance').length,
				last_maintenance: lastMaintenance ? lastMaintenance.toISOString().split('T')[0] : '—',
				equipment_types: equipmentTypes,
				usage_by_type: usageByType
			};
		});

		setReports({
			energyConsumption: energyData,
			userActivity: userActivityData,
			serviceUsage: serviceUsageData
		});
	}, [users, objects, equipments]);

	// Ajout de la fonction pour récupérer l'historique
	const fetchUserHistory = async () => {
		try {
		  // Si vous avez configuré un proxy dans package.json, vous pouvez juste faire '/api/...'
		  const res = await axios.get('http://localhost:5001/api/action-history');
		  setUserHistory(res.data);
		} catch (error) {
		  console.error("Erreur lors de la récupération de l'historique :", error);
		}
	  };

	// Ajout de la fonction pour filtrer l'historique
	const filterHistory = (history) => {
		return history.filter(entry => {
			const matchesType = historyFilter.type === 'all' || entry.action === historyFilter.type;
			const entryDate = new Date(entry.timestamp);
			const matchesDateFrom = !historyFilter.dateFrom || entryDate >= new Date(historyFilter.dateFrom);
			const matchesDateTo = !historyFilter.dateTo || entryDate <= new Date(historyFilter.dateTo);
			return matchesType && matchesDateFrom && matchesDateTo;
		});
	};

	// --------- Gestion des utilisateurs ---------

	// Ouvre la modal pour ajouter un utilisateur
	const handleAddUser = () => {
		setSelectedUser(null);
		setUserFormData({ login: '', email: '', role: 'eleve', points: 0, password: '' });
		setShowUserModal(true);
	};

	// Fonction pour gérer la modification d'un utilisateur
	const handleEditUser = useCallback((user) => {
		setSelectedUser(user);
		setUserFormData({
			login: user.login,
			email: user.email,
			role: user.role,
			points: user.points,
			password: ''
		});
		setShowUserModal(true);
	}, []);

	// Fonction pour gérer la suppression d'un utilisateur
	const handleDeleteUser = useCallback((userId) => {
		const userToDelete = users.find(user => user.id === userId);
		if (userToDelete) {
			setSelectedUser(userToDelete);
			setShowDeleteUserModal(true);
		}
	}, [users]);

	// Fonction pour gérer la soumission du formulaire utilisateur
	const handleUserSubmit = useCallback(async e => {
		e.preventDefault();
		try {
		  if (selectedUser) {
			// Mise à jour d'un utilisateur existant
			const { data } = await axios.patch(`/api/users/${selectedUser.id}`, {
			  role: userFormData.role,
			  score: userFormData.points
			});
			setUsers(users.map(u =>
			  u.id === selectedUser.id
				? { ...u, role: data.user.role, points: data.user.score }
				: u
			));
			toast.success('Utilisateur modifié avec succès');
			// Si on s'est démoti sauf si on est encore autorisé
			if (currentUser?.id === selectedUser.id && data.user.role !== 'directeur') {
			  sessionStorage.setItem('role', data.user.role);
			  navigate('/');
			}
		  } else {
			// Création d'un nouvel utilisateur
			const { data } = await axios.post('/api/users', {
			  name: userFormData.login,
			  email: userFormData.email,
			  role: userFormData.role,
			  password: userFormData.password
			});
			toast.success('Utilisateur créé avec succès');
			// Recharger la liste depuis API pour afficher dates et id
			await fetchUsers();
		  }
		  setShowUserModal(false);
		} catch (err) {
		  const message = err.response?.data?.error || err.message;
		  toast.error(`Erreur : ${message}`);
		}
	  }, [selectedUser, userFormData, users, currentUser, fetchUsers, navigate]);
	
	  

	const confirmDeleteUser = useCallback(async () => {
		try {
		  // envoie la requête DELETE au back
		  await axios.delete(`http://localhost:5001/api/users/${selectedUser.id}`);
		  /* alert('✅ DELETE /api/users/' + selectedUser.id + ' réussi'); */
		  // retire de l'état local
		  setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
		  /* alert('✅ State users mis à jour'); */
		  toast.success('Utilisateur supprimé avec succès');
		  /* alert('▶️ Appel à fetchUserHistory pour rafraîchir l’historique'); */
		  setShowDeleteUserModal(false);
		  setSelectedUser(null);
	  
		  // si c'était l'utilisateur courant, redirige vers l'accueil visiteur
		  if (currentUser && selectedUser.id === currentUser.id) {
			handleLogout();
		  }
		  await fetchUserHistory();
		  /* alert('✅ Historique rafraîchi'); */
		} catch (err) {
			console.error('Erreur suppression utilisateur', err.response || err);
			const status  = err.response?.status;
			const serverMessage = err.response?.data?.error || err.message;
			/* alert(`❌ Échec suppression (HTTP ${status}) : ${serverMessage}`); */
			toast.error(`Échec suppression : ${serverMessage}`);
		}
	}, [selectedUser, currentUser, navigate]);

	// --------- Gestion des objets connectés ---------

	// Ouvre la modal pour ajouter un nouvel objet
	const handleAddObject = () => {
		resetObjectForm();
		setShowObjectModal(true);
	};

	const handleAddCategory = () => {
		setShowCategoryModal(true);
	};

	const handleCategorySubmit = (e) => {
		e.preventDefault();
		if (newCategory && !categoryList.includes(newCategory)) {
			setCategoryList([...categoryList, newCategory]);
			setNewCategory('');
			toast.success("La catégorie a été ajoutée avec succès");
		}
		setShowCategoryModal(false);
	};

	const handleDeleteCategory = (categoryToDelete) => {
		if (categoryToDelete === 'Salle') {
			toast.error('Impossible de supprimer la catégorie Salle');
			return;
		}
		setSelectedItemToDelete(categoryToDelete);
		setShowDeleteCategoryModal(true);
	};

	const confirmDeleteCategory = () => {
		// Supprimer la catégorie
		setCategoryList(categoryList.filter(category => category !== selectedItemToDelete));
		// Supprimer tous les objets de cette catégorie
		setObjects(objects.filter(obj => obj.type !== selectedItemToDelete));
		setShowDeleteCategoryModal(false);
		setSelectedItemToDelete(null);
		toast.success(`Catégorie "${selectedItemToDelete}" et ses objets ont été supprimés`);
	};

	const handleGlobalRulesChange = (e) => {
		setGlobalRules({ ...globalRules, [e.target.name]: e.target.value });
	};

	// Ouvre la modal pour modifier un objet existant
	const handleEditObject = (object) => {
		setSelectedObject(object);
		setObjectFormData({
			name: object.name,
			type: object.type,
			status: object.status,
			priority: object.priority || 'normal'
		});
		setShowObjectModal(true);
	};

	// Supprime un objet après confirmation
	const handleDeleteObject = (objectId) => {
		const objectToDelete = objects.find(obj => obj.id === objectId);
		if (objectToDelete && objectToDelete.type === 'Salle') {
			toast.error('Impossible de supprimer une salle');
			return;
		}
		setSelectedItemToDelete(objectId);
		setShowDeleteObjectModal(true);
	};

	const handleApproveRequest = (alert) => {
		setSelectedAlertToApprove(alert);
		if (alert.title.includes('suppression')) {
			// Si c'est une demande de suppression, on ouvre la modal de suppression
			setSelectedItemToDelete(alert.objectId);
			setShowDeleteObjectModal(true);
		} else {
			// Sinon, on ouvre la modal d'approbation simple
			setShowApproveModal(true);
		}
	};

	const confirmApproveRequest = () => {
		if (selectedAlertToApprove) {
			setAlerts(alerts.map(a => 
				a.id === selectedAlertToApprove.id ? { ...a, status: 'approved' } : a
			));
			toast.success('Demande approuvée');
			setShowApproveModal(false);
			setSelectedAlertToApprove(null);
		}
	};

	const confirmDeleteObject = () => {
		// Supprimer l'objet
		setObjects(objects.filter(obj => obj.id !== selectedItemToDelete));
		
		// Afficher le toast de succès
		toast.success('Objet supprimé avec succès');

		// Mettre à jour le statut de l'alerte si elle existe
		if (selectedAlertToApprove) {
			setAlerts(alerts.map(a => 
				a.id === selectedAlertToApprove.id ? { ...a, status: 'approved' } : a
				));
			toast.success('Demande de suppression approuvée');
		}

		// Réinitialiser les états
		setShowDeleteObjectModal(false);
		setSelectedItemToDelete(null);
		setSelectedAlertToApprove(null);
	};

	// Enregistre un nouvel objet ou modifie un objet existant
	const handleObjectSubmit = async (e) => {
		e.preventDefault();
		
		if (selectedObject) {
			// Modification d'un objet existant
			setObjects(objects.map(obj => 
				obj.id === selectedObject.id ? { ...obj, ...objectFormData } : obj
				));
			toast.success("L'objet a été modifié avec succès");
		} else {
			// Ajout d'un nouvel objet
			const newObject = {
				id: `obj_${Date.now()}`,
				...objectFormData
			};
			setObjects([...objects, newObject]);
			toast.success("L'objet a été ajouté avec succès");
		}
		
		setShowObjectModal(false);
		setSelectedObject(null);
	};

	// --------- Gestion des rapports ---------

	// Exporte les données d'un rapport en CSV
	const handleExportReport = (type) => {
		const data = reports[type];
		const csv = convertToCSV(data);
		downloadCSV(csv, `${type}_report.csv`);
	};

	// Convertit un tableau d'objets en format CSV
	const convertToCSV = (data) => {
		const headers = Object.keys(data[0]);
		const rows = data.map(item => headers.map(header => item[header]));
		return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
	};

	// Déclenche le téléchargement du fichier CSV généré
	const downloadCSV = (csv, filename) => {
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		window.URL.revokeObjectURL(url);
	};

	// Ouvre la modal pour gérer une alerte
	const handleAlertAction = (alert) => {
		setSelectedAlert(alert);
		setShowAlertModal(true);
	};

	// Modifier la fonction handleShowEquipment
	const handleShowEquipment = (room) => {
		const roomInfo = handleRoomEquipment(room.id);
		if (!roomInfo) return;

		setSelectedEquipmentInfo({
			roomName: room.name,
			equipmentCount: roomInfo.equipment.length,
			equipmentStatus: roomInfo.status
		});
		setShowEquipmentModal(true);
	};

	// Fonction pour appliquer le thème
	const applyTheme = (theme) => {
		document.documentElement.setAttribute('data-theme', theme);
		setPlatformSettings(prev => ({
			...prev,
			theme: theme
		}));
		toast.success(`Theme appliqué`);
	};

	// Fonction pour appliquer le mode de validation
	const applyValidationMode = (mode) => {
		setPlatformSettings(prev => ({
			...prev,
			validationRules: {
				...prev.validationRules,
				validationMode: mode
			}
		}));
		toast.success(`Mode de validation ${mode} appliqué`);
	};

	// Fonctions pour gérer les actions de sécurité
	const handleBackup = async () => {
		setIsBackupInProgress(true);
		try {
			// Simulation d'une sauvegarde
			await new Promise(resolve => setTimeout(resolve, 2000));
			const now = new Date();
			setLastBackup(now.toLocaleString());
			toast.success('Sauvegarde effectuée avec succès');
		} catch (error) {
			toast.error('Erreur lors de la sauvegarde');
		} finally {
			setIsBackupInProgress(false);
		}
	};

	const handleIntegrityCheck = async () => {
		setIsIntegrityCheckInProgress(true);
		try {
			// Simulation d'une vérification d'intégrité
			await new Promise(resolve => setTimeout(resolve, 2000));
			const now = new Date();
			setLastIntegrityCheck(now.toLocaleString());
			toast.success('Vérification d\'intégrité terminée');
		} catch (error) {
			toast.error('Erreur lors de la vérification d\'intégrité');
		} finally {
			setIsIntegrityCheckInProgress(false);
		}
	};

	const handlePasswordUpdate = async (e) => {
		e.preventDefault();
		const newPassword = e.target.elements.newPassword.value;
		if (newPassword.length < 8) {
			toast.error('Le mot de passe doit contenir au moins 8 caractères');
			return;
		}
		try {
			// Simulation de la mise à jour du mot de passe
			await new Promise(resolve => setTimeout(resolve, 1000));
			toast.success('Mot de passe mis à jour avec succès');
			e.target.reset();
		} catch (error) {
			toast.error('Erreur lors de la mise à jour du mot de passe');
		}
	};

	const handleViewObject = (objectId) => {
		const object = objects.find(obj => obj.id === objectId);
		if (object) {
			if (object.type === 'Salle') {
				navigate(`/dashboard?room=${objectId}`);
			} else {
				navigate(`/dashboard?object=${objectId}`);
			}
		}
	};

	// Fonction pour appliquer les règles globales
	const applyGlobalRules = useCallback(() => {
		// Appliquer les priorités énergétiques
		const updatedObjects = objects.map(obj => {
			let newStatus = obj.status;
			
			// Gestion de l'auto-shutdown selon l'horaire
			const currentTime = new Date();
			const [shutdownHour, shutdownMinute] = globalRules.shutdownTime.split(':').map(Number);
			const [startupHour, startupMinute] = globalRules.startupTime.split(':').map(Number);
			
			const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
			const shutdownMinutes = shutdownHour * 60 + shutdownMinute;
			const startupMinutes = startupHour * 60 + startupMinute;
			
			if (globalRules.autoShutdown) {
				if (currentMinutes >= shutdownMinutes || currentMinutes < startupMinutes) {
					if (obj.status === 'Actif' || obj.status === 'Allumé') {
						newStatus = 'Éteint';
					}
				} else if (currentMinutes >= startupMinutes) {
					if (obj.status === 'Éteint') {
						newStatus = 'Actif';
					}
				}
			}

			// Appliquer les priorités énergétiques
			if (globalRules.energyPriority === 'economy') {
				if (obj.priority === 'low') {
					newStatus = 'Éteint';
				}
			} else if (globalRules.energyPriority === 'performance') {
				if (obj.status === 'Éteint') {
					newStatus = 'Actif';
				}
			}

			return { ...obj, status: newStatus };
		});

		// Vérifier si des changements ont été effectués
		const hasChanges = updatedObjects.some((updatedObj, index) => 
			updatedObj.status !== objects[index].status
		);

		if (hasChanges) {
			setObjects(updatedObjects);
			toast.info("Les règles globales ont été appliquées");

			// Vérifier les seuils d'alerte uniquement si des changements ont eu lieu
			const activeObjects = updatedObjects.filter(obj => 
				obj.status === 'Actif' || obj.status === 'Allumé'
			).length;
			const totalObjects = updatedObjects.length;
			const activePercentage = (activeObjects / totalObjects) * 100;

			if (activePercentage > globalRules.alertThreshold) {
				const newAlert = {
					id: Date.now(),
					type: 'alert',
					title: "Seuil d'activité dépassé",
					message: `Le nombre d'objets actifs (${activePercentage.toFixed(1)}%) dépasse le seuil configuré (${globalRules.alertThreshold}%)`,
					objectId: null,
					priority: 'high',
					timestamp: new Date().toISOString(),
					status: 'pending'
				};

				if (!alerts.some(alert => 
					alert.type === 'alert' && 
					alert.title === newAlert.title && 
					alert.status === 'pending'
				)) {
					setAlerts([...alerts, newAlert]);
					toast.warning("Le seuil d'activité a été dépassé");
				}
			}
		}
	}, [objects, globalRules, alerts, setAlerts]);

	// Ajouter la fonction de réinitialisation des couleurs
	const resetColors = () => {
		setPlatformSettings(prev => ({
		  ...prev,
		  colors: {
			primary: '#3b82f6',
			secondary: '#1f2937'
		  }
		}));
		// Forcer un rafraîchissement des styles
		document.documentElement.style.setProperty('--primary-color', '#3b82f6');
		document.documentElement.style.setProperty('--secondary-color', '#1f2937');
	  };

	  useEffect(() => {
		const initializeData = async () => {
		  try {
			// On charge utilisateurs, objets et historique en parallèle
			await Promise.all([
			  fetchUsers(),
			  fetchObjects(),
			  fetchUserHistory()    // appelle setUserHistory(data)
			]);
			// Puis les rapports (qui dépendent de users & objects)
			await fetchReports();
		  } catch (err) {
			console.error("Erreur d'initialisation :", err);
		  }
		};
		initializeData();
	  }, []);
	// Appliquer les règles globales périodiquement
	useEffect(() => {
		const interval = setInterval(() => {
			applyGlobalRules();
		}, 60000); // Vérifier toutes les minutes

		return () => clearInterval(interval);
	}, [applyGlobalRules, globalRules, objects]);

  return {
    // Return all the state variables and functions needed by AdminPage
    navigate, applyGlobalRules, 
	users, setUsers, alerts, setAlerts,
    loadingUsers, setLoadingUsers,
    showUserModal, setShowUserModal,
    selectedUser, setSelectedUser,
    showUserPassword, setShowUserPassword,
    userFormData, setUserFormData,
    objects, setObjects,
    categoryList, setCategoryList,
    showObjectModal, setShowObjectModal,
    objectFormData, setObjectFormData,
    newCategory, setNewCategory,
    showCategoryModal, setShowCategoryModal,
    globalRules, setGlobalRules,
    reports, setReports,
    selectedReport, setSelectedReport,
    activeTab, setActiveTab,
    showAlertModal, setShowAlertModal,
    selectedObject, setSelectedObject,
    selectedAlert, setSelectedAlert,
    userHistory, setUserHistory,
    selectedUserHistory, setSelectedUserHistory,
    historyFilter, setHistoryFilter,
    showDeleteUserModal, setShowDeleteUserModal,
    showDeleteCategoryModal, setShowDeleteCategoryModal,
    showDeleteObjectModal, setShowDeleteObjectModal,
    showEquipmentModal, setShowEquipmentModal,
    showApproveModal, setShowApproveModal,
    selectedItemToDelete, setSelectedItemToDelete,
    selectedEquipmentInfo, setSelectedEquipmentInfo,
    selectedAlertToApprove, setSelectedAlertToApprove,
    lastBackup, setLastBackup,
    lastIntegrityCheck, setLastIntegrityCheck,
    isBackupInProgress, setIsBackupInProgress,
    isIntegrityCheckInProgress, setIsIntegrityCheckInProgress,
    showPassword, setShowPassword,
	handleAddUser, filterHistory,
	handleEditUser, handleDeleteUser,
	handleUserSubmit, confirmDeleteUser,
	handleAddObject, handleAddCategory,
	handleCategorySubmit, handleDeleteCategory,
	confirmDeleteCategory, confirmDeleteObject,
	handleGlobalRulesChange, handleEditObject,
	handleDeleteObject, handleApproveRequest, confirmApproveRequest,
	handleObjectSubmit, handleExportReport,
	handleAlertAction, handleShowEquipment,
	handleBackup, handleIntegrityCheck,
	handlePasswordUpdate,handleViewObject,
	applyValidationMode, applyTheme,
	resetColors, OBJECT_STATUS,
	getObjectStatus, countObjectsByStatus, handleRoomEquipment
  };	
};
