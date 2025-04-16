import styled from 'styled-components';

export const MapSection = styled.section`
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  min-height: 100vh;
  width: 103%;
`;

export const MapContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

export const TabsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 2rem;
  padding: 0 20px;
  margin-left: -55px;
`;

export const Tabs = styled.div`
  display: flex;

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

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
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

  h4 {
    margin-top: 15px;
    color: #202124;
    font-size: 1.2rem;
    font-weight: 500;
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

  p {
    color: #5f6368;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;