// Import des dépendances et composants nécessaires
import { useState, useEffect} from 'react';
import { dataObjects, categories } from '../data/projectData';

// Configuration des types d'objets autorisés par catégorie
export const categoryToTypeMap = {
  salles: ['Salle', 'Chauffage', 'Éclairage', 'Audio', 'Ventilation'],
  ecole: ['Caméra', 'Porte', 'Éclairage', 'Panneau', 'Securite'],
  parking: ['Caméra', 'Capteur', 'Éclairage', 'Panneau', 'Borne']
};

export const useGestionState = () => {
    // États pour la gestion des objets
    const [objects, setObjects] = useState([]); // Liste des objets filtrés par catégorie
    const [selectedCategory, setSelectedCategory] = useState('salles'); // Catégorie active
    const [showObjectModal, setShowObjectModal] = useState(false); // Visibilité modal d'ajout/édition
    const [inactiveCount, setInactiveCount] = useState(0); // Nombre d'objets inactifs
    const [objectHistories, setObjectHistories] = useState({}); // Historique des consommations
    const [allObjects, setAllObjects] = useState([]); // Liste complète des objets

    // États pour les alertes et confirmations
    const [showAlert, setShowAlert] = useState(false); // Affichage des messages d'alerte
    const [alertMessage, setAlertMessage] = useState(''); // Contenu du message d'alerte
    const [showConfirmation, setShowConfirmation] = useState(false); // Dialogue de confirmation
    const [confirmationMessage, setConfirmationMessage] = useState(''); // Message de confirmation
    const [confirmationAction, setConfirmationAction] = useState(null); // Action à exécuter après confirmation

    const [selectedForChart, setSelectedForChart] = useState(null);
    const [editingObject, setEditingObject] = useState(null);

    const [objectFormData, setObjectFormData] = useState({
        name: '',
        category: selectedCategory,
        status: 'active',
        priority: 'normal',
        type: categoryToTypeMap[selectedCategory][0],
        numero: '',
        targetTemp: '',             // pour les Chauffages
        brightnessSchedule: '',     // pour Éclairage (horaire fonctionnement)
    });
    const [objectSettings, setObjectSettings] = useState({});
    const [editingSettingsFor, setEditingSettingsFor] = useState(null);

    // États pour la gestion des réservations
    const [reservations, setReservations] = useState([]);
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [reservationFormData, setReservationFormData] = useState({
        room: '',
        date: '',
        time: '',
    });

    // États pour la gestion des alertes
    const [alerts, setAlerts] = useState([]);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState(null);

    // États pour les rapports
    const [reports, setReports] = useState({
        energyConsumption: [],
        objectUsage: [],
    });

    // Générateur de rapports et statistiques
    const generateReports = (objectsToAnalyze) => {
        const today = new Date().toISOString().split('T')[0];

        // Création des données de consommation
        const energyData = objectsToAnalyze.map(obj => ({
            id: obj.id,
            date: today,
            value: obj.status === 'active' ? 50 : 20 // Simulation de consommation
        }));

        // Détection des objets inefficaces
        const inefficients = objectsToAnalyze.filter(obj => {
            if (obj.type === 'Chauffage') {
            return parseInt(obj.settings?.temperature) > 24; // Température trop élevée
            }
            if (obj.type === 'Éclairage') {
            const [start, end] = [obj.settings?.startTime, obj.settings?.endTime];
            return start === '00:00' && end === '23:59'; // Éclairage 24/7
            }
            return false;
        });

        // Mise à jour des historiques individuels
        setObjectHistories(prev => {
            const updated = { ...prev };
            energyData.forEach(({ id, date, value }) => {
            if (!updated[id]) updated[id] = [];
            updated[id].push({ date, value });
            });
            return updated;
        });

        setReports({
            energyConsumption: energyData,
            objectUsage: inefficients
        });

        const inactifs = objectsToAnalyze.filter(obj => obj.status === 'inactive');
        setInactiveCount(inactifs.length);
    };

    // Fonction d'export des rapports
    const handleExportReport = (type) => {
        // Validation des données
        const data = reports[type];
        if (!data || data.length === 0) {
            setAlertMessage("Aucune donnée à exporter");
            setShowAlert(true);
            return;
        }

        // Conversion et téléchargement
        const csv = convertToCSV(data);
        downloadCSV(csv, `${type}_report.csv`);
    };

    const convertToCSV = (data) => {
        const headers = Object.keys(data[0]);
        const rows = data.map(obj => headers.map(key => obj[key]));
        return [headers.join(','), ...rows.map(r => r.join(',')).join('\n')];
    };

    const downloadCSV = (csv, filename) => {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    };

    const handleEditObject = (object) => {
        setObjectFormData({
            name: object.name,
            description: object.description || '',
            status: object.status,
            type: object.type,
            category: selectedCategory,
            numero: object.id.replace(/^\D+/g, ''), // enlève le préfixe type "salle"
            targetTemp: object.settings?.temperature || '',
            brightnessSchedule: object.settings?.startTime && object.settings?.endTime
            ? `${object.settings.startTime}-${object.settings.endTime}`
            : ''
        });
        setEditingObject(object);
        setShowObjectModal(true);
    };

    // Gestionnaire pour la soumission du formulaire d'objet
    const handleObjectSubmit = (e) => {
        e.preventDefault();
        
        const prefixMap = {
            salles: 'salle',
            ecole: 'ecole',
            parking: 'parking'
        };
        
        const prefix = prefixMap[objectFormData.category] || 'obj';
        const fullId = `${prefix}${objectFormData.numero}`;
        
        if (!editingObject) {
            const idExists =
            dataObjects.some((obj) => obj.id === fullId) ||
            allObjects.some((obj) => obj.id === fullId);
        
            if (idExists) {
            setAlertMessage("Cet identifiant existe déjà ! Choisissez un autre numéro.");
            setShowAlert(true);
            return;
            }
        }
        
        const newObject = {
            id: fullId,
            name: objectFormData.name,
            description: objectFormData.description || '',
            type: objectFormData.type,
            status: objectFormData.status,
            location: fullId,
            ...(objectFormData.type === 'Chauffage' && {
            targetTemp: parseInt(objectFormData.targetTemp) || 0
            }),
            ...(objectFormData.type === 'Éclairage' && {
            schedule: objectFormData.brightnessSchedule || ''
            }),
            settings: {
            temperature: objectFormData.targetTemp || null,
            startTime: objectFormData.brightnessSchedule?.split('-')[0] || '',
            endTime: objectFormData.brightnessSchedule?.split('-')[1] || ''
            }
        };
        
        let updatedAllObjects;
        if (editingObject) {
            updatedAllObjects = allObjects.filter(obj => obj.id !== editingObject.id);
            updatedAllObjects.push(newObject);
        } else {
            updatedAllObjects = [...allObjects, newObject];
        }
        
        
        setAllObjects(updatedAllObjects);
        
        // 🔁 Mise à jour de la catégorie active si nécessaire
        const updatedCategory = objectFormData.category;
        setSelectedCategory(updatedCategory); // <- forcer le passage à cette catégorie
        
        setSelectedCategory(updatedCategory); // C’est le useEffect qui fera le reste

        setShowObjectModal(false);
        setEditingObject(null);
    };
    
    // Gestionnaire pour les actions sur les alertes
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        const categoryObjects = allObjects.filter(object =>
            categories[category]?.items.includes(object.id)
        );
        setObjects(categoryObjects);
        generateReports(categoryObjects);
    };
    
    const handleAddObject = () => {
        setObjectFormData({ name: '', category: selectedCategory, status: 'active', priority: 'normal' });
        setShowObjectModal(true);
    };
    
    const handleAddReservation = () => {
        setReservationFormData({ room: '', date: '', time: '' });
        setShowReservationModal(true);
    };
    
    const handleEditReservation = (reservation) => {
        setReservationFormData({
            room: reservation.room,
            date: reservation.date,
            time: reservation.time,
        });
        setShowReservationModal(true);
    };
    
    const handleDeleteReservation = (reservationId) => {
        setConfirmationMessage('Êtes-vous sûr de vouloir supprimer cette réservation ?');
        setShowConfirmation(true);
        setConfirmationAction(() => () => {
            setReservations(reservations.filter(reservation => reservation.id !== reservationId));
            setShowConfirmation(false);
        });
    };
    
    const handleRequestDeletion = (object) => {
        // Créer une alerte pour demander la suppression de l'objet
        setConfirmationMessage(`Êtes-vous sûr de vouloir demander la suppression de ${object.name} ?`);
        setShowConfirmation(true);
        setConfirmationAction(() => () => {
            // Ici tu peux envoyer un message ou une alerte à l'administrateur, par exemple en ajoutant l'objet à une liste des objets à supprimer
            setAlertMessage(`La demande de suppression pour l'objet ${object.name} a été envoyée à l'administrateur.`);
            setShowAlert(true);
            
            // Tu peux également maintenir une liste d'objets à supprimer (à traiter côté serveur ou administrateur)
            setAlerts(prevAlerts => [...prevAlerts, { message: `Demande de suppression pour ${object.name}`, objectId: object.id }]);
            setShowConfirmation(false);
        });
    };
    
    // --------- Gestion des alertes ---------
    const handleCreateAlert = (object) => {
        // Créer une nouvelle alerte pour l'objet
        const newAlert = {
            id: Date.now(), // Un identifiant unique pour l'alerte
            message: `Problème détecté pour ${object.name}, veuillez contacter un administrateur.`, // Message de l'alerte
            objectId: object.id,
        };
        
        // Ajouter l'alerte à l'état des alertes
        setAlerts(prevAlerts => [...prevAlerts, newAlert]);
        
        // Optionnel : afficher une alerte en pop-up
        setAlertMessage(`L'alerte pour l'objet ${object.name} a été créée.`);
        setShowAlert(true);
    };
    
    const handleAlertAction = (alert) => {
        setSelectedAlert(alert);
        setShowAlertModal(true);
    };
    
    const handleToggleStatus = (object) => {
        const nextStatus = object.status === 'active'
            ? 'inactive'
            : object.status === 'inactive'
            ? 'maintenance'
            : 'active';
        
        const updatedAll = allObjects.map(obj =>
            obj.id === object.id ? { ...obj, status: nextStatus } : obj
        );
        
        setAllObjects(updatedAll);
    };
      
    const isInefficient = (obj) => {
        if (obj.type === 'Chauffage') {
            return parseInt(obj.settings?.temperature) > 24;
        }
        if (obj.type === 'Éclairage') {
            const [start, end] = [obj.settings?.startTime, obj.settings?.endTime];
            return start === '00:00' && end === '23:59';
        }
        return false;
    };
        
    const handleOpenSettings = (object) => {
        setEditingSettingsFor(object);
        
        setObjectSettings({
            temperature: object.settings?.temperature || '',
            startTime: object.settings?.startTime || '',
            endTime: object.settings?.endTime || ''
        });
        
        setObjects(prev => {
            const updated = prev.map(obj =>
            obj.id === object.id
                ? { ...obj, settings: { ...objectSettings } }
                : obj
            );
            generateReports(updated);
            return updated;
        });
    };
      
    const handleReservationSubmit = (e) => {
        e.preventDefault();
        
        if (reservationFormData.id) {
            // Modification d'une réservation existante
            setReservations(prev =>
            prev.map(res =>
                res.id === reservationFormData.id
                ? { ...res, ...reservationFormData }
                : res
            )
            );
        } else {
            // Nouvelle réservation
            const newReservation = {
            id: Date.now(),
            ...reservationFormData
            };
            setReservations(prev => [...prev, newReservation]);
        }
        
        setShowReservationModal(false);
    };

    // Effet pour charger les données initiales
    useEffect(() => {
    // Ne charger dataObjects qu'une seule fois (au montage)
        if (allObjects.length === 0) {
            const filteredObjects = dataObjects
            .filter(obj => !['grille_ecole', 'cam_urgence', 'detecteur_fumee', 'acces_parking', 'eclairage_parking', 'borne_recharge', 'detecteur_parking','capteur789'].includes(obj.id))
            .map(obj => ({
                ...obj,
                settings: obj.settings || {
                temperature: obj.targetTemp || null,
                startTime: obj.schedule?.split('-')[0] || '',
                endTime: obj.schedule?.split('-')[1] || ''
                }
            })); 
        
            setAllObjects(filteredObjects);
        }
    }, [allObjects.length]); // 👈 ce useEffect ne tourne qu'une fois au montage
    
    useEffect(() => {
        const categoryObjects = allObjects.filter(object =>
            categories[selectedCategory]?.items.includes(object.id)
        );
        setObjects(categoryObjects);
        generateReports(categoryObjects);
    }, [selectedCategory, allObjects]); // 👈 nouvelle dépendance ici

  return {
    generateReports, handleExportReport,
    convertToCSV, downloadCSV,
    handleEditObject, handleObjectSubmit,
    handleCategoryChange, handleAddObject,
    handleAddReservation, handleEditReservation,
    handleDeleteReservation, handleRequestDeletion,
    handleCreateAlert, handleAlertAction,
    handleToggleStatus, handleOpenSettings,
    handleReservationSubmit,
    isInefficient,
    objects, setObjects,
    selectedCategory, setSelectedCategory,
    showObjectModal, setShowObjectModal,
    inactiveCount, setInactiveCount,
    objectHistories, setObjectHistories,
    allObjects, setAllObjects,
    showAlert, setShowAlert,
    alertMessage, setAlertMessage,
    showConfirmation, setShowConfirmation,
    confirmationMessage, setConfirmationMessage,
    confirmationAction, setConfirmationAction,
    selectedForChart, setSelectedForChart,
    editingObject, setEditingObject,
    objectFormData, setObjectFormData,
    objectSettings, setObjectSettings,
    editingSettingsFor, setEditingSettingsFor,
    reservationFormData, setReservationFormData,
    showReservationModal, setShowReservationModal,
    reservations, setReservations,
    showAlertModal, setShowAlertModal,
    selectedAlert, setSelectedAlert,
    alerts, setAlerts,
    reports, setReports
  };
};
