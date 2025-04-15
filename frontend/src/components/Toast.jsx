import React, { useEffect } from 'react';
import { ToastContainer, Toast as ToastElement } from '../styles/ToastStyles';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

const Toast = ({ messages, removeToast }) => {
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      const timer = setTimeout(() => {
        removeToast(latestMessage.id);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messages, removeToast]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaTimesCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <ToastContainer>
      {messages.map(msg => (
        <ToastElement key={msg.id} type={msg.type}>
          {getIcon(msg.type)}
          {msg.text}
        </ToastElement>
      ))}
    </ToastContainer>
  );
};

export default Toast;
