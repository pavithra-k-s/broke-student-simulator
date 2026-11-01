import { GameSaveData, AppSettings } from '../types/game';

const STORAGE_KEY = 'BROKE_STUDENT_SIM_SAVE_V1';
const CURRENT_VERSION = 1;

export const DEFAULT_SETTINGS: AppSettings = {
  crtEffect: true,
  animations: true,
};

export function loadGameData(): GameSaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        version: CURRENT_VERSION,
        profile: null,
        transactions: [],
        settings: DEFAULT_SETTINGS,
      };
    }

    const parsed = JSON.parse(raw) as Partial<GameSaveData>;

    // Handle version compatibility or migration if needed in future
    return {
      version: parsed.version || CURRENT_VERSION,
      profile: parsed.profile || null,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
      settings: {
        crtEffect: parsed.settings?.crtEffect ?? DEFAULT_SETTINGS.crtEffect,
        animations: parsed.settings?.animations ?? DEFAULT_SETTINGS.animations,
      },
      gamePlay: parsed.gamePlay,
    };
  } catch (error) {
    console.error('Failed to load Broke Student Simulator save file from LocalStorage:', error);
    return {
      version: CURRENT_VERSION,
      profile: null,
      transactions: [],
      settings: DEFAULT_SETTINGS,
    };
  }
}

export function saveGameData(data: GameSaveData): boolean {
  try {
    const payload = {
      ...data,
      version: CURRENT_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error('Failed to save to LocalStorage:', error);
    return false;
  }
}

export function clearGameData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear LocalStorage:', error);
  }
}
