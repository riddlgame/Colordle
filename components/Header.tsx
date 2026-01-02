
import React from 'react';

interface HeaderProps {
  date: string;
  isDaily: boolean;
  hintsRemaining: number;
  onShowHints: () => void;
  onShowAdmin: () => void;
}

const Header: React.FC<HeaderProps> = ({ date, isDaily, hintsRemaining, onShowHints, onShowAdmin }) => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-40 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 flex items-center select-none">
            C
            <div className="relative mx-0.5 w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-indigo-50 rounded-full border-2 border-indigo-200"></div>
              <div className="relative w-6 h-6 bg-gradient-to-tr from-red-400 via-green-400 to-blue-400 rounded-full shadow-inner transform rotate-12"></div>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-50"></div>
            </div>
            l
            <div className="relative mx-0.5 w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-gray-100 rounded-lg border-2 border-gray-300 transform -rotate-3"></div>
              <div className="absolute inset-1 bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                <i className="fas fa-paint-brush text-[10px] text-indigo-400 opacity-40"></i>
              </div>
            </div>
            rdle
          </h1>
        </div>

        <div className="text-center hidden md:block">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
            {isDaily ? 'Puzzle of the Day' : 'Practice Mode'}
          </span>
          <div className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            {isDaily ? date : 'Random'}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={onShowHints}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-95"
          >
            <i className="fas fa-lightbulb text-sm"></i>
            <span className="font-black text-sm">{hintsRemaining}</span>
          </button>
          <button 
            onClick={onShowAdmin}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            title="Admin"
          >
            <i className="fas fa-cog text-lg"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
