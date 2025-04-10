import React, { useState } from 'react';
import { 
  MenuContainer, 
  MenuButton, 
  DropdownMenu, 
  DropdownItem,
  UserAvatar
} from '../styles/UserMenuStyles'; 
import { useNavigate } from 'react-router-dom';

// Composant de menu utilisateur avec options contextuelles selon le rôle
const UserMenu = ({ user, role, onLogout }) => {
  // Gestion de l'état d'ouverture du menu déroulant
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Navigation vers une route et fermeture du menu
  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);  
  };

  // Récupération de l'image de profil ou utilisation d'une initiale par défaut
  const userPhoto = localStorage.getItem('photoUrl');
  const userInitial = user?.login ? user.login.charAt(0).toUpperCase() : 'U';
  
  return (
    <MenuContainer>
      {/* Bouton du menu avec avatar ou initiale */}
      <MenuButton onClick={() => setOpen(!open)}>
        {userPhoto ? (
          <UserAvatar src={userPhoto} alt="Photo de profil" />
        ) : (
          userInitial
        )}
      </MenuButton>

      {/* Menu déroulant affiché uniquement si ouvert */}
      {open && (
        <DropdownMenu>
          <DropdownItem onClick={() => handleNavigate('/dashboard')}>Tableau de bord</DropdownItem>
          <DropdownItem onClick={() => handleNavigate('/profil')}>Profil</DropdownItem>

          {/* Options conditionnelles selon le rôle de l'utilisateur */}
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
