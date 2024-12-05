import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-30" />
        <div
          className="bg-white rounded-lg p-6 z-10 w-full max-w-3xl"
          onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar dentro do card
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;