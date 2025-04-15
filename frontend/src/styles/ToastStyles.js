import styled, { keyframes } from 'styled-components';

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

export const ToastContainer = styled.div`
  position: fixed;
  top: 90px;
  right: 5px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Toast = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${slideIn} 0.3s ease-out;
  background-color: ${({ type }) => {
    switch (type) {
      case 'debug':
        return '#2196f3';
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      default:
        return '#757575';
    }
  }};
`;
