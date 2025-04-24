import { useState, useCallback, useRef, useEffect } from 'react';
import { dataObjects, categories, equipments } from '../data/projectData';

export const useSearchState = ({ onSelectObject, isOpen: externalIsOpen, onClose, onOpen }) => {
    // États pour gérer l'interface de recherche et les filtres
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState('all'); // Filtre par type
    const [filterStatus, setFilterStatus] = useState('all'); // Filtre par statut
    const [filterCategory, setFilterCategory] = useState('all'); // Filtre par catégorie
    const [searchResults, setSearchResults] = useState([]);  // Résultats de recherche
    const [isSearching, setIsSearching] = useState(false); // État de chargement

    // Références pour la gestion du focus et des clics
    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null);

    // Extraire tous les statuts possibles
    const statusTypes = [...new Set(dataObjects.map(obj => obj.status))].sort();

    // Extraire et trier les catégories
    const sortedCategories = Object.entries(categories)
        .map(([key, value]) => ({ key, name: value.name }))
        .sort((a, b) => a.name.localeCompare(b.name));

    const toggleSearch = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (!newState && onClose) onClose();
        if (newState && onOpen) onOpen();
    };

    // Fonction optimisée de recherche avec gestion des filtres
    const performSearch = useCallback(() => {
        if (searchText.trim() === '' && filterType === 'all' && filterStatus === 'all' && filterCategory === 'all') {
        setSearchResults([]);
        setIsSearching(false);
        return;
        }

        setIsSearching(true);
        try {
        let results = [];
        
        // Recherche dans les objets principaux
        const mainObjects = dataObjects.filter(obj => {
            const textMatch = searchText.trim() === '' || 
            obj.name.toLowerCase().includes(searchText.toLowerCase()) || 
            obj.id.toLowerCase().includes(searchText.toLowerCase());
            
            const typeMatch = filterType === 'all' || obj.type === filterType;
            const statusMatch = filterStatus === 'all' || obj.status === filterStatus;
            let categoryMatch = filterCategory === 'all';
            
            if (!categoryMatch && categories[filterCategory]?.items) {
            categoryMatch = categories[filterCategory].items.includes(obj.id);
            }
            
            return textMatch && typeMatch && statusMatch && categoryMatch;
        });
        
        results.push(...mainObjects);

        // Recherche dans les équipements
        Object.entries(equipments).forEach(([roomId, roomEquipments]) => {
            const roomEquipmentResults = roomEquipments.filter(equip => {
            const textMatch = searchText.trim() === '' || 
                equip.name.toLowerCase().includes(searchText.toLowerCase()) || 
                equip.id.toLowerCase().includes(searchText.toLowerCase());
            
            const typeMatch = filterType === 'all' || equip.type === filterType;
            const statusMatch = filterStatus === 'all' || equip.status === filterStatus;
            let categoryMatch = filterCategory === 'all';
            
            // Vérifier la catégorie de la salle parente
            if (!categoryMatch) {
                for (const [catKey, catValue] of Object.entries(categories)) {
                if (catValue.items && (catValue.items.includes(roomId) || catValue.items.includes(equip.id))) {
                    categoryMatch = catKey === filterCategory;
                    break;
                }
                }
            }
            
            return textMatch && typeMatch && statusMatch && categoryMatch;
            });

            results.push(...roomEquipmentResults);
        });

        // Suppression des doublons par ID
        results = [...new Map(results.map(item => [item.id, item])).values()];
        results.sort((a, b) => a.name.localeCompare(b.name));
        
        setSearchResults(results);
        } catch (error) {
        console.error("Erreur lors de la recherche:", error);
        setSearchResults([]);
        } finally {
        setIsSearching(false);
        }
    }, [searchText, filterType, filterStatus, filterCategory]);

    // Naviguer vers l'objet sélectionné
    const handleSelectResult = (obj) => {
        // Éviter les clics accidentels ou multiples
        if (isSearching) return;
        
        try {
        // Trouver la catégorie de l'objet
        let objectCategory = null;
        
        for (const [key, value] of Object.entries(categories)) {
            if (value.items && value.items.includes(obj.id)) {
            objectCategory = key;
            break;
            }
        }
        
        // Essayer de trouver dans les équipements si pas trouvé dans les objets globaux
        if (!objectCategory) {
            for (const [roomId, roomData] of Object.entries(equipments)) {
            if (roomData && roomData.some(equip => equip.id === obj.id)) {
                // Trouver la catégorie de la salle
                const roomObj = dataObjects.find(o => o.id === roomId);
                if (roomObj) {
                for (const [catKey, catValue] of Object.entries(categories)) {
                    if (catValue.items && catValue.items.includes(roomObj.id)) {
                    objectCategory = catKey;
                    break;
                    }
                }
                }
                break; // Sortir de la boucle des équipements une fois trouvé
            }
            }
        }
        
        // Si une catégorie a été trouvée, la sélectionner
        if (objectCategory) {
            // Si c'est une salle, la sélectionner aussi
            if (obj.type === 'Salle') {
            // L'action de sélection est gérée dans le Header/Dashboard via le state
            } else {
            // Idem pour les équipements/objets
            }
        }
        
        // Si une fonction de callback a été fournie, l'appeler
        if (onSelectObject) {
            onSelectObject(obj, objectCategory);
        }
        
        // Fermer la recherche après un court délai pour montrer à l'utilisateur que son action a été prise en compte
        setTimeout(() => {
            setIsOpen(false);
        }, 200);
        } catch (error) {
        console.error("Erreur lors de la navigation vers l'objet:", error);
        }
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        performSearch();
    };

  // Effets
    // Déclencher la recherche automatiquement lorsque les filtres changent
    useEffect(() => {
      if (isOpen) {
        // Ajout d'un délai pour ne pas lancer trop de recherches
        const timer = setTimeout(() => {
          performSearch();
        }, 300);
        
        return () => clearTimeout(timer);
      }
    }, [searchText, filterType, filterStatus, filterCategory, isOpen, performSearch]);
    
    // Gestion des interactions extérieures (clic hors zone)
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
  
      // Ajout de l'écouteur d'événement si la recherche est ouverte
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      
      // Nettoyage à la désactivation
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);
  
    // Synchroniser l'état externe avec l'état interne
    useEffect(() => {
      if (externalIsOpen !== undefined) {
        setIsOpen(externalIsOpen);
      }
    }, [externalIsOpen]);

    return {
        isOpen,
        searchText,
        filterType,
        filterStatus,
        filterCategory,
        searchResults,
        isSearching,
        searchInputRef,
        searchContainerRef,
        statusTypes,
        sortedCategories,
        setSearchText,
        setFilterType,
        setFilterStatus,
        setFilterCategory,
        toggleSearch,
        handleSelectResult,
        handleSubmit,
        performSearch
    };
};
