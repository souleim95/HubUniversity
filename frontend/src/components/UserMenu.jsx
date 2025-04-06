import React, { useState } from 'react';
import { 
  MenuContainer, 
  MenuButton, 
  DropdownMenu, 
  DropdownItem 
} from '../styles/UserMenuStyles';  // Import des styles
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ user, role, onLogout }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);  // Ferme le menu après la navigation
  };

  const userInitial = user?.login ? user.login.charAt(0).toUpperCase() : 'U';  // Affichage de la première lettre du login

  return (
    <MenuContainer>
      <MenuButton onClick={() => setOpen(!open)}>
        {userInitial} {/* Affiche la première lettre du login, ou 'U' si 'user' est undefined */}
      </MenuButton>
      {open && (
        <DropdownMenu>
          <DropdownItem onClick={() => handleNavigate('/dashboard')}>Tableau de bord</DropdownItem>
          <DropdownItem onClick={() => handleNavigate('/profil')}>Profil</DropdownItem>

          {(role === 'gestionnaire' || role === 'admin') && (
            <DropdownItem onClick={() => handleNavigate('/gestion')}>Gestion</DropdownItem>
          )}

          {role === 'admin' && (
            <DropdownItem onClick={() => handleNavigate('/admin')}>Administration</DropdownItem>
          )}

          <DropdownItem onClick={onLogout}>Déconnexion</DropdownItem>
        </DropdownMenu>
      )}
    </MenuContainer>
  );
};

export default UserMenu;
