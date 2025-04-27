import styled from 'styled-components';
import { ToastContainer as ReactToastContainer} from 'react-toastify';

export const StyledToastContainer = styled(ReactToastContainer)`
  &&&.Toastify__toast-container {
    z-index: 9999;
    position: fixed;
    padding: 4px;
    width: 320px;
    box-sizing: border-box;
  }
  
  .Toastify__toast {
    position: relative;
    min-height: 64px;
    box-sizing: border-box;
    margin-bottom: 1rem;
    padding: 8px;
    border-radius: 8px;
    box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1), 0 2px 15px 0 rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    max-height: 800px;
    overflow: hidden;
    font-family: var(--font-primary);
    cursor: pointer;
  }

  .Toastify__toast--success {
    background: ${props => props.$theme === 'dark' ? '#1b4332' : '#dcfce7'};
    color: ${props => props.$theme === 'dark' ? '#ffffff' : '#166534'};
  }

  .Toastify__toast--error {
    background: ${props => props.$theme === 'dark' ? '#7f1d1d' : '#fee2e2'};
    color: ${props => props.$theme === 'dark' ? '#ffffff' : '#991b1b'};
  }

  .Toastify__toast--warning {
    background: ${props => props.$theme === 'dark' ? '#854d0e' : '#fef3c7'};
    color: ${props => props.$theme === 'dark' ? '#ffffff' : '#92400e'};
  }

  .Toastify__toast--info {
    background: ${props => props.$theme === 'dark' ? '#1e3a8a' : '#eff6ff'};
    color: ${props => props.$theme === 'dark' ? '#ffffff' : '#1e40af'};
  }

  .Toastify__toast-body {
    margin: auto 0;
    flex: 1;
    padding: 6px;
  }

  .Toastify__close-button {
    align-self: flex-start;
    border-radius: 4px;
    padding: 4px;
    opacity: 0.7;
    transition: 0.3s ease;
    color: currentColor;

    &:hover, &:focus {
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
`;

export const defaultToastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};