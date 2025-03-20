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
    // Effectuez ici votre logique de recherche avec searchText
    console.log('Recherche:', searchText);
  };

  return (
    <SearchContainer isOpen={isOpen}>
      <div onClick={toggleSearch}>
        {isOpen ? (
          <FaTimes size={35} style={{ transform: 'rotate(0)' }} />
        ) : (
          <FaSearch size={50} />
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <SearchBar 
          isOpen={isOpen}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Rechercher..."
        />
      </form>
    </SearchContainer>
  );
};

export default SearchBox;
