import styled, { keyframes } from 'styled-components';

// Animation pour faire apparaître les éléments
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const HeroContainer = styled.section`
  height: 100vh;   /* Assure que le conteneur prend 100% de la hauteur */
  width: 100vw;    /* Assure que le conteneur prend 100% de la largeur */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;


export const Video = styled.video`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  backdrop-filter: blur(5px);
  width: 100%;
  max-width: 1200px;

  h1, p {
    animation: ${fadeIn} 2s ease-out;
  }

  h1 {
    font-size: 2.5rem;
  }

  p {
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;

    h1 {
      font-size: 1.8rem;
    }

    p {
      font-size: 1rem;
    }
  }
`;
