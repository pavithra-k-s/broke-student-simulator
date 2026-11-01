import { Transaction, TransactionType, ExpenseCategory, IncomeCategory } from '../types/transaction';
import { parseInputToPaise, paiseToRupees } from './currency';

/**
 * Converts transaction array to standard CSV string.
 */
export function exportTransactionsToCSV(transactions: Transaction[]): string {
  const headers = ['ID', 'Type', 'Description', 'Amount_INR', 'Category', 'Date', 'Notes'];

  const rows = transactions.map((tx) => {
    const cleanDesc = `"${(tx.description || '').replace(/"/g, '""')}"`;
    const cleanNotes = `"${(tx.notes || '').replace(/"/g, '""')}"`;
    const amountRupees = paiseToRupees(tx.amountPaise).toFixed(2);
    return [
      tx.id,
      tx.type,
      cleanDesc,
      amountRupees,
      tx.category,
      tx.date,
      cleanNotes,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Triggers a browser file download of CSV content.
 */
export function downloadCSVFile(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface CSVImportResult {
  success: boolean;
  imported: Transaction[];
  errors: string[];
}

/**
 * Parses and validates CSV string into Transaction array.
 */
export function parseCSVToTransactions(csvText: string): CSVImportResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return {
      success: false,
      imported: [],
      errors: ['CSV file is empty or missing data rows.'],
    };
  }

  // Parse header
  const headerLine = lines[0].toLowerCase();
  if (!headerLine.includes('type') || !headerLine.includes('amount')) {
    return {
      success: false,
      imported: [],
      errors: ['CSV header must contain at least "Type", "Amount", and "Description".'],
    };
  }

  const imported: Transaction[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple regex to split comma separated values respecting double quotes
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const matches: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(line)) !== null) {
      let val = match[1] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1).replace(/""/g, '"');
      }
      matches.push(val.trim());
      if (regex.lastIndex === match.index) {
        regex.lastIndex++;
      }
    }

    if (matches.length < 4) {
      errors.push(`Row ${i + 1}: Insufficient columns.`);
      continue;
    }

    // Try extracting fields: ID, Type, Description, Amount, Category, Date, Notes
    const typeStr = (matches[1] || '').toLowerCase();
    const type: TransactionType = typeStr === 'income' ? 'income' : 'expense';
    const description = matches[2] || `Imported Item ${i}`;
    const amountPaise = parseInputToPaise(matches[3] || '0');
    const category = (matches[4] || (type === 'income' ? 'Allowance' : 'Other')) as
      | ExpenseCategory
      | IncomeCategory;
    const date = matches[5] && !isNaN(Date.parse(matches[5])) ? matches[5] : new Date().toISOString().split('T')[0];
    const notes = matches[6] || undefined;

    if (amountPaise <= 0) {
      errors.push(`Row ${i + 1}: Invalid or zero amount.`);
      continue;
    }

    imported.push({
      id: `tx_imp_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      description,
      amountPaise,
      category,
      date,
      notes,
      createdAt: Date.now(),
    });
  }

  return {
    success: imported.length > 0,
    imported,
    errors,
  };
}

