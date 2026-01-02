
import { RGB, DailyColor, GameStatus, GameState, GuessResult } from '../types';
import { TOLERANCE } from '../constants';

export const getFormattedDate = (date: Date = new Date()): string => {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

export const generateRandomColor = (): RGB => ({
  r: Math.floor(Math.random() * 256),
  g: Math.floor(Math.random() * 256),
  b: Math.floor(Math.random() * 256),
});

export const rgbToHex = (rgb: RGB): string => {
  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
};

export const evaluateGuess = (guess: RGB, target: RGB): GuessResult['evaluation'] => {
  return {
    r: Math.abs(guess.r - target.r) <= TOLERANCE ? 'correct' : 'incorrect',
    g: Math.abs(guess.g - target.g) <= TOLERANCE ? 'correct' : 'incorrect',
    b: Math.abs(guess.b - target.b) <= TOLERANCE ? 'correct' : 'incorrect',
  };
};

export const storage = {
  getDailyColors: (): DailyColor[] => {
    try {
      const data = localStorage.getItem('colordle_daily_colors');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to parse daily colors from storage", e);
      return [];
    }
  },
  saveDailyColors: (colors: DailyColor[]) => {
    localStorage.setItem('colordle_daily_colors', JSON.stringify(colors));
  },
  getGameState: (date: string): GameStatus | null => {
    try {
      const data = localStorage.getItem(`colordle_game_${date}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },
  saveGameState: (status: GameStatus) => {
    localStorage.setItem(`colordle_game_${status.date}`, JSON.stringify(status));
  },
  getWonDates: (): string[] => {
    const wonDates: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('colordle_game_')) {
        try {
          const game = JSON.parse(localStorage.getItem(key) || '{}');
          if (game.state === GameState.Won) {
            wonDates.push(game.date);
          }
        } catch (e) {}
      }
    }
    return wonDates;
  }
};
