import { useEffect } from 'react';

// Hook personnalisé : détecte un clic en dehors d'un élément pour déclencher un handler
// Utile pour fermer automatiquement un menu ou une modal
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Si le clic est à l'intérieur de l'élément référencé, on ne fait rien
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // Sinon, on exécute la fonction passée en paramètre
      handler(event);
    };

    document.addEventListener('mousedown', listener); // Gestion des clics souris
    document.addEventListener('touchstart', listener); // Gestion du tactile (mobile)

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]); // Exécuté à chaque fois que ref ou handler change
};

export default useClickOutside;
