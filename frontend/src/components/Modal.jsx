import React from 'react';

// Composant Modal réutilisable pour afficher du contenu en superposition
// Ne s'affiche que lorsque isOpen est true
function Modal({ isOpen, onClose, title, children }) {
  // Retourne null si la modal n'est pas ouverte (ne rend rien)
  if (!isOpen) return null;

  return (
    // Overlay qui couvre tout l'écran avec un fond semi-transparent
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Conteneur principal de la modal avec scroll si nécessaire */}
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* En-tête de la modal avec titre et bouton de fermeture */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            {/* Icône X pour fermer la modal */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Contenu de la modal passé via la prop children */}
        {children}
      </div>
    </div>
  );
}

export default Modal; 