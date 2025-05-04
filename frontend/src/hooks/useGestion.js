// Import des dépendances et composants nécessaires
import { useState, useEffect} from 'react';
import { toast } from 'react-toastify';
import { categories, equipments } from '../data/projectData';
import axios from 'axios';

// Configuration des types d'objets autorisés par catégorie
export const categoryToTypeMap = {
  salles: ['salle', 'chauffage', 'eclairage', 'sysaudio', 'ventilation', 'store', 'projecteur'],
  ecole: ['camera', 'porte', 'eclairage', 'panneau', 'capteur', 'grille', 'alarme'],
  parking: ['camera', 'capteur', 'eclairage', 'panneau', 'borne', 'barriere']
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
    const [initialSettings, setInitialSettings] = useState({});

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
    
    useEffect(() => {
      const fetchAll = async () => {
        try {
          const { data } = await axios.get('/api/objets');
          // renommer nom→name et etat→status
          const mapped = data.map(o => ({
            id:     o.id,
            name:   o.nom,
            type:   o.type,
            status: o.etat,
            // Ajouter tous les autres champs potentiellement utiles
            settings: o.settings || {},
            location: o.location || '',
            description: o.description || ''
          }));
          setAllObjects(mapped);
          
          // Initialiser la liste filtrée pour la catégorie courante
          const initial = mapped.filter(obj => 
            categoryToTypeMap[selectedCategory] && 
            categoryToTypeMap[selectedCategory].includes(obj.type.toLowerCase())
          );
          setObjects(initial);
          
          console.log("Objets récupérés:", mapped);
          console.log("Objets filtrés pour", selectedCategory, ":", initial);
          
        } catch (err) {
          console.error('Erreur chargement objets :', err);
          toast.error("Impossible de charger les objets depuis la BDD");
        }
      };
      fetchAll();
    }, []); // une seule fois au montage
    

    useEffect(() => {
      axios.get('/api/alertes')
        .then(({ data }) => setAlerts(data))
        .catch(console.error);
    }, []);

    // Ta fonction pour créer une nouvelle alerte
 // useGestionState.js

 const handleCreateAlert = async (object) => {
  try {
    const objetName = object.name;
    const message   = `Une alerte a été déclenchée pour l'objet ${objetName}`;
    
    // Envoyer le message et l'ID de l'objet
    const { data: newAlert } = await axios.post('http://localhost:5001/api/alerte', { 
      message, 
      idObjet: object.id // S'assurer que l'ID de l'objet est envoyé
    });

    // Met à jour la liste en front
    setAlerts(prev => [newAlert, ...prev]);

    toast.success(`Alerte créée pour ${objetName}`);
  } catch (err) {
    console.error('Erreur création alerte :', err);
    toast.error(`Échec de la création de l'alerte pour ${object.name}`);
  }
};

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
              sum + (obj.status === 'active' || obj.status === 'Actif' ? 50 + Math.random() * 20 : 20)
            , 0))
          }));
      
        const dates = getFilteredDates(timeFilter);
        
        // Filtrer par type en tenant compte de la casse
        const salles = objectsToAnalyze.filter(obj => 
            categoryToTypeMap.salles.some(type => obj.type.toLowerCase() === type)
        );
        const ecole = objectsToAnalyze.filter(obj => 
            categoryToTypeMap.ecole.some(type => obj.type.toLowerCase() === type)
        );
        const parking = objectsToAnalyze.filter(obj => 
            categoryToTypeMap.parking.some(type => obj.type.toLowerCase() === type)
        );

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
                value: obj.status === 'active' || obj.status === 'Actif' ? 50 : 20
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
        // Extraire le numéro de l'ID (qui peut être un nombre ou une chaîne)
        let numero = '';
        if (object.id) {
            // Convertir l'ID en chaîne si c'est un nombre
            const idStr = String(object.id);
            // Extraire uniquement les chiffres si possible
            const match = idStr.match(/\d+/);
            numero = match ? match[0] : idStr;
        }
        
        setObjectFormData({
            name: object.name,
            description: object.description || '',
            status: object.status,
            type: object.type,
            category: selectedCategory,
            numero: numero,
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
    const handleObjectSubmit = async (e) => {
        e.preventDefault();
        
        if (!isNameUnique(objectFormData.name, allObjects, editingObject?.id)) {
            return false; // Indique l'échec de la validation
        }
        
        const prefixMap = {
            salles: 'salle',
            ecole: 'ecole',
            parking: 'parking'
        };
        
        try {
            // Générer un ID en fonction du formulaire
            let newId;
            let updatedAllObjects = [...allObjects]; // Créer une copie pour travailler dessus
            
            if (editingObject) {
                // Pour la modification, conserver l'ID numérique existant si c'est un nombre
                newId = typeof editingObject.id === 'number' ? editingObject.id : `${prefixMap[objectFormData.category] || 'obj'}${objectFormData.numero}`;
                
                // TODO: Implémenter l'édition via l'API
                // Pour l'instant, nous utilisons la mise à jour locale
                const newObject = {
                    id: newId,
                    name: objectFormData.name,
                    description: objectFormData.description || '',
                    type: objectFormData.type.toLowerCase(),
                    status: objectFormData.status,
                    location: objectFormData.location || '',
                    settings: {
                        temperature: objectFormData.targetTemp || null,
                        startTime: objectFormData.brightnessSchedule?.split('-')[0] || '',
                        endTime: objectFormData.brightnessSchedule?.split('-')[1] || ''
                    }
                };
                
                updatedAllObjects = allObjects.filter(obj => obj.id !== editingObject.id);
                updatedAllObjects.push(newObject);
                
            } else {
                // Pour un nouvel objet, envoyer la requête à l'API
                const { data } = await axios.post('/api/objets', {
                    type: objectFormData.type.toLowerCase(),
                    nom: objectFormData.name
                });
                
                console.log("Objet créé dans la base de données:", data);
                
                // Créer un objet complet avec les données de la réponse et le reste des informations du formulaire
                const newObject = {
                    id: data.id,
                    name: data.nom,
                    type: objectFormData.type.toLowerCase(),
                    status: 'Actif', // Statut par défaut pour un nouvel objet
                    description: objectFormData.description || '',
                    location: objectFormData.location || '',
                    settings: {
                        temperature: objectFormData.targetTemp || null,
                        startTime: objectFormData.brightnessSchedule?.split('-')[0] || '',
                        endTime: objectFormData.brightnessSchedule?.split('-')[1] || ''
                    }
                };
                
                // Ajouter le nouvel objet à la liste des objets
                updatedAllObjects = [...allObjects, newObject];
                toast.success(`Objet ${newObject.name} créé avec succès`);
            }
            
            // Mettre à jour la liste complète des objets
            setAllObjects(updatedAllObjects);
            
            // Filtrer les objets en fonction du type pour la catégorie actuelle
            const filteredObjects = updatedAllObjects.filter(obj => 
                categoryToTypeMap[objectFormData.category] && 
                categoryToTypeMap[objectFormData.category].includes(obj.type.toLowerCase())
            );
            setObjects(filteredObjects);

            // Mise à jour de la catégorie active
            setSelectedCategory(objectFormData.category);

            setShowObjectModal(false);
            setEditingObject(null);
            return true; // Indique le succès
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'objet:", error);
            toast.error(`Erreur lors de l'ajout de l'objet: ${error.message}`);
            return false;
        }
    };
    
    // Gestionnaire pour les actions sur les alertes
    const handleCategoryChange = (categoryKey) => {
      setSelectedCategory(categoryKey);
      const types = categoryToTypeMap[categoryKey]; // ex ['salle','chauffage',…]
      
      if (types && allObjects.length > 0) {
        const filtered = allObjects.filter(obj => 
          types.includes(obj.type.toLowerCase())
        );
        setObjects(filtered);
        console.log(`Changement catégorie vers ${categoryKey}:`, filtered);
      }
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
    
    // // --------- Gestion des alertes ---------
    // const handleCreateAlert = (object) => {
    //     // Créer une nouvelle alerte pour l'objet
    //     const newAlert = {
    //         id: Date.now(), // Un identifiant unique pour l'alerte
    //         message: `Problème détecté pour ${object.name}, veuillez contacter un administrateur.`, // Message de l'alerte
    //         objectId: object.id,
    //     };
        
    //     // Ajouter l'alerte à l'état des alertes
    //     setAlerts(prevAlerts => [...prevAlerts, newAlert]);
        
    //     // Optionnel : afficher une alerte en pop-up
    //     setAlertMessage(`L'alerte pour l'objet ${object.name} a été créée.`);
    //     setShowAlert(true);
    // };
    
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
        // Convertir le type en minuscule pour la comparaison
        const type = obj.type.toLowerCase();
        
        if (type === 'chauffage') {
            return parseInt(obj.settings?.temperature) > 24;
        }
        if (type === 'eclairage') {
            const [start, end] = [obj.settings?.startTime, obj.settings?.endTime];
            return start === '00:00' && end === '23:59';
        }
        return false;
    };
        
    const handleOpenSettings = (object) => {
        setInitialSettings({ ...object.settings });
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

    const handleSaveSettings = (object) => {
            // Met à jour la liste globale des objets
            const updatedAll = allObjects.map(obj =>
              obj.id === object.id
                ? { ...obj, settings: objectSettings }
                : obj
            );
            setAllObjects(updatedAll);
            // Met à jour la liste filtrée si besoin
            setObjects(prev => prev.map(obj =>
              obj.id === object.id
                ? { ...obj, settings: objectSettings }
                : obj
            ));
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
      
       // 👈 ce useEffect ne tourne qu'une fois au montage
    
    useEffect(() => {
      // Filtrage basé uniquement sur les types d'objets définis dans categoryToTypeMap
      // et non plus sur les items prédéfinis dans les catégories
      if (allObjects.length > 0) {
        const filteredObjects = allObjects.filter(object =>
          categoryToTypeMap[selectedCategory] && 
          categoryToTypeMap[selectedCategory].includes(object.type.toLowerCase())
        );
        
        console.log("Objets filtrés après changement de catégorie:", filteredObjects);
        setObjects(filteredObjects);
      }
    }, [selectedCategory, allObjects]);
      
     // 👈 nouvelle dépendance ici

    useEffect(() => {
        if (allObjects.length > 0) {
          generateReports(allObjects);
        }
    }, [allObjects]);
  

  return {
    initialSettings,
    handleSaveSettings,
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
