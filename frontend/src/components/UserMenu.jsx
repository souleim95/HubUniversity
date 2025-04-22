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

/* 
* Composant interactif de menu utilisateur
* Affiche un avatar ou l'initiale de l'utilisateur avec un menu déroulant contextuel
* Affiche dynamiquement les options selon le rôle : dashboard, profil, gestion, administration
* Utilise un hook personnalisé pour gérer les clics en dehors du menu
*/
const UserMenu = ({ user, role, onLogout }) => {
  const [open, setOpen] = useState(false); // Contrôle l'ouverture du menu déroulant
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);  // Ferme le menu après navigation
  };

  const handleClickOutside = () => {
    setOpen(false); // Ferme le menu si clic à l'extérieur
  };

  useClickOutside(menuRef, handleClickOutside); // Hook personnalisé pour clic extérieur

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