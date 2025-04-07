import styled from 'styled-components';

export const ObjectCard = styled.div`
  width: 200px; /* Taille de la carte */
  height: 300px; /* Hauteur de la carte */
  perspective: 1000px; /* Ajout d'une perspective 3D pour la rotation */
  position: relative;
  cursor: pointer;
  transition: transform 0.6s; /* Effet de transition pour la rotation */
  margin-bottom: 20px;

  &:hover {
    transform: rotateY(180deg); /* Rotation de la carte au survol */
  }
`;

export const ObjectFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* Cache la face arrière quand elle est derrière */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 2; /* Assure que la face avant est au-dessus de la face arrière */

  img {
    max-height: 80%; /* Ajuste la taille de l'image */
    max-width: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  h4 {
    font-size: 1.2em;
    color: #2b6cb0;
    margin-top: 10px;
  }
`;

export const ObjectBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* Cache la face arrière quand elle est derrière */
  background-color: #f7f7f7;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1; /* La face arrière est derrière la face avant */

  p {
    margin: 5px 0;
    font-size: 1em;
    color: #666;
  }
`;