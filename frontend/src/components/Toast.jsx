import React, { useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlatformContext } from '../context/PlatformContext';
import styled from 'styled-components';

const StyledToastContainer = styled(ToastContainer)`
  &.Toastify__toast-container {
    width: 320px !important;
    padding: 0;
    ${props => {
      const position = props.$position || 'top-right';
      return `
        ${position.includes('top') ? 'top: 24px;' : 'bottom: 24px;'}
        ${position.includes('left') ? 'left: 24px;' : 'right: 24px;'}
      `;
    }}
  }

  .Toastify__toast {
    width: 100%;
    min-height: 64px;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: ${props => props.$enabled ? 'flex' : 'none'} !important;
    font-family: inherit;
  }

  .Toastify__toast--success {
    background-color: ${props => props.$theme === 'dark' ? '#1b4332' : '#dcfce7'};
    color: ${props => props.$theme === 'dark' ? '#ffffff' : '#166534'};
  }

  .Toastify__toast--error {
    background-color: ${props => props.$theme === 'dark' ? '#7f1d1d' : '#fee2e2'};
    color: ${props => props.$theme === 'dark' ? '#ffffff' : '#991b1b'};
  }

  .Toastify__toast--warning {
    background-color: ${props => props.$theme === 'dark' ? '#854d0e' : '#fef3c7'};
    color: ${props => props.$theme === 'dark' ? '#ffffff' : '#92400e'};
  }

  .Toastify__progress-bar {
    background-color: ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  }

  .Toastify__close-button {
    color: inherit;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
  }
`;

const Toast = () => {
  const { platformSettings } = useContext(PlatformContext);

  return platformSettings.notifications?.enabled ? (
    <StyledToastContainer
      position={platformSettings.notifications?.position || "top-right"}
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      limit={3}
      $theme={platformSettings.theme}
      $position={platformSettings.notifications?.position}
      $enabled={platformSettings.notifications?.enabled}
    />
  ) : null;
};

export default Toast;
