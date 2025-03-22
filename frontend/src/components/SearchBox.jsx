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
      <div onClick={toggleSearch}>
        {isOpen ? (
          <FaTimes size={28} style={{ transform: 'rotate(0)' }} />
        ) : (
          <FaSearch size={28} />
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
        />
      </form>
    </SearchContainer>
  );
};

export default SearchBox;
