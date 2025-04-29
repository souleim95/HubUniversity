import styled from 'styled-components';

export const MapContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

export const MapSection = styled.section`
  padding: 2rem 1rem;
  width: 100%;
  min-height: min-content;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px; // Réduit de 40px à 20px pour harmoniser

  > div.campus-container {
    background: white;
    border-radius: 24px;
    padding: 2rem;
    width: 102.5%; // Ajusté pour correspondre au Toast
    max-width: 1400px; // Ajusté pour correspondre au Toast
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 2rem;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.01);
      box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
    }

    // Titre Campus Connecté
    > div:first-child {
      background: #f8fafc;
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      width: 100%;

      h2 {
        color: #1a202c;
        font-size: 2.5em;
        font-weight: 600;
        margin: 0;
        letter-spacing: -0.02em;
      }
    }

    // Container des boutons de catégories
    > div:nth-child(2) {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      width: 100%;
      
      // Grille des boutons
      > div {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        width: 100%;
      }
    }

    // Container des objets
    > div:last-child {
      width: 100%;
    }
  }
`;

export const TabsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 2rem;
  padding: 0 1rem;
  overflow-x: auto;
`;

export const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  background: rgba(255, 255, 255, 0.8);
  padding: 8px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const Tab = styled.button`
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  background-color: ${({ active }) => (active ? '#1a73e8' : 'transparent')};
  color: ${({ active }) => (active ? '#fff' : '#5f6368')};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;

  &:hover {
    background-color: ${({ active }) => (active ? '#1a73e8' : 'rgba(0, 0, 0, 0.05)')};
    color: ${({ active }) => (active ? '#fff' : '#1a73e8')};
  }
`;

export const ObjectCard = styled.div`
  position: relative;
  height: 280px;
  perspective: 1000px;
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  user-select: none;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    height: 220px;
  }
`;

export const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${({ flipped }) => (flipped ? 'rotateY(180deg)' : 'rotateY(0)')};
`;

export const ObjectFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 16px;
  user-select: none;

  h4 {
    margin-top: 15px;
    color: #202124;
    font-size: 1.2rem;
    font-weight: 500;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const ObjectBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: white;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 16px;
  user-select: none;

  p {
    color: #5f6368;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const InfoContainer = styled.div`
  margin: 20px auto; // Réduit de 40px à 20px
  padding: 2rem;
  max-width: 1400px;
  width: 95%;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
  }
`;

export const FaqContainer = styled.div`
  margin: 20px auto; // Réduit de 40px à 20px
  padding: 2rem;
  max-width: 1400px;
  width: 95%;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
  position: relative;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
  }
`;

export const FaqTitle = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: absolute;
  top: -20px;
  left: -10px;
  transform: rotate(-2deg);

  h2 {
    color: #1a202c;
    font-size: 2.5em;
    font-weight: 600;
    margin: 0;
    letter-spacing: -0.02em;
  }

  &:hover {
    transform: rotate(0deg) scale(1.02);
    transition: transform 0.3s ease;
  }
`;

export const FaqContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  width: 100%;
  margin-top: 3rem; // Espace pour le titre

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
