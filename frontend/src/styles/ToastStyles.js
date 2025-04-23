import styled, { keyframes } from 'styled-components';

// Animation de slide
const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Conteneur global des toasts
export const ToastContainer = styled.div`
  position: fixed;
  top: 90px;
  right: 15px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 480px) {
    right: 10px;
    left: 10px;
    align-items: center;
  }
`;

// Style d'une toast
export const Toast = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 10px;
  color: white;
  font-weight: 500;
  font-size: 0.95rem;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  animation: ${slideIn} 0.35s ease-out;
  background-color: ${({ type }) => {
    switch (type) {
      case 'debug':
        return '#2196f3'; // Bleu clair
      case 'success':
        return '#4caf50'; // Vert
      case 'error':
        return '#f44336'; // Rouge
      case 'warning':
        return '#ff9800'; // Orange
      default:
        return '#607d8b'; // Bleu-gris
    }
  }};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(-3px);
    cursor: pointer;
  }
`;
