import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-5 max-w-4xl flex flex-col items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-center">
          Nítido / sonido y producción
        </h1>
        <p className="text-gray-400 mt-2">Tu Asistente IA para Sonido de Eventos Perfectos</p>
      </div>
    </header>
  );
};

export default Header;