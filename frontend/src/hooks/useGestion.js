// Import des dépendances et composants nécessaires
import { useState, useEffect} from 'react';
import { toast } from 'react-toastify';
import { dataObjects, categories, equipments } from '../data/projectData';

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
    const [selectedReport, setSelectedReport] = useState('total');
    const [timeFilter, setTimeFilter] = useState('day');
    const [historyTimeFilter, setHistoryTimeFilter] = useState('day');
    const [chartType, setChartType] = useState('line');

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
        const getFilteredDates = (filter) => {
            const dates = [];
            const today = new Date();
            
            switch(filter) {
              case 'week':
                for(let i = 6; i >= 0; i--) {
                  const date = new Date();
                  date.setDate(today.getDate() - i);
                  dates.push(date.toISOString().split('T')[0]);
                }
                break;
              case 'month':
                for(let i = 29; i >= 0; i--) {
                  const date = new Date();
                  date.setDate(today.getDate() - i);
                  dates.push(date.toISOString().split('T')[0]);
                }
                break;
              default: // day
                dates.push(today.toISOString().split('T')[0]);
            }
            return dates;
        };
      
        const generateEnergyData = (objs, dates) =>
          dates.map(date => ({
            date,
            value: Math.round(objs.reduce((sum, obj) => 
              sum + (obj.status === 'active' ? 50 + Math.random() * 20 : 20)
            , 0))
          }));
      
        const dates = getFilteredDates(timeFilter);
        
        const salles = objectsToAnalyze.filter(obj => categories.salles.items.includes(obj.id));
        const ecole = objectsToAnalyze.filter(obj => categories.ecole.items.includes(obj.id));
        const parking = objectsToAnalyze.filter(obj => categories.parking.items.includes(obj.id));
      
        setReports({
          total: generateEnergyData(objectsToAnalyze, dates),
          salles: generateEnergyData(salles, dates),
          ecole: generateEnergyData(ecole, dates),
          parking: generateEnergyData(parking, dates)
        });

        // 🔥 Mise à jour de l'historique des consommations par objet
        setObjectHistories(prevHistories => {
            const updatedHistories = { ...prevHistories };
            
            objectsToAnalyze.forEach(obj => {
              if (!updatedHistories[obj.id]) {
                updatedHistories[obj.id] = [];
              }
              updatedHistories[obj.id].push({
                date: new Date().toISOString().split('T')[0],
                value: obj.status === 'active' ? 50 : 20
              });
            });
          
            return updatedHistories;
        });
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

    // Ajout de la fonction isNameUnique
    const isNameUnique = (name, objects, excludeId = null) => {
        return !allObjects.some(obj => 
            obj.name.toLowerCase() === name.toLowerCase() && 
            obj.id !== excludeId
        );
    };

    // Gestionnaire pour la soumission du formulaire d'objet
    const handleObjectSubmit = (e) => {
        e.preventDefault();
        
        if (!isNameUnique(objectFormData.name, allObjects, editingObject?.id)) {
            return false; // Indique l'échec de la validation
        }
        
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
        
        const categoryItems = categories[selectedCategory]?.items || [];
        const updatedFilteredObjects = updatedAllObjects.filter(obj => categoryItems.includes(obj.id));
        setObjects(updatedFilteredObjects);

        // 🔁 Mise à jour de la catégorie active si nécessaire
        const updatedCategory = objectFormData.category;
        setSelectedCategory(updatedCategory); // <- forcer le passage à cette catégorie
        
        setSelectedCategory(updatedCategory); // C’est le useEffect qui fera le reste

        setShowObjectModal(false);
        setEditingObject(null);
        return true; // Indique le succès
    };
    
    // Gestionnaire pour les actions sur les alertes
    const handleCategoryChange = (categoryKey) => {
        const prefixMap = {
          salles: 'salle',
          ecole: 'ecole',
          parking: 'parking'
        };
      
        setSelectedCategory(categoryKey);
      
        const prefix = prefixMap[categoryKey] || '';
        const categoryItems = categories[categoryKey]?.items || [];
      
        const filteredObjects = allObjects.filter(obj =>
          categoryItems.includes(obj.id) || obj.id.startsWith(prefix)
        );
      
        setObjects(filteredObjects);
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
        
        // Initialiser les paramètres en fonction du type d'objet
        const defaultSettings = {
            // Paramètres de base
            temperature: '',
            startTime: '',
            endTime: '',
            
            // Paramètres par type
            mode: 'auto',
            brightness: '100',
            resolution: '1080p',
            detectionMode: 'mouvement',
            speed: '50',
        };

        // Récupérer les paramètres existants ou utiliser les valeurs par défaut
        setObjectSettings({
            ...defaultSettings,
            ...object.settings
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

    useEffect(() => {
        const count = allObjects.filter(obj => obj.status === 'inactive').length;
        setInactiveCount(count);
      }, [allObjects]);

      
    // Effet pour charger les données initiales
    useEffect(() => {
        if (allObjects.length === 0) {
          // Fusionner dataObjects + équipements
          const baseObjects = [...dataObjects];
      
          Object.entries(equipments).forEach(([roomId, roomEquipments]) => {
            roomEquipments.forEach(equipment => {
              baseObjects.push({
                ...equipment,
                roomId,
                settings: {
                  temperature: equipment.targetTemp || null,
                  startTime: equipment.schedule?.split('-')[0] || '',
                  endTime: equipment.schedule?.split('-')[1] || ''
                }
              });
            });
          });
      
          setAllObjects(baseObjects); // Stockage final
        }
      }, [allObjects.length]);
       // 👈 ce useEffect ne tourne qu'une fois au montage
    
       useEffect(() => {
        const prefixMap = {
          salles: 'salle',
          ecole: 'ecole',
          parking: 'parking'
        };
      
        const prefix = prefixMap[selectedCategory] || '';
      
        const categoryItems = categories[selectedCategory]?.items || [];
      
        const filteredObjects = allObjects.filter(object =>
          categoryItems.includes(object.id) || object.id.startsWith(prefix)
        );
      
        setObjects(filteredObjects);
      }, [selectedCategory, allObjects]);
      
     // 👈 nouvelle dépendance ici

    // 🔥 Nouveau useEffect pour générer la conso globale de tous les objets
    useEffect(() => {
        if (allObjects.length > 0) {
          generateReports(allObjects);
        }
    }, [allObjects]);
  

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
    isNameUnique, // Ajout de isNameUnique dans le return
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
    reports, setReports,
    selectedReport, setSelectedReport,
    timeFilter, setTimeFilter,
    historyTimeFilter, setHistoryTimeFilter,
    chartType, setChartType,
  };
};
