
import React from 'react';
import { RGB } from '../types';

interface LossModalProps {
  targetColor: RGB;
  onPlayAgain: () => void;
  onClose: () => void;
}

const LossModal: React.FC<LossModalProps> = ({ targetColor, onPlayAgain, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300 border-t-8 border-red-400">
        <div className="text-6xl mb-4">😰</div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">So Close!</h2>
        <p className="text-gray-500 mb-6">You've used all your guesses. The mystery color was:</p>
        
        <div className="flex flex-col items-center justify-center mb-8">
           <div 
            className="w-24 h-24 rounded-2xl shadow-lg border-4 border-white ring-2 ring-gray-100 mb-4"
            style={{ backgroundColor: `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})` }}
           ></div>
           <div className="flex space-x-2">
             <div className="px-3 py-1 bg-red-50 text-red-700 rounded-lg font-mono font-bold text-sm">R: {targetColor.r}</div>
             <div className="px-3 py-1 bg-green-50 text-green-700 rounded-lg font-mono font-bold text-sm">G: {targetColor.g}</div>
             <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-mono font-bold text-sm">B: {targetColor.b}</div>
           </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={onPlayAgain}
            className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
          >
            PLAY AGAIN (RANDOM)
          </button>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-gray-100 transition-all"
          >
            VIEW MY GUESSES
          </button>
        </div>
      </div>
    </div>
  );
};

export default LossModal;
