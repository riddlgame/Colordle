
import { DailyColor } from './types';
import { getFormattedDate } from './utils/helpers';

export const ADMIN_PASSWORD = 'riddlword@01123581321';

// Provide some static past dates and ensure "today" is always covered
export const INITIAL_DAILY_COLORS: DailyColor[] = [
  { date: getFormattedDate(), color: { r: 79, g: 70, b: 229 } }, // Indigo-600 as default for today
  { date: '25/05/2024', color: { r: 100, g: 150, b: 200 } },
  { date: '26/05/2024', color: { r: 255, g: 99, b: 71 } },
  { date: '27/05/2024', color: { r: 60, g: 179, b: 113 } },
  { date: '28/05/2024', color: { r: 147, g: 112, b: 219 } },
  { date: '24/05/2024', color: { r: 255, g: 215, b: 0 } },
];

export const TOLERANCE = 5;
export const HINT_RANGE = 20;
export const MAX_HINTS = 2;

export const COLOR_CLASSES = {
  correctRed: 'bg-red-50 border-red-200 text-red-700',
  correctGreen: 'bg-green-50 border-green-200 text-green-700',
  correctBlue: 'bg-blue-50 border-blue-200 text-blue-700',
  incorrect: 'bg-gray-50 border-gray-100 text-gray-400'
};
