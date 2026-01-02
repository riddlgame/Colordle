
import React from 'react';
import { GuessResult, RGB } from '../types';
import { COLOR_CLASSES } from '../constants';

interface GameBoardProps {
  guesses: GuessResult[];
  maxGuesses: number;
  currentGuess?: RGB;
  isWon: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ guesses, maxGuesses, currentGuess, isWon }) => {
  const rows = Array.from({ length: maxGuesses });

  return (
    <div className="space-y-4">
      {rows.map((_, i) => {
        const guess = guesses[i];
        const isCurrent = !isWon && i === guesses.length;
        
        if (guess) {
          return (
            <div key={i} className="flex items-center space-x-4 bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
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
          );
        }

        if (isCurrent) {
          return (
            <div key={i} className="flex items-center space-x-4 bg-indigo-50/30 p-4 rounded-[1.5rem] border-2 border-dashed border-indigo-200 current-row-blink">
              <div className="w-16 h-16 rounded-2xl bg-white/50 border-2 border-dashed border-indigo-100 flex items-center justify-center">
                <i className="fas fa-eye-slash text-indigo-200 text-xl"></i>
              </div>
              <div className="flex-1 text-center py-4">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse">
                  Selecting Shade...
                </span>
              </div>
            </div>
          );
        }

        return (
          <div key={i} className="h-24 border-2 border-dashed border-gray-100 rounded-[1.5rem] flex items-center justify-center opacity-40 group transition-all hover:opacity-60">
             <div className="w-10 h-1 bg-gray-100 rounded-full"></div>
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
