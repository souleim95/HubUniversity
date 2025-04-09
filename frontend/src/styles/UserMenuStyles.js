import styled from 'styled-components';

// Menu Container
export const MenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

// Bouton de Menu avec des effets modernes
export const MenuButton = styled.div`
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #4e73df, #1d3c6a);  /* Dégradé élégant */
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease;
  user-select: none;
  
  &:hover {
    background: linear-gradient(135deg, #1d3c6a, #4e73df);  /* Inversion du dégradé au survol */
    transform: scale(1.1);  /* Effet de zoom */
  }
`;

// Menu déroulant
export const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  background-color: white;
  border-radius: 12px;  /* Coins plus arrondis */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 220px;
  z-index: 100;
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Item du menu avec un style plus interactif
export const DropdownItem = styled.div`
  padding: 14px 20px;
  cursor: pointer;
  color: #4e73df;
  font-size: 1.1rem;
  font-weight: 500;
  transition: background-color 0.3s ease, color 0.3s ease;
  
  &:hover {
    background-color: #f4f5f7;
    color: #1d3c6a;
  }

  /* Ajout d'une ligne sous chaque élément pour mieux délimiter */
  &:not(:last-child) {
    border-bottom: 1px solid #e1e1e1;
  }
`;

// Ajout d'icône et d'autres éléments pour un design moderne
export const ProfileIcon = styled.div`
  width: 100px;
  height: 100px;
  background-color: #f4f5f7;
  color: #4e73df;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  }
`;

export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;
