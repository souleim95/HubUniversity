import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
import { SearchContainer, SearchBar } from '../styles/HeaderStyles';
import styled from 'styled-components';
import { fakeObjects, categories, equipments } from '../data/fakeData';
import { getIcon } from '../utils/iconUtils'; // Importer getIcon depuis le fichier utilitaire

// Styles additionnels pour améliorer l'interface
const SearchResultsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 5px;
  padding: 10px;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  font-family: Arial, sans-serif;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  flex: 1;
  min-width: 120px;
`;

const ResultItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f0f7ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
  
  .status {
    font-size: 0.85em;
    padding: 2px 6px;
    border-radius: 4px;
    display: inline-block;
    background-color: ${props => {
      if (props.status === 'Actif' || 
          props.status === 'Allumé' || 
          props.status === 'Disponible' || 
          props.status === 'Ouverte' || 
          props.status === 'Normal' || 
          props.status === 'Prêt' || 
          props.status === 'Libre') 
        return '#4CAF50';
      if (props.status === 'Inactif' || props.status === 'Éteint' || props.status === 'Occupée' || props.status === 'Fermée')
        return '#f44336';
      if (props.status === 'Maintenance' || props.status === 'Alerte')
        return '#ff9800';
      return '#9e9e9e';
    }};
    color: white;
  }
`;

const NoResults = styled.div`
  padding: 15px;
  text-align: center;
  color: #666;
`;

const SearchButton = styled.div`
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const SearchBox = ({ onSelectObject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  
  // Extraire tous les types d'objets disponibles
  const objectTypes = [...new Set(fakeObjects.map(obj => obj.type))].sort();
  
  // Extraire tous les statuts possibles
  const statusTypes = [...new Set(fakeObjects.map(obj => obj.status))].sort();

  // Extraire et trier les catégories
  const sortedCategories = Object.entries(categories)
    .map(([key, value]) => ({ key, name: value.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchText('');
      setFilterType('all');
      setFilterStatus('all');
      setFilterCategory('all');
      setSearchResults([]);
    } else {
      // Focus sur l'input quand on ouvre la recherche
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  };

  // Optimisation de la fonction de recherche avec useCallback
  const performSearch = useCallback(() => {
    // Ne pas rechercher si tous les filtres sont vides ou par défaut
    if (searchText.trim() === '' && filterType === 'all' && filterStatus === 'all' && filterCategory === 'all') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      // Effectuer la recherche réelle
      const results = fakeObjects.filter(obj => {
        // Filtre par texte (nom ou id)
        const textMatch = 
          searchText.trim() === '' || 
          obj.name.toLowerCase().includes(searchText.toLowerCase()) || 
          obj.id.toLowerCase().includes(searchText.toLowerCase());
        
        // Filtre par type
        const typeMatch = filterType === 'all' || obj.type === filterType;
        
        // Filtre par statut
        const statusMatch = filterStatus === 'all' || obj.status === filterStatus;
        
        // Filtre par catégorie (utilise le mapping des catégories)
        let categoryMatch = filterCategory === 'all';
        
        if (!categoryMatch && categories[filterCategory] && categories[filterCategory].items) {
          categoryMatch = categories[filterCategory].items.includes(obj.id);
        }
        
        // L'objet doit correspondre à tous les critères actifs
        return textMatch && typeMatch && statusMatch && categoryMatch;
      });
      
      // Tri des résultats par nom pour une meilleure lisibilité
      results.sort((a, b) => a.name.localeCompare(b.name));
      
      setSearchResults(results);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchText, filterType, filterStatus, filterCategory]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    performSearch();
  };
  
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
            const roomObj = fakeObjects.find(o => o.id === roomId);
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

  return (
    <SearchContainer isOpen={isOpen}>
      <SearchButton onClick={toggleSearch} aria-label="Ouvrir la recherche">
        {isOpen ? (
          <FaTimes 
            size={24} 
            style={{ transform: 'rotate(180deg)', transition: 'transform 0.3s' }} 
            aria-label="Fermer la recherche"
          />
        ) : (
          <FaSearch size={24} aria-label="Ouvrir la recherche" />
        )}
      </SearchButton>
      <form onSubmit={handleSubmit}>
        <SearchBar 
          ref={searchInputRef}
          type="text"
          isOpen={isOpen}
          value={searchText || ''}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Rechercher par nom ou identifiant..."
          style={{ transition: 'width 0.3s ease' }}
        />
        {isOpen && (
          <FiltersContainer>
            <FilterSelect 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              aria-label="Filtrer par type"
            >
              <option value="all">Tous les types</option>
              {objectTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </FilterSelect>
            
            <FilterSelect 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filtrer par statut"
            >
              <option value="all">Tous les statuts</option>
              {statusTypes.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </FilterSelect>
            
            <FilterSelect 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              aria-label="Filtrer par catégorie"
            >
              <option value="all">Toutes les catégories</option>
              {sortedCategories.map(category => (
                <option key={category.key} value={category.key}>{category.name}</option>
              ))}
            </FilterSelect>
          </FiltersContainer>
        )}
      </form>
      
      {isOpen && searchResults.length > 0 && (
        <SearchResultsContainer>
          <h3 style={{ 
            margin: '0 0 12px 0', 
            borderBottom: '1px solid #ddd', 
            paddingBottom: '8px',
            color: '#333',
            display: 'flex',
            alignItems: 'center' 
          }}>
            <FaFilter style={{ marginRight: '10px' }} /> 
            {searchResults.length === 1 
              ? '1 résultat trouvé' 
              : `${searchResults.length} résultats trouvés`}
          </h3>
          {searchResults.map((item, index) => (
            <ResultItem 
              key={item.id} 
              onClick={() => handleSelectResult(item)}
              status={item.status}
            >
              <div style={{ fontSize: '1.5em', display: 'flex', alignItems: 'center' }}>{getIcon(item.type)}</div>
              <div>
                <strong>{item.name}</strong>
                <div style={{ fontSize: '0.85em', marginTop: '5px' }}>
                  <span style={{ color: '#666' }}>{item.type}</span>
                  {' • '}
                  <span className="status">{item.status}</span>
                </div>
              </div>
            </ResultItem>
          ))}
        </SearchResultsContainer>
      )}
      
      {isOpen && searchText.trim() !== '' && searchResults.length === 0 && (
        <SearchResultsContainer>
          <NoResults>
            <div>🔍 Aucun résultat trouvé pour "<strong>{searchText}</strong>"</div>
          </NoResults>
        </SearchResultsContainer>
      )}
    </SearchContainer>
  );
};

export default SearchBox;
