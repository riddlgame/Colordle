
import React from 'react';
import { RGB } from '../types';

interface WinModalProps {
  guessesCount: number;
  targetColor: RGB;
  onShare: () => void;
  onPlayAgain: () => void;
  onClose: () => void;
}

const WinModal: React.FC<WinModalProps> = ({ guessesCount, targetColor, onShare, onPlayAgain, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Spectacular!</h2>
        <p className="text-gray-500 mb-6">You found the mystery color in <span className="text-indigo-600 font-bold">{guessesCount}</span> {guessesCount === 1 ? 'guess' : 'guesses'}.</p>
        
        <div className="flex flex-col items-center justify-center mb-8">
           <div 
            className="w-24 h-24 rounded-2xl shadow-lg border-4 border-white ring-2 ring-gray-100 mb-2"
            style={{ backgroundColor: `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})` }}
           ></div>
           <span className="text-sm font-mono text-gray-400">RGB({targetColor.r}, {targetColor.g}, {targetColor.b})</span>
        </div>

        <div className="space-y-3">
          <button 
            onClick={onShare}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2"
          >
            <i className="fas fa-share-alt"></i>
            <span>SHARE RESULTS</span>
          </button>
          <button 
            onClick={onPlayAgain}
            className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
          >
            PLAY AGAIN (RANDOM)
          </button>
          <button 
            onClick={onClose}
            className="text-gray-400 font-medium hover:text-gray-600 text-sm mt-4 block w-full text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;
