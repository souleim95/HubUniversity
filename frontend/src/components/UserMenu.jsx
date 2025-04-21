import React, { useState, useRef } from 'react';
import { 
  MenuContainer, 
  MenuButton, 
  DropdownMenu, 
  DropdownItem,
  UserAvatar
} from '../styles/UserMenuStyles'; 
import { useNavigate } from 'react-router-dom';
import useClickOutside from '../hooks/useClickOutside';

// Composant de menu utilisateur avec options contextuelles selon le rôle
const UserMenu = ({ user, role, onLogout }) => {
  // Gestion de l'état d'ouverture du menu déroulant
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Navigation vers une route et fermeture du menu
  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);  
  };

  const handleClickOutside = () => {
    setOpen(false);
  };

  useClickOutside(menuRef, handleClickOutside);

  // Récupération de l'image de profil ou utilisation d'une initiale par défaut
  const userPhoto = localStorage.getItem('photoUrl');
  const userInitial = user?.login ? user.login.charAt(0).toUpperCase() : 'U';
  
  return (
    <MenuContainer ref={menuRef}>
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
          <DropdownItem className="dashboard" onClick={() => handleNavigate('/dashboard')}>Tableau de bord</DropdownItem>
          <DropdownItem onClick={() => handleNavigate('/profil')}>Profil</DropdownItem>

          {/* Options conditionnelles selon le rôle de l'utilisateur */}
          {(role === 'professeur' || role === 'directeur') && (
            <DropdownItem onClick={() => handleNavigate('/gestion')}>Gestion</DropdownItem>
          )}

          {role === 'directeur' && (
            <DropdownItem onClick={() => handleNavigate('/admin')}>Administration</DropdownItem>
          )}

          <DropdownItem className="logout" onClick={onLogout}>Déconnexion</DropdownItem>
        </DropdownMenu>
      )}
    </MenuContainer>
  );
};

export default UserMenu;
