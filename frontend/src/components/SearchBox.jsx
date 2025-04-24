import React from 'react';
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
import { SearchContainer, SearchBar } from '../styles/HeaderStyles';
import { SearchResultsContainer, FiltersContainer, FilterSelect, ResultItem, NoResults, SearchButton, StyledFaTimes, ResultsHeader, SearchWrapper } from '../styles/SearchBoxStyles';
import { objectTypes } from '../data/projectData';
import { getIcon } from '../utils/iconUtils';
import { useSearchState } from '../const/constSearch';

/*
 * Composant SearchBox : Barre de recherche intelligente
 * 
 * Caractéristiques principales :
 * 1. Interface utilisateur :
 *    - Barre de recherche extensible
 *    - Filtres dynamiques (type, statut, catégorie)
 *    - Résultats en temps réel
 *    - Animations fluides
 * 
 * 2. Fonctionnalités de recherche :
 *    - Recherche par nom ou identifiant
 *    - Filtrage multi-critères
 *    - Gestion des objets et équipements
 *    - Navigation contextuelle
 * 
 * 3. Performance et UX :
 *    - Debouncing des recherches
 *    - Recherche optimisée avec useCallback
 *    - Fermeture automatique au clic extérieur
 *    - Retour visuel immédiat
 * 
 * 4. Accessibilité :
 *    - Labels ARIA
 *    - Navigation au clavier
 *    - Messages d'état clairs
 */

const SearchBox = ({ onSelectObject, isOpen: externalIsOpen, onClose, onOpen }) => {
  const {
    isOpen,
    searchText,
    filterType,
    filterStatus,
    filterCategory,
    searchResults,
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
    handleSubmit
  } = useSearchState({ onSelectObject, isOpen: externalIsOpen, onClose, onOpen });

  return (
    // Wrapper principal avec gestion des interactions
    <SearchWrapper ref={searchContainerRef}>
      {/* Barre de recherche expansible avec animations */}
      <SearchContainer isOpen={isOpen}>
        <SearchButton 
          onClick={toggleSearch} 
          aria-label="Ouvrir la recherche" 
          style={{width: '40px', height: '40px'}}
          isOpen={isOpen} // Pass the isOpen state to SearchButton
        >
          {isOpen ? (
            <StyledFaTimes size={22} aria-label="Fermer la recherche" isOpen={isOpen}/>
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
              transition: 'width 0.3s ease, opacity 0.3s ease, top 0.3s ease',
              opacity: isOpen ? '1' : '0',
              width: isOpen ? 'calc(100% - 50px)' : '0',
              boxShadow: isOpen ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
              top: isOpen ? '2px' : '-50px', 
              position: 'relative', 
              right: '0'
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