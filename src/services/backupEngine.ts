import { GameSaveData } from '../types/game';

export function exportBackupJSON(data: GameSaveData): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `broke-student-sim-backup-${dateStr}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface BackupValidationResult {
  isValid: boolean;
  data: GameSaveData | null;
  error?: string;
}

export function validateAndParseBackupJSON(jsonText: string): BackupValidationResult {
  try {
    const parsed = JSON.parse(jsonText);
    if (!parsed || typeof parsed !== 'object') {
      return { isValid: false, data: null, error: 'Backup file is not a valid JSON object.' };
    }

    if (!Array.isArray(parsed.transactions)) {
      return { isValid: false, data: null, error: 'Backup is missing valid transaction ledger.' };
    }

    // Validate transactions have essential fields
    for (const tx of parsed.transactions) {
      if (!tx.id || !tx.type || typeof tx.amountPaise !== 'number') {
        return { isValid: false, data: null, error: 'Transaction records are corrupted or missing amount.' };
      }
    }

    return {
      isValid: true,
      data: parsed as GameSaveData,
    };
  } catch (e: any) {
    return {
      isValid: false,
      data: null,
      error: `Failed to parse JSON file: ${e.message}`,
    };
  }
}

