import styled, { keyframes } from 'styled-components';

const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const HeroContainer = styled.section`
  height: 100vh;
  width: 100vw; // Changé à 100vw pour prendre toute la largeur de la fenêtre
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  margin: 0;
  left: 50%;
  transform: translateX(-50%); // Centre la section par rapport à la page
  margin-left: 0;
  margin-right: 0;
`;

export const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  margin: 0;
`;


export const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  backdrop-filter: blur(5px);
  width: 100%;
  max-width: 800px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 1rem;
  animation: ${fadeIn} 0.5s ease-in forwards,
             ${fadeOut} 1s ease-out 8s forwards;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  color: #ffffff;
  font-weight: 600;
  animation: ${typewriter} 3s steps(30) 1s forwards;
  position: relative;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.2rem;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  opacity: 0;
  color: #ffffff;
  font-weight: 500;
  animation: 
    ${typewriter} 3s steps(40) 4s forwards,
    ${fadeIn} 0.1s 4s forwards;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;
