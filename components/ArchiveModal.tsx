
import React from 'react';
import { DailyColor } from '../types';
import { storage } from '../utils/helpers';

interface ArchiveModalProps {
  availableColors: DailyColor[];
  onSelectDate: (date: string) => void;
  onClose: () => void;
}

const ArchiveModal: React.FC<ArchiveModalProps> = ({ availableColors, onSelectDate, onClose }) => {
  const wonDates = storage.getWonDates();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900">Archive</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-3">
            {availableColors.sort((a, b) => {
                const [d1, m1, y1] = a.date.split('/').map(Number);
                const [d2, m2, y2] = b.date.split('/').map(Number);
                return new Date(y2, m2-1, d2).getTime() - new Date(y1, m1-1, d1).getTime();
            }).map((item) => {
              const isWon = wonDates.includes(item.date);
              return (
                <button
                  key={item.date}
                  onClick={() => onSelectDate(item.date)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    isWon 
                    ? 'border-green-100 bg-green-50 text-green-700 hover:bg-green-100' 
                    : 'border-gray-50 bg-gray-50 hover:border-indigo-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-10 h-10 rounded-lg shadow-sm border-2 border-white"
                      style={{ backgroundColor: `rgb(${item.color.r}, ${item.color.g}, ${item.color.b})` }}
                    ></div>
                    <span className="font-mono font-bold">{item.date}</span>
                  </div>
                  {isWon && <i className="fas fa-check-circle text-green-500"></i>}
                  {!isWon && <i className="fas fa-play text-xs text-gray-300"></i>}
                </button>
              );
            })}

            {availableColors.length === 0 && (
              <div className="text-center py-12 text-gray-400 italic">
                No past puzzles found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveModal;
