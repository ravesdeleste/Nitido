import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="text-center p-4 bg-red-900/50 border border-red-500 rounded-lg">
      <h3 className="text-lg font-bold text-red-400">¡Oops! Algo salió mal</h3>
      <p className="text-red-300 mt-2">{message}</p>
    </div>
  );
};

export default ErrorMessage;
