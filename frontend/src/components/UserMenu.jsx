import React, { useState } from 'react';
import { 
  MenuContainer, 
  MenuButton, 
  DropdownMenu, 
  DropdownItem,
  UserAvatar
} from '../styles/UserMenuStyles';  // Import des styles
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ user, role, onLogout }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);  // Ferme le menu après la navigation
  };

  const userPhoto = localStorage.getItem('photoUrl');
  const userInitial = user?.login ? user.login.charAt(0).toUpperCase() : 'U';
  
  return (
    <MenuContainer>
<MenuButton onClick={() => setOpen(!open)}>
  {userPhoto ? (
    <UserAvatar src={userPhoto} alt="Photo de profil" />
  ) : (
    userInitial
  )}
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
