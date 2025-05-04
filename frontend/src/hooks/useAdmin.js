import { useState, useEffect, useCallback  } from 'react';
import { useHeaderState } from '../hooks/useHeader';
import axios from 'axios';
import { dataObjects, equipments } from '../data/projectData';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
export const OBJECT_STATUS = {
    ROOM: {
        AVAILABLE: 'Disponible',
        OCCUPIED: 'Occupée'
    },
    EQUIPMENT: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        MAINTENANCE: 'Maintenance'
    },
    SERVICE: {
        RUNNING: 'En cours',
        STOPPED: 'Arrêté',
        MAINTENANCE: 'En maintenance'
    },
    TOOL: {
        AVAILABLE: 'Disponible',
        IN_USE: 'En utilisation',
        MAINTENANCE: 'En maintenance'
    },
    CAMERA: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        DISCONNECTED: 'Déconnecté',
        MAINTENANCE: 'Maintenance'
    },
    PROJECTOR: {
        ON: 'Allumé',
        OFF: 'Éteint',
        MAINTENANCE: 'Maintenance'
    },
    HEATING: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        AUTO: 'Mode Auto',
        MAINTENANCE: 'Maintenance'
    },
    LIGHTING: {
        ON: 'Allumé',
        OFF: 'Éteint',
        AUTO: 'Mode Auto',
        MAINTENANCE: 'Maintenance'
    },
    BLIND: {
        OPEN: 'Ouvert',
        CLOSED: 'Fermé',
        PARTIAL: 'Partiellement ouvert',
        MAINTENANCE: 'Maintenance'
    },
    AUDIO: {
        ON: 'Allumé',
        OFF: 'Éteint',
        MUTE: 'Mute',
        MAINTENANCE: 'Maintenance'
    },
    VENTILATION: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        AUTO: 'Mode Auto',
        MAINTENANCE: 'Maintenance'
    },
    DISTRIBUTOR: {
        AVAILABLE: 'Disponible',
        OUT_OF_STOCK: 'Rupture de stock',
        MAINTENANCE: 'Maintenance'
    },
    COFFEE_MAKER: {
        AVAILABLE: 'Disponible',
        BREWING: 'Préparation en cours',
        CLEANING: 'Nettoyage en cours',
        MAINTENANCE: 'Maintenance'
    },
    MICROWAVE: {
        AVAILABLE: 'Disponible',
        IN_USE: 'En cours',
        FINISHED: 'Terminé',
        MAINTENANCE: 'Maintenance'
    },
    AIR_SENSOR: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        ALERT: 'Alerte',
        MAINTENANCE: 'Maintenance'
    },
    DISHWASHER: {
        AVAILABLE: 'Disponible',
        RUNNING: 'En cours',
        FINISHED: 'Terminé',
        MAINTENANCE: 'Maintenance'
    },
    SCANNER: {
        AVAILABLE: 'Disponible',
        SCANNING: 'Scan en cours',
        ERROR: 'Erreur',
        MAINTENANCE: 'Maintenance'
    },
    TERMINAL: {
        AVAILABLE: 'Disponible',
        IN_USE: 'En cours',
        OUT_OF_SERVICE: 'Hors service',
        MAINTENANCE: 'Maintenance'
    },
    SENSOR: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        ALERT: 'Alerte',
        MAINTENANCE: 'Maintenance'
    },
    DETECTOR: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        ALERT: 'Alerte',
        MAINTENANCE: 'Maintenance'
    },
    DISPLAY: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        ERROR: 'Erreur',
        MAINTENANCE: 'Maintenance'
    },
    BARRIER: {
        OPEN: 'Ouverte',
        CLOSED: 'Fermée',
        ERROR: 'Erreur',
        MAINTENANCE: 'Maintenance'
    },
    GATE: {
        OPEN: 'Ouverte',
        CLOSED: 'Fermée',
        ERROR: 'Erreur',
        MAINTENANCE: 'Maintenance'
    },
    SECURITY: {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        ALERT: 'Alerte',
        MAINTENANCE: 'Maintenance'
    }
};

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

	const [objects, setObjects] = useState([]); 
	const [categoryList, setCategoryList] = useState([]);
	const [showObjectModal, setShowObjectModal] = useState(false);
	const [objectFormData, setObjectFormData] = useState({
		name: '',
		type: categoryList[0] || 'Salle',
		status: OBJECT_STATUS.ROOM.AVAILABLE, 
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
	

	const [reports, setReports] = useState({
		energyConsumption: [],
		userActivity: [],
		serviceUsage: []
	});
	const [selectedReport, setSelectedReport] = useState(null);


	const [activeTab, setActiveTab] = useState('users');
	const [showAlertModal, setShowAlertModal] = useState(false);
	const [selectedObject, setSelectedObject] = useState(null);
	const [selectedAlert, setSelectedAlert] = useState(null);

	const [userHistory, setUserHistory] = useState([]);
	const [selectedUserHistory, setSelectedUserHistory] = useState(null);
	const [historyFilter, setHistoryFilter] = useState({
		type: 'all',
		dateFrom: '',
		dateTo: ''
	});

	const [alerts, setAlerts] = useState([]);

	useEffect(() => {
		const fetchAlerts = async () => {
		  try {
			const { data } = await axios.get('/api/alertes');
			console.log('🛎️ alertes reçues :', data);
			setAlerts(data);
		  } catch (err) {
			console.error('Erreur chargement alertes :', err);
			toast.error("Impossible de charger les alertes");
		  }
		};
		fetchAlerts();
	  }, []);

	  const resolveAlert = async (alerte) => {
		try {
		await axios.delete(`http://localhost:5001/api/alerte/${alerte.idalerte}`);

		setAlerts(current => current.filter(a => a.idalerte !== alerte.idalerte));
		toast.success(`Alerte ${alerte.idalerte} supprimée`);
		} catch (err) {
		console.error('Erreur suppression alerte :', err);
		toast.error("Impossible de supprimer l'alerte");
		}
	};




	const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
	const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
	const [showDeleteObjectModal, setShowDeleteObjectModal] = useState(false);
	const [showEquipmentModal, setShowEquipmentModal] = useState(false);
	const [showApproveModal, setShowApproveModal] = useState(false);
	const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
	const [selectedEquipmentInfo, setSelectedEquipmentInfo] = useState(null);
	const [selectedAlertToApprove, setSelectedAlertToApprove] = useState(null);
	const [lastBackup, setLastBackup] = useState('2024-03-20 00:00');
	const [lastIntegrityCheck, setLastIntegrityCheck] = useState('2024-03-20 00:00');
	const [isBackupInProgress, setIsBackupInProgress] = useState(false);
	const [isIntegrityCheckInProgress, setIsIntegrityCheckInProgress] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

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


	const fetchUsers = useCallback(async () => {
		setLoadingUsers(true);
		try {
		  const { data } = await axios.get('/api/users');
		  const formatted = data.map(u => ({
			id: u.id,
			login: u.login,
			email: u.email,
			role: u.role,
			points: u.points,
			createdAt: new Date(u.inscription).toLocaleDateString('fr-FR', { days: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
			lastLogin: u.last_login
			  ? new Date(u.last_login).toLocaleDateString('fr-FR', { days: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
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
	


	const fetchObjects = async () => {
		    try {
		      const { data } = await axios.get('http://localhost:5001/api/objets');
		     // Le serveur renvoie [{ type, id, nom, etat }, …]
		      const shaped = data.map(o => ({
		        id: o.id,
		        type: o.type,
		        name: o.nom,
		        status: o.etat
		      }));
		      setObjects(shaped);
		
		      const uniqueTypes = [...new Set(shaped.map(obj => obj.type))];
		      setCategoryList(uniqueTypes);
		    } catch (err) {
		      toast.error("Impossible de charger les objets : " + err.message);
		    }
		  };
		

		  useEffect(() => {
		    fetchUsers();
		    fetchObjects();
		    fetchReports();
		  }, []);

	const fetchReports = useCallback(async () => {
		const days = Array.from({length: 30}, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - i);
			return date;
		});

		const energyData = days.map(date => {
			const activeObjects = objects.filter(obj => 
				obj.status === 'Actif' || obj.status === 'Allumé' || obj.status === 'Disponible'
			);

			const totalConsumption = activeObjects.reduce((total, obj) => {
				let consumption = 0;
				
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

			const hour = date.getHours();
			let hourlyMultiplier = 1;
			
			if (hour >= 8 && hour <= 18) {
				hourlyMultiplier = 1.2;
			}
			else if (hour >= 22 || hour <= 6) {
				hourlyMultiplier = 0.5;
			}

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


		
		const userActivityData = days.map(date => {
			const activeUsers = users.filter(user => {
				const lastLogin = new Date(user.lastLogin);
				return lastLogin.toDateString() === date.toDateString();
			}).length;

			const connectionRate = users.length > 0 ? 
				Math.round((activeUsers / users.length) * 100) : 0;

			const peakHours = activeUsers > 0 ? '10:00-16:00' : '—';

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

		const serviceUsageData = Object.entries(equipments).map(([roomId, equipmentList]) => {
			const room = objects.find(obj => obj.id === roomId);
			const activeEquipment = equipmentList.filter(eq => 
				eq.status === 'Actif' || eq.status === 'Allumé' || eq.status === 'Disponible'
			);

			const equipmentTypes = {};
			const usageByType = {};
			
			equipmentList.forEach(eq => {
				equipmentTypes[eq.type] = (equipmentTypes[eq.type] || 0) + 1;

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

			const avgDailyUsage = Object.values(usageByType).reduce((a, b) => a + b, 0) / 
				Object.keys(usageByType).length;

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

	const fetchUserHistory = async () => {
		try {
		  const response = await axios.get('http://localhost:5001/api/action-history');
		  const res = await axios.get('http://localhost:5001/api/action-history');
		  setUserHistory(res.data);
		} catch (error) {
		  console.error("Erreur lors de la récupération de l'historique :", error);
		}
	  };

	const filterHistory = (history) => {
		return history.filter(entry => {
			const matchesType = historyFilter.type === 'all' || entry.action === historyFilter.type;
			const entryDate = new Date(entry.timestamp);
			const matchesDateFrom = !historyFilter.dateFrom || entryDate >= new Date(historyFilter.dateFrom);
			const matchesDateTo = !historyFilter.dateTo || entryDate <= new Date(historyFilter.dateTo);
			return matchesType && matchesDateFrom && matchesDateTo;
		});
	};


	const handleAddUser = () => {
		setSelectedUser(null);
		setUserFormData({ login: '', email: '', role: 'eleve', points: 0, password: '' });
		setShowUserModal(true);
	};

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

	const handleDeleteUser = useCallback((userId) => {
		const userToDelete = users.find(user => user.id === userId);
		if (userToDelete) {
			setSelectedUser(userToDelete);
			setShowDeleteUserModal(true);
		}
	}, [users]);


	const handleUserSubmit = useCallback(async e => {
		e.preventDefault();

	  
		try {
		  if (selectedUser) {

			if (userFormData.role === selectedUser.role) {

			  const increment = userFormData.points - selectedUser.points;
			  const { data } = await axios.patch(
				`/api/users/${selectedUser.id}/score`,
				{ increment }
			  );
    
			  setUsers(users.map(u =>
				u.id === selectedUser.id
				  ? { ...u, points: data.score }
				  : u
			  ));
			  sessionStorage.setItem('points',  data.score);
			  window.location.reload() 
			  navigate('/admin');
			} else {

			  const { data } = await axios.patch(
				`/api/users/${selectedUser.id}`,
				{
				  role:  userFormData.role,
				  score: userFormData.points
				}
			  );

			  setUsers(users.map(u =>
				u.id === selectedUser.id
				  ? { ...u, role: data.user.role, points: data.user.score }
				  : u
			  ));
			  sessionStorage.setItem('prenom', data.user.prenom);
			  sessionStorage.setItem('pseudo',  data.user.pseudonyme);
			  sessionStorage.setItem('role',    data.user.role);
			  sessionStorage.setItem('points',  data.user.score);
			  window.location.reload()
			  navigate('/');
			  await fetchUsers();     
			  setShowUserModal(false);
			}
		  } else {

			const { data } = await axios.post('/api/users', {
			  nom:         userFormData.login,
			  prenom:      userFormData.login,   
			  email:       userFormData.email,
			  role:        userFormData.role,
			  password:    userFormData.password,
			  pseudonyme:  userFormData.login,
			  score:       userFormData.points,
			  formation:   'inconnue',          
			  dateNaissance: '1970-01-01'        
			});

			await fetchUsers();

			window.location.reload();
		  }
	  
		  setShowUserModal(false);
		} catch (err) {

		  toast.error(`Erreur : ${err.response?.data?.error || err.message}`);
		}
	  }, [selectedUser, userFormData, users, currentUser, navigate]);
	  
	  
	
	  useEffect(() => {

		const handleLogoutEvent = () => {

		  fetchUserHistory();  
		};
		window.addEventListener('app:logout', handleLogoutEvent);
		return () => window.removeEventListener('app:logout', handleLogoutEvent);
	  }, [fetchUserHistory]);

	const confirmDeleteUser = useCallback(async () => {
		try {
	
		  await axios.delete(`http://localhost:5001/api/users/${selectedUser.id}`);


		  setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
		
		  toast.success('Utilisateur supprimé avec succès');
		  
		  setShowDeleteUserModal(false);
		  setSelectedUser(null);
	  
		 
		  if (currentUser && selectedUser.id === currentUser.id) {
			handleLogout();
		  }
		  await fetchUserHistory();
		 
		} catch (err) {
			console.error('Erreur suppression utilisateur', err.response || err);
			const status  = err.response?.status;
			const serverMessage = err.response?.data?.error || err.message;
			
			toast.error(`Échec suppression : ${serverMessage}`);
		}
	}, [selectedUser, currentUser, navigate]);


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
		
		setCategoryList(categoryList.filter(category => category !== selectedItemToDelete));
		
		setObjects(objects.filter(obj => obj.type !== selectedItemToDelete));
		setShowDeleteCategoryModal(false);
		setSelectedItemToDelete(null);
		toast.success(`Catégorie "${selectedItemToDelete}" et ses objets ont été supprimés`);
	};

	const handleGlobalRulesChange = (e) => {
		setGlobalRules({ ...globalRules, [e.target.name]: e.target.value });
	};

	
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
			
			setSelectedItemToDelete(alert.objectId);
			setShowDeleteObjectModal(true);
		} else {
			
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

	const confirmDeleteObject = useCallback(async () => {
		try {
		 
		  const obj = objects.find(o => o.id === selectedItemToDelete);
		  if (!obj) throw new Error("Objet introuvable");
	  
		 
		  await axios.delete(`/api/${obj.type}/${obj.id}`);
	  
		 
		  setObjects(prev => prev.filter(o => o.id !== obj.id));
		  toast.success('Objet supprimé avec succès');
		} catch (err) {
		  console.error(err);
		  toast.error('Échec de la suppression : ' + (err.response?.data?.error || err.message));
		} finally {
	
		  setShowDeleteObjectModal(false);
		  setSelectedItemToDelete(null);
		}
	  }, [selectedItemToDelete, objects]);
	  

	
	const handleObjectSubmit = async (e) => {
		e.preventDefault();
		try {
		  if (selectedObject) {
			
		  } else {
			
			const payload = {
			  type: objectFormData.type,
			  nom:  objectFormData.name
			};
			const { data } = await axios.post('/api/objets', payload);
			
			setObjects(prev => [
			  ...prev,
			  {
				id:     data.id,
				type:   data.type,
				name:   data.nom,
				status: data.etat
			  }
			]);
			await fetchObjects();
			toast.success("L'objet a été ajouté en base avec succès");
		  }
		  setShowObjectModal(false);
		  setSelectedObject(null);
		} catch (err) {
		  toast.error("Erreur lors de l'ajout : " + (err.response?.data?.error || err.message));
		}
	  };

	const handleExportReport = (type) => {
		const data = reports[type];
		const csv = convertToCSV(data);
		downloadCSV(csv, `${type}_report.csv`);
	};


	const convertToCSV = (data) => {
		const headers = Object.keys(data[0]);
		const rows = data.map(item => headers.map(header => item[header]));
		return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
	};


	const downloadCSV = (csv, filename) => {
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		window.URL.revokeObjectURL(url);
	};


	const handleAlertAction = (alert) => {
		setSelectedAlert(alert);
		setShowAlertModal(true);
	};



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

	
	const applyTheme = (theme) => {
		document.documentElement.setAttribute('data-theme', theme);
		setPlatformSettings(prev => ({
			...prev,
			theme: theme
		}));
		toast.success(`Theme appliqué`);
	};

	
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

	
	const handleBackup = async () => {
		setIsBackupInProgress(true);
		try {
			
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


	const applyGlobalRules = useCallback(() => {
		
		const updatedObjects = objects.map(obj => {
			let newStatus = obj.status;

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

	
		const hasChanges = updatedObjects.some((updatedObj, index) => 
			updatedObj.status !== objects[index].status
		);

		if (hasChanges) {
			setObjects(updatedObjects);
			toast.info("Les règles globales ont été appliquées");

		
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

	
	const resetColors = () => {
		setPlatformSettings(prev => ({
		  ...prev,
		  colors: {
			primary: '#3b82f6',
			secondary: '#1f2937'
		  }
		}));
		
		document.documentElement.style.setProperty('--primary-color', '#3b82f6');
		document.documentElement.style.setProperty('--secondary-color', '#1f2937');
	  };

	  useEffect(() => {
		const initializeData = async () => {
		  try {
		
			await Promise.all([
			  fetchUsers(),
			  fetchObjects(),
			  fetchUserHistory()    
			]);
			
			await fetchReports();
		  } catch (err) {
			console.error("Erreur d'initialisation :", err);
		  }
		};
		initializeData();
	  }, []);

	useEffect(() => {
		const interval = setInterval(() => {
			applyGlobalRules();
		}, 60000); 

		return () => clearInterval(interval);
	}, [applyGlobalRules, globalRules, objects]);

  return {
  
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
	getObjectStatus, countObjectsByStatus, handleRoomEquipment, resolveAlert
  };	
};
