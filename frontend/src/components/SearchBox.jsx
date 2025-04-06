import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { SearchContainer, SearchBar } from '../styles/HeaderStyles';

const SearchBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchText('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Recherche:', searchText);
  };

  return (
    <SearchContainer isOpen={isOpen}>
      <div onClick={toggleSearch} aria-label="Ouvrir la recherche">
        {isOpen ? (
          <FaTimes 
            size={28} 
            style={{ transform: 'rotate(180deg)', transition: 'transform 0.3s' }} 
            aria-label="Fermer la recherche"
          />
        ) : (
          <FaSearch size={28} aria-label="Ouvrir la recherche" />
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <SearchBar 
          as="textarea" 
          isOpen={isOpen}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Rechercher..."
          rows="1"
          style={{ transition: 'height 0.3s ease' }} // Animation de la hauteur
        />
      </form>
    </SearchContainer>
  );
};

export default SearchBox;
