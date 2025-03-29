import React, { useState } from 'react';
import { 
  MenuContainer, 
  MenuButton, 
  DropdownMenu, 
  DropdownItem 
} from '../styles/UserMenuStyles';
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ user, role, onLogout }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  // Ajouter une vérification pour éviter les erreurs
  const userInitial = user?.login ? user.login.charAt(0).toUpperCase() : 'U';

  return (
    <MenuContainer>
      <MenuButton onClick={() => setOpen(!open)}>
        {userInitial} {/* Affiche la première lettre du nom, ou 'U' si undefined */}
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
