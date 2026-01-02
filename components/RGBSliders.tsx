
import React from 'react';
import { RGB } from '../types';

interface RGBSlidersProps {
  value: RGB;
  onChange: (value: RGB) => void;
  onGuess: () => void;
  onGiveUp: () => void;
  disabled: boolean;
}

const RGBSliders: React.FC<RGBSlidersProps> = ({ value, onChange, onGuess, onGiveUp, disabled }) => {
  const handleSliderChange = (channel: keyof RGB, newVal: string) => {
    const val = Math.min(255, Math.max(0, parseInt(newVal, 10) || 0));
    onChange({ ...value, [channel]: val });
  };

  const handleInputChange = (channel: keyof RGB, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(255, Math.max(0, parseInt(e.target.value, 10) || 0));
    onChange({ ...value, [channel]: val });
  };

  const inputRow = (label: string, channel: keyof RGB, colorClass: string) => (
    <div className="flex items-center space-x-3">
      <label htmlFor={`input-${channel}`} className={`w-5 font-black text-sm text-${colorClass}-500`}>{label}</label>
      <input
        type="range"
        min="0"
        max="255"
        value={value[channel]}
        onChange={(e) => handleSliderChange(channel, e.target.value)}
        disabled={disabled}
        className={`flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-${colorClass}-500 hover:accent-${colorClass}-600 transition-all`}
      />
      <input
        id={`input-${channel}`}
        type="number"
        min="0"
        max="255"
        value={value[channel]}
        onChange={(e) => handleInputChange(channel, e)}
        disabled={disabled}
        className="w-16 p-1.5 bg-white border border-gray-200 rounded-xl font-mono text-center text-gray-700 focus:ring-2 ring-indigo-100 outline-none font-bold text-sm shadow-sm"
      />
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Blind Guess Placeholder - NO LIVE PREVIEW */}
        <div className="relative">
          <div 
            className="w-24 h-24 rounded-[2rem] shadow-inner border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-gray-300 transition-colors"
          >
            <i className="fas fa-fingerprint text-3xl mb-1 opacity-20"></i>
            <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Secret</span>
          </div>
          <div className="absolute -top-1 -right-1 bg-gray-800 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg border-2 border-white">
            ?
          </div>
        </div>
        
        <div className="flex-1 w-full space-y-3">
          {inputRow('R', 'r', 'red')}
          {inputRow('G', 'g', 'green')}
          {inputRow('B', 'b', 'blue')}
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onGuess}
          disabled={disabled}
          className="w-full py-4 bg-indigo-600 text-white font-black text-lg rounded-2xl hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] shadow-lg shadow-indigo-100 uppercase tracking-[0.2em] flex items-center justify-center space-x-3"
        >
          <i className="fas fa-paper-plane text-sm"></i>
          <span>Submit Guess</span>
        </button>
        
        {!disabled && (
          <button
            onClick={onGiveUp}
            className="w-full mt-3 py-2 text-gray-400 hover:text-red-500 font-bold transition-colors uppercase text-[10px] tracking-[0.2em] flex items-center justify-center space-x-2"
          >
            <i className="fas fa-flag text-[8px]"></i>
            <span>I Give Up</span>
          </button>
        )}

        <p className="text-center text-[9px] text-gray-400 mt-4 font-bold uppercase tracking-[0.2em]">
          Match the target color above
        </p>
      </div>
    </div>
  );
};

export default RGBSliders;
