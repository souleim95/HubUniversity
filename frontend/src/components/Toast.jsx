import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlatformContext } from '../context/PlatformContext';
import { StyledToastContainer, defaultToastConfig } from '../styles/ToastStyles';


export const showToast = (message, type = 'info') => {
  if (!message) return;
  toast[type](message, defaultToastConfig);
};

const Toast = () => {
  const { platformSettings } = useContext(PlatformContext);
  
  return (
    <StyledToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={platformSettings?.theme === 'dark' ? 'dark' : 'light'}
      $theme={platformSettings?.theme}
      limit={3}
    />
  );
};

export { toast };
export default Toast;
