import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

// Styles additionnels pour améliorer l'interface
export const SearchResultsContainer = styled.div`
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

export const FiltersContainer = styled.div`
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

export const FilterSelect = styled.select`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: white;
  flex: 1;
  min-width: 166px;
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

export const ResultItem = styled.div`
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

export const NoResults = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
`;

export const SearchButton = styled.div`
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
  
  &:active {
    transform: scale(0.95);
  }

  transition: transform 0.3s ease-in-out; // Add a transition for a smooth effect

  ${props => props.isOpen && `
    transform: rotate(360deg); // Rotate the icon when search is opened
  `}
`;

export const StyledFaTimes = styled(FaTimes)`
  transition: transform 0.3s ease-in-out;
  position: absolute;
  top: 8px;
  left: 8px;
  ${props => props.isOpen && `
    transform: rotate(360deg);
  `}
`;

export const ResultsHeader = styled.h3`
  margin: 0 0 15px 0;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 10px;
  color: #333;
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
`;

export const SearchWrapper = styled.div`
  position: relative;
  z-index: 1001;
`;

export const SearchBoxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1000;
`;

export const SearchIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(15, 110, 173);
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1001;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const SearchInput = styled.input`
  padding: 8px 12px;
  border: 2px solid rgb(15, 110, 173);
  border-radius: 20px;
  font-size: 14px;
  width: 200px;
  transition: all 0.3s ease;
  background-color: white;
  color: #333;
  position: absolute;
  right: 40px;
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(20px)'};

  &:focus {
    outline: none;
    width: 250px;
    box-shadow: 0 0 5px rgba(15, 110, 173, 0.3);
  }

  &::placeholder {
    color: #999;
  }
`;

export const CloseButton = styled.div`
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 1001;

  svg {
    width: 16px;
    height: 16px;
    color: #666;
  }

  &:hover {
    svg {
      color: #333;
    }
  }
`;