import { ReactNode } from 'react';
import Portal from '../portal/Portal';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <button
            className="absolute top-0 right-0 mt-4 mr-4 text-white"
            onClick={onClose}
          >
            ×
          </button>
          {children}
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
