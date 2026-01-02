
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  type?: 'info' | 'error' | 'success';
}

const Toast: React.FC<ToastProps> = ({ message, onClose, type = 'info' }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass = {
    info: 'bg-blue-500',
    error: 'bg-red-500',
    success: 'bg-green-500',
  }[type];

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
      <div className={`${bgClass} text-white px-6 py-3 rounded-full shadow-lg font-medium flex items-center space-x-2`}>
        <span>{message}</span>
        <button onClick={onClose} className="hover:text-gray-200">
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default Toast;
