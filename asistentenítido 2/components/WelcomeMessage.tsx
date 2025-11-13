import React from 'react';

const WelcomeMessage: React.FC = () => {
  return (
    <div className="text-center p-4">
      <div className="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-300">Tu recomendación aparecerá aquí</h3>
      <p className="text-gray-400 mt-2">Completa el formulario con los detalles de tu evento y deja que nuestra IA diseñe el sistema de sonido perfecto para ti.</p>
    </div>
  );
};

export default WelcomeMessage;
