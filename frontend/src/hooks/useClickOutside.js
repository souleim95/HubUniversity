import { useEffect } from 'react';

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Si le clic est à l'intérieur du composant, on ne fait rien
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // Sinon, on appelle le handler
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

export default useClickOutside; 