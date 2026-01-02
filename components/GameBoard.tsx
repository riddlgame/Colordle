import React from 'react';
import { GuessResult, RGB } from '../types';
import { COLOR_CLASSES } from '../constants';

interface GameBoardProps {
  guesses: GuessResult[];
  currentGuess?: RGB;
  isWon: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ guesses, isWon }) => {
  return (
    <div className="space-y-4">
      {/* Reversed to show newest guesses at the top for better UX in unlimited mode */}
      {[...guesses].reverse().map((guess, idx) => (
        <div key={guesses.length - idx} className="flex items-center space-x-4 bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
          <div className="flex flex-col items-center space-y-1">
            <div 
              className="w-16 h-16 rounded-2xl shadow-inner border-4 border-white ring-1 ring-gray-100" 
              style={{ backgroundColor: `rgb(${guess.guess.r}, ${guess.guess.g}, ${guess.guess.b})` }}
            ></div>
            <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">Guessed</span>
          </div>
          
          <div className="flex-1 grid grid-cols-3 gap-3">
            <div className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${guess.evaluation.r === 'correct' ? COLOR_CLASSES.correctRed : COLOR_CLASSES.incorrect}`}>
              <span className="text-[9px] font-black opacity-40 uppercase mb-0.5">Red</span>
              <span className="text-sm font-mono font-bold">{guess.guess.r}</span>
            </div>
            <div className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${guess.evaluation.g === 'correct' ? COLOR_CLASSES.correctGreen : COLOR_CLASSES.incorrect}`}>
              <span className="text-[9px] font-black opacity-40 uppercase mb-0.5">Green</span>
              <span className="text-sm font-mono font-bold">{guess.guess.g}</span>
            </div>
            <div className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${guess.evaluation.b === 'correct' ? COLOR_CLASSES.correctBlue : COLOR_CLASSES.incorrect}`}>
              <span className="text-[9px] font-black opacity-40 uppercase mb-0.5">Blue</span>
              <span className="text-sm font-mono font-bold">{guess.guess.b}</span>
            </div>
          </div>
        </div>
      ))}
      
      {!isWon && (
        <div className="flex items-center space-x-4 bg-indigo-50/30 p-4 rounded-[1.5rem] border-2 border-dashed border-indigo-200 current-row-blink">
          <div className="w-16 h-16 rounded-2xl bg-white/50 border-2 border-dashed border-indigo-100 flex items-center justify-center">
            <i className="fas fa-eye-slash text-indigo-200 text-xl"></i>
          </div>
          <div className="flex-1 text-center py-4">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse">
              Next Guess...
            </span>
          </div>
        </div>
      )}
      
      {guesses.length === 0 && isWon === false && (
        <div className="h-24 border-2 border-dashed border-gray-100 rounded-[1.5rem] flex items-center justify-center opacity-40">
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No guesses yet</p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;