import styled from 'styled-components';

// Menu Container
export const MenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

// Bouton de Menu avec des effets modernes
export const MenuButton = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #6a11cb, #2575fc); /* Dégradé vibrant */
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  user-select: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(135deg, #2575fc, #6a11cb); /* Inversion du dégradé au survol */
    transform: scale(1.15); /* Effet de zoom */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

// Menu déroulant
export const DropdownMenu = styled.div`
  position: absolute;
  top: 68px;
  right: -15px;
  background-color: white;
  border-radius: 16px; /* Coins arrondis pour le menu */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15); /* Ombre suivant les coins arrondis */
  min-width: 240px;
  z-index: 100;
  animation: fadeIn 0.3s ease-in-out;
  overflow: hidden; /* Empêche le débordement du contenu */
  border: 1px solid rgba(0, 0, 0, 0.1); /* Ajout d'une bordure fine pour synchroniser les bords */

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Item du menu avec un style plus interactif
export const DropdownItem = styled.div`
  padding: 16px 24px;
  cursor: pointer;
  color: #2575fc;
  font-size: 1.2rem;
  font-weight: 500;
  transition: background-color 0.3s ease, color 0.3s ease;
  width: 100%; /* Prend toute la largeur disponible */
  text-align: center; /* Centrer le texte */
  box-sizing: border-box; /* Inclut le padding et la bordure dans la largeur totale */
  
  &:hover {
    background-color: #f0f4ff;
    color: #6a11cb;
  }

  /* Ajout d'une ligne sous chaque élément pour mieux délimiter */
  &:not(:last-child) {
    border-bottom: 1px solid #eaeaea;
  }

  &:first-child {
    border-top-left-radius: 16px; /* Coins arrondis pour le premier élément */
    border-top-right-radius: 16px;
  }
  &:last-child {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 1px;
  }

  &.logout {
    color: #ff4d4f; /* Couleur rouge pour indiquer une action importante */
    font-weight: bold; /* Mettre en évidence */
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
      background-color: #ffecec; /* Couleur de survol spécifique */
      color: #d9363e; /* Rouge plus foncé au survol */
    }
  }

  &.dashboard {
    color:rgb(17, 68, 97); /* Bleu clair pour un effet moderne */
    font-weight: bold; /* Mettre en évidence */
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
      background-color: #eaf6ff; /* Couleur de survol spécifique */
      color: #1a73e8; /* Bleu plus foncé au survol */
    }
  }
`;

// Ajout d'icône et d'autres éléments pour un design moderne
export const ProfileIcon = styled.div`
  width: 100px;
  height: 100px;
  background-color: #f0f4ff;
  color: #2575fc;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6rem;
  font-weight: bold;
  margin-right: 20px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
  }
`;

export const UserAvatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
