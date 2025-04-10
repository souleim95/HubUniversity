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
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  max-height: 450px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 10px;
  padding: 15px;
  scrollbar-width: thin;
  scrollbar-color: #ccc #f5f5f5;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 10px;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
  margin-bottom: 15px;
  flex-wrap: wrap;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const FilterSelect = styled.select`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: white;
  flex: 1;
  min-width: 120px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 12px top 50%;
  background-size: 12px auto;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #aaa;
  }
  
  &:focus {
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
    outline: none;
  }
`;

const ResultItem = styled.div`
  padding: 14px;
  border-bottom: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f0f7ff;
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0,0,0,0.08);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
  
  .status {
    font-size: 0.85em;
    padding: 3px 8px;
    border-radius: 20px;
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
    font-weight: 500;
  }
`;

const NoResults = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
`;

const SearchButton = styled.div`
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ResultsHeader = styled.h3`
  margin: 0 0 15px 0;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 10px;
  color: #333;
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
`;

const SearchWrapper = styled.div`
  position: relative;
  z-index: 1001;
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
  const searchContainerRef = useRef(null);
  
  // Extraire tous les types d'objets disponibles
  const objectTypes = [...new Set(fakeObjects.map(obj => obj.type))].sort();
  
  // Extraire tous les statuts possibles
  const statusTypes = [...new Set(fakeObjects.map(obj => obj.status))].sort();

  // Extraire et trier les catégories
  const sortedCategories = Object.entries(categories)
    .map(([key, value]) => ({ key, name: value.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Gestionnaire de clic à l'extérieur pour fermer la recherche
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
    <SearchWrapper ref={searchContainerRef}>
      <SearchContainer isOpen={isOpen}>
        <SearchButton onClick={toggleSearch} aria-label="Ouvrir la recherche">
          {isOpen ? (
            <FaTimes 
              size={22} 
              style={{ transform: 'rotate(0deg)', transition: 'transform 0.3s' }} 
              aria-label="Fermer la recherche"
            />
          ) : (
            <FaSearch size={22} aria-label="Ouvrir la recherche" />
          )}
        </SearchButton>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <SearchBar 
            ref={searchInputRef}
            type="text"
            isOpen={isOpen}
            value={searchText || ''}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Rechercher par nom ou identifiant..."
            style={{ 
              transition: 'width 0.3s ease, opacity 0.3s ease',
              opacity: isOpen ? '1' : '0',
              boxShadow: isOpen ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
            }}
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
      </SearchContainer>
      
      {isOpen && searchResults.length > 0 && (
        <SearchResultsContainer>
          <ResultsHeader>
            <FaFilter style={{ marginRight: '10px', color: '#2196F3' }} /> 
            {searchResults.length === 1 
              ? '1 résultat trouvé' 
              : `${searchResults.length} résultats trouvés`}
          </ResultsHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {searchResults.map((item, index) => (
              <ResultItem 
                key={item.id} 
                onClick={() => handleSelectResult(item)}
                status={item.status}
              >
                <div style={{ fontSize: '1.6em', display: 'flex', alignItems: 'center', color: '#2196F3' }}>
                  {getIcon(item.type)}
                </div>
                <div>
                  <strong style={{ fontSize: '1.05em', display: 'block', marginBottom: '3px' }}>
                    {item.name}
                  </strong>
                  <div style={{ fontSize: '0.85em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#666', backgroundColor: '#f5f5f5', padding: '2px 8px', borderRadius: '20px' }}>
                      {item.type}
                    </span>
                    <span className="status">{item.status}</span>
                  </div>
                </div>
              </ResultItem>
            ))}
          </div>
        </SearchResultsContainer>
      )}
      
      {isOpen && searchText.trim() !== '' && searchResults.length === 0 && (
        <SearchResultsContainer>
          <NoResults>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '32px' }}>🔍</span>
              <span>
                Aucun résultat trouvé pour "<strong>{searchText}</strong>"
              </span>
              <small style={{ color: '#777', marginTop: '5px' }}>
                Essayez de modifier vos filtres ou d'utiliser d'autres termes de recherche
              </small>
            </div>
          </NoResults>
        </SearchResultsContainer>
      )}
    </SearchWrapper>
  );
};

export default SearchBox;
