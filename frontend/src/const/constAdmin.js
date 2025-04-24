import React, { useContext, useState, useEffect, useCallback  } from 'react';

// Importer les données depuis fakeData.js
import { dataObjects, categories, equipments } from '../data/projectData';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export const useAdminState = (platformSettings, setPlatformSettings) => {
	const navigate = useNavigate();

 	 // États pour la gestion des utilisateurs
	const [users, setUsers] = useState([]);
	const [loadingUsers, setLoadingUsers] = useState(true);
	const [showUserModal, setShowUserModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [showUserPassword, setShowUserPassword] = useState(false);
	const [userFormData, setUserFormData] = useState({
		login: '',
		role: 'student',
		points: 0,
		password: ''
	});

	// États pour la gestion des objets connectés
	const [objects, setObjects] = useState([]); // Sera rempli avec dataObjects
	const [categoryList, setCategoryList] = useState([]); // Liste des catégories
	const [showObjectModal, setShowObjectModal] = useState(false);
	const [objectFormData, setObjectFormData] = useState({
		name: '',
		type: '',
		status: 'Actif',
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

	// --------- Chargement initial des données ---------
	


	// Récupère la liste des utilisateurs depuis l'API
	// À remplacer par une vraie implémentation d'API plus tard
	const fetchUsers = async () => {
		setLoadingUsers(true);
		try {
		// Utilisez l'URL complète avec le port du backend
		const res = await fetch('http://localhost:5001/api/users');
		
		if (!res.ok) {
			const errorData = await res.json();
			throw new Error(errorData.error || 'Erreur réseau');
		}
		
		const data = await res.json();
		console.log("Données reçues:", data); // Ajoutez ce log pour le débogage
		
		const formatted = data.map(u => ({
			id: u.id,
			login: u.name,
			email: u.email,
			role: u.role,
			points: u.score,
			createdAt: new Date(u.created_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
			lastLogin: u.last_login ? new Date(u.last_login).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—',
		}));
		
		setUsers(formatted);
		} catch (err) {
		console.error("Erreur détaillée:", err);
		toast.error(`Erreur: ${err.message}`);
		} finally {
		setLoadingUsers(false);
		}
	};
	

	// Récupère la liste des objets et catégories depuis fakeData.js
	const fetchObjects = async () => {
		// Utiliser les données de fakeData
		setObjects(dataObjects);
		
		// Extraire les types uniques des objets
		const uniqueTypes = [...new Set(dataObjects.map(obj => obj.type))];
		setCategoryList(uniqueTypes);
	};

	// Récupère les données pour les rapports
	const fetchReports = useCallback(async () => {
		// Générer des rapports basés sur les données réelles
		
		// Consommation énergétique: simuler basé sur le nombre d'objets actifs
		const activeObjects = dataObjects.filter(obj => obj.status === 'Actif' || obj.status === 'Allumé');
		const energyData = [
			{ date: new Date().toISOString().split('T')[0], value: activeObjects.length * 50 },
			{ date: new Date(Date.now() - 86400000).toISOString().split('T')[0], value: activeObjects.length * 45 }
		];
		
		// Activité utilisateurs: simuler basée sur le nombre d'objets et de salles
		const rooms = dataObjects.filter(obj => obj.type === 'Salle');
		const userActivityData = [
			{ date: new Date().toISOString().split('T')[0], activeUsers: Math.min(users.length * 10, rooms.reduce((sum, room) => sum + (room.capacity || 20), 0)) },
			{ date: new Date(Date.now() - 86400000).toISOString().split('T')[0], activeUsers: Math.min(users.length * 8, rooms.reduce((sum, room) => sum + (room.capacity || 20), 0)) }
		];
				
		// Usage des services: basé sur le nombre d'équipements par salle
		const equipmentCountByRoom = Object.keys(equipments).map(roomId => {
			const room = dataObjects.find(obj => obj.id === roomId);
			return {
				service: room ? room.name : roomId,
				usage: equipments[roomId].length
			};
		});
		
		setReports({
			energyConsumption: energyData,
			userActivity: userActivityData,
			serviceUsage: equipmentCountByRoom
		});
	}, [users]); 

	// Ajout de la fonction pour récupérer l'historique
	const fetchUserHistory = async () => {
		// Simulation de données d'historique
		const mockHistory = [
			{ id: 1, userId: 1, action: 'Connexion', timestamp: '2024-03-20T10:00:00', details: 'Connexion réussie' },
			{ id: 2, userId: 1, action: 'Modification', timestamp: '2024-03-20T10:15:00', details: 'Modification du profil' },
			{ id: 3, userId: 2, action: 'Connexion', timestamp: '2024-03-20T11:00:00', details: 'Connexion réussie' },
			{ id: 4, userId: 1, action: 'Déconnexion', timestamp: '2024-03-20T12:00:00', details: 'Déconnexion normale' },
		];
		setUserHistory(mockHistory);
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
		setUserFormData({
			login: '',
			role: 'student',
			points: 0,
			password: ''
		});
		setShowUserModal(true);
	};

	// Ouvre la modal pour modifier un utilisateur existant
	const handleEditUser = (user) => {
		setSelectedUser(user);
		setUserFormData({
			login: user.login,
			role: user.role,
			points: user.points,
			password: ''
		});
		setShowUserModal(true);
	};

	// Supprime un utilisateur après confirmation
	const handleDeleteUser = async (userId) => {
		setSelectedItemToDelete(userId);
		setShowDeleteUserModal(true);
	};

	const confirmDeleteUser = () => {
		setUsers(users.filter(user => user.id !== selectedItemToDelete));
		setShowDeleteUserModal(false);
		setSelectedItemToDelete(null);
	};

	// Sauvegarde les modifications d'un utilisateur
	const handleUserSubmit = async e => {
		e.preventDefault();
		try {
		const payload = {
			name:     userFormData.login,
			email:    userFormData.email,     // à ajouter dans votre formData si besoin
			role:     userFormData.role,
			password: userFormData.password,  // laisser vide si pas modif
		};
		if (selectedUser) {
			// modification
			await fetch(`/api/users/${selectedUser.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
			});
		} else {
			// création
			await fetch(`/api/users`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
			});
		}
		await fetchUsers();               // raffraîchir la liste
		setShowUserModal(false);
		} catch (err) {
		console.error(err);
		toast.error('Erreur lors de la sauvegarde');
		}
	};
	

	// --------- Gestion des objets connectés ---------

	// Ouvre la modal pour ajouter un nouvel objet
	const handleAddObject = () => {
		setObjectFormData({
			name: '',
			type: categoryList[0] || 'Salle',
			status: 'Actif',
			priority: 'normal'
		});
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
		}
		setShowCategoryModal(false);
	};

	const handleDeleteCategory = (categoryToDelete) => {
		setSelectedItemToDelete(categoryToDelete);
		setShowDeleteCategoryModal(true);
	};

	const confirmDeleteCategory = () => {
		setCategoryList(categoryList.filter(category => category !== selectedItemToDelete));
		setObjects(objects.map(obj => obj.type === selectedItemToDelete ? { ...obj, type: categoryList[0] || '' } : obj));
		setShowDeleteCategoryModal(false);
		setSelectedItemToDelete(null);
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
		setObjects(objects.filter(obj => obj.id !== selectedItemToDelete));
		// Mettre à jour le statut de l'alerte associée
		if (selectedAlertToApprove) {
			setAlerts(alerts.map(a => 
				a.id === selectedAlertToApprove.id ? { ...a, status: 'approved' } : a
			));
			toast.success('Objet supprimé et demande approuvée');
		}
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
		} else {
			// Ajout d'un nouvel objet
			const newObject = {
				id: `obj_${Date.now()}`,
				...objectFormData
			};
			setObjects([...objects, newObject]);
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

	// Remplacer le console.log et alert pour les équipements
	const handleShowEquipment = (room) => {
		setSelectedEquipmentInfo({
			roomName: room.name,
			equipmentCount: equipments[room.id].length
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
		toast.success(`Thème ${theme === 'light' ? 'clair' : 'sombre'} appliqué`);
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

		setObjects(updatedObjects);

		// Vérifier les seuils d'alerte
		const activeObjects = updatedObjects.filter(obj => 
			obj.status === 'Actif' || obj.status === 'Allumé'
		).length;
		const totalObjects = updatedObjects.length;
		const activePercentage = (activeObjects / totalObjects) * 100;

		if (activePercentage > globalRules.alertThreshold) {
			// Créer une alerte si le seuil est dépassé
			const newAlert = {
				id: Date.now(),
				type: 'alert',
				title: 'Seuil d\'activité dépassé',
				message: `Le nombre d'objets actifs (${activePercentage.toFixed(1)}%) dépasse le seuil configuré (${globalRules.alertThreshold}%)`,
				objectId: null,
				priority: 'high',
				timestamp: new Date().toISOString(),
				status: 'pending'
			};

			// Vérifier si l'alerte n'existe pas déjà
			if (!alerts.some(alert => 
				alert.type === 'alert' && 
				alert.title === newAlert.title && 
				alert.status === 'pending'
			)) {
				setAlerts([...alerts, newAlert]);
			}
		}
	}, [objects, globalRules, alerts]);


	// Charge les données au démarrage du composant
	useEffect(() => {
		fetchUsers();
		fetchObjects();
		fetchReports();
		fetchUserHistory();
	}, [fetchReports]);

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
	applyValidationMode, applyTheme
  };	
};
