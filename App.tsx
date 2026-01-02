import React, { useState, useEffect } from 'react';
import { RGB, DailyColor, GuessResult, GameState, GameStatus } from './types';
import { INITIAL_DAILY_COLORS, MAX_HINTS, HINT_RANGE } from './constants';
import { getFormattedDate, storage, evaluateGuess, generateRandomColor } from './utils/helpers';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import RGBSliders from './components/RGBSliders';
import WinModal from './components/WinModal';
import LossModal from './components/LossModal';
import ArchiveModal from './components/ArchiveModal';
import Toast from './components/Toast';
import AdminPanel from './components/Admin/AdminPanel';
import AdminLogin from './components/Admin/AdminLogin';

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<'game' | 'admin-login' | 'admin-panel'>('game');
  
  // Game State
  const [puzzleDate, setPuzzleDate] = useState(getFormattedDate());
  const [isDaily, setIsDaily] = useState(true);
  const [targetColor, setTargetColor] = useState<RGB | null>(null);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.Playing);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentRGB, setCurrentRGB] = useState<RGB>({ r: 128, g: 128, b: 128 });
  
  // Modal states
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLossModal, setShowLossModal] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'info' | 'error' | 'success' } | null>(null);

  // Initialize with Daily Puzzle
  useEffect(() => {
    loadPuzzle(puzzleDate);
  }, [puzzleDate]);

  const loadPuzzle = (date: string) => {
    let allColors = storage.getDailyColors();
    if (allColors.length === 0) {
      allColors = INITIAL_DAILY_COLORS;
      storage.saveDailyColors(allColors);
    }
    
    let found = allColors.find(c => c.date === date);
    
    if (!found) {
      found = { date, color: generateRandomColor() };
      allColors = [found, ...allColors];
      storage.saveDailyColors(allColors);
    }

    setTargetColor(found.color);
    setIsDaily(true);
    
    const savedGame = storage.getGameState(date);
    if (savedGame) {
      setGuesses(savedGame.guesses);
      setHintsUsed(savedGame.hintsUsed);
      setGameState(savedGame.state);
      if (savedGame.state === GameState.Won) {
        setShowWinModal(true);
        setShowLossModal(false);
      } else {
        setShowWinModal(false);
        setShowLossModal(false);
      }
    } else {
      resetGameState();
    }
  };

  const startRandomGame = () => {
    setTargetColor(generateRandomColor());
    setIsDaily(false);
    resetGameState();
    setShowWinModal(false);
    setShowLossModal(false);
    setToast({ message: "Starting random practice game!", type: 'info' });
  };

  const resetGameState = () => {
    setGuesses([]);
    setHintsUsed(0);
    setGameState(GameState.Playing);
    setCurrentRGB({ r: 128, g: 128, b: 128 });
    setShowWinModal(false);
    setShowLossModal(false);
  };

  const handleGuess = () => {
    if (!targetColor) {
      setToast({ message: "Error: No target color found!", type: 'error' });
      return;
    }
    
    if (gameState === GameState.Won) {
      setToast({ message: "You already won this puzzle!", type: 'success' });
      return;
    }

    const evaluation = evaluateGuess(currentRGB, targetColor);
    const newGuess: GuessResult = { guess: { ...currentRGB }, evaluation };
    const updatedGuesses = [...guesses, newGuess];
    
    setGuesses(updatedGuesses);

    const isWin = evaluation.r === 'correct' && evaluation.g === 'correct' && evaluation.b === 'correct';
    
    if (isWin) {
      setGameState(GameState.Won);
      setShowWinModal(true);
      if (isDaily) {
        storage.saveGameState({
          date: puzzleDate,
          guesses: updatedGuesses,
          hintsUsed,
          state: GameState.Won
        });
      }
    } else if (isDaily) {
      storage.saveGameState({
        date: puzzleDate,
        guesses: updatedGuesses,
        hintsUsed,
        state: GameState.Playing 
      });
    }
  };

  const handleGiveUp = () => {
    if (gameState === GameState.Won) return;
    setShowLossModal(true);
  };

  const handleHint = () => {
    if (hintsUsed >= MAX_HINTS) {
      setToast({ message: "No hints remaining!", type: 'error' });
      return;
    }
    if (!targetColor) return;

    const channels: (keyof RGB)[] = ['r', 'g', 'b'];
    const randomChannel = channels[Math.floor(Math.random() * channels.length)];
    const val = targetColor[randomChannel];
    const min = Math.max(0, val - HINT_RANGE);
    const max = Math.min(255, val + HINT_RANGE);
    
    setHintsUsed(hintsUsed + 1);
    setToast({ 
      message: `Hint: ${randomChannel.toUpperCase()} is between ${min} and ${max}`, 
      type: 'info' 
    });
  };

  const handleShare = () => {
    const emojiGrid = guesses.map(g => {
      const r = g.evaluation.r === 'correct' ? '🟥' : '⬜';
      const g_eval = g.evaluation.g === 'correct' ? '🟩' : '⬜';
      const b = g.evaluation.b === 'correct' ? '🟦' : '⬜';
      return `${r}${g_eval}${b}`;
    }).join('\n');
    
    const context = isDaily ? `Daily ${puzzleDate}` : `Practice Game`;
    const text = `Colordle ${context}\n${guesses.length} Guesses\n\n${emojiGrid}\n\nPlay at: colordle.web.app`;
    navigator.clipboard.writeText(text);
    setToast({ message: "Copied to clipboard!", type: 'success' });
  };

  const onSelectArchiveDate = (date: string) => {
    setPuzzleDate(date);
    setShowArchive(false);
  };

  if (view === 'admin-login') {
    return <AdminLogin onLoginSuccess={() => setView('admin-panel')} onCancel={() => setView('game')} />;
  }

  if (view === 'admin-panel') {
    return <AdminPanel onLogout={() => setView('game')} />;
  }

  return (
    <div className="min-h-screen flex flex-col pb-12">
      <Header 
        date={puzzleDate} 
        isDaily={isDaily}
        hintsRemaining={MAX_HINTS - hintsUsed} 
        onShowHints={handleHint}
        onShowAdmin={() => setView('admin-login')}
        onShowArchive={() => setShowArchive(true)}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="flex-1 max-w-lg mx-auto w-full p-4 space-y-6">
        <div className="flex flex-col items-center justify-center py-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-green-400 to-blue-400 opacity-20"></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Target Color</span>
          <div 
            className="w-36 h-36 md:w-44 md:h-44 rounded-full shadow-2xl border-8 border-white ring-8 ring-indigo-50/50 transform hover:rotate-6 transition-all duration-500 cursor-help"
            style={{ 
              backgroundColor: targetColor ? `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})` : '#eee' 
            }}
          ></div>
          
          {guesses.length === 0 && gameState === GameState.Playing && (
            <div className="mt-6 px-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-700">
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                Can you pinpoint the exact <span className="text-indigo-600 font-bold italic">RGB values</span> of the color above? 
                Adjust the sliders to mix your guess.
              </p>
            </div>
          )}

          {(gameState === GameState.Won || showLossModal) && targetColor && (
            <div className="mt-4 flex flex-col items-center animate-in slide-in-from-top-2">
              <div className="flex space-x-2">
                <span className="text-xs font-mono font-bold text-red-400">R: {targetColor.r}</span>
                <span className="text-xs font-mono font-bold text-green-400">G: {targetColor.g}</span>
                <span className="text-xs font-mono font-bold text-blue-400">B: {targetColor.b}</span>
              </div>
            </div>
          )}
        </div>

        <RGBSliders 
          value={currentRGB} 
          onChange={setCurrentRGB} 
          onGuess={handleGuess}
          onGiveUp={handleGiveUp}
          disabled={gameState === GameState.Won || showLossModal}
        />

        <div className="space-y-4 pt-4">
           <div className="flex items-center justify-between px-2">
             <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Guess History</h3>
             <span className="text-[10px] font-bold text-gray-300">{guesses.length} Attempt{guesses.length !== 1 ? 's' : ''}</span>
           </div>
           <GameBoard 
            guesses={guesses} 
            currentGuess={currentRGB} 
            isWon={gameState === GameState.Won} 
          />
        </div>
      </main>

      {showWinModal && targetColor && (
        <WinModal 
          guessesCount={guesses.length} 
          targetColor={targetColor}
          onShare={handleShare}
          onPlayAgain={startRandomGame}
          onClose={() => setShowWinModal(false)}
        />
      )}

      {showLossModal && targetColor && (
        <LossModal 
          targetColor={targetColor}
          onPlayAgain={startRandomGame}
          onClose={() => setShowLossModal(false)}
        />
      )}

      {showArchive && (
        <ArchiveModal 
          availableColors={storage.getDailyColors().length > 0 ? storage.getDailyColors() : INITIAL_DAILY_COLORS}
          onSelectDate={onSelectArchiveDate}
          onClose={() => setShowArchive(false)}
        />
      )}
    </div>
  );
};

export default App;