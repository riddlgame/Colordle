
export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface DailyColor {
  date: string; // DD/MM/YYYY
  color: RGB;
}

export interface GuessResult {
  guess: RGB;
  evaluation: {
    r: 'correct' | 'incorrect';
    g: 'correct' | 'incorrect';
    b: 'correct' | 'incorrect';
  };
}

export enum GameState {
  Playing = 'PLAYING',
  Won = 'WON'
}

export interface GameStatus {
  date: string;
  guesses: GuessResult[];
  hintsUsed: number;
  state: GameState;
}

export interface Hint {
  component: 'r' | 'g' | 'b';
  range: [number, number]; // [min, max]
}
