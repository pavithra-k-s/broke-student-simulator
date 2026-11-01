/**
 * Currency utility module for Indian Rupee (INR) handling.
 * All core calculations are stored and calculated in integer PAISE (1 INR = 100 Paise)
 * to avoid floating-point math rounding issues.
 */

export function rupeesToPaise(rupees: number): number {
  if (isNaN(rupees) || !isFinite(rupees)) return 0;
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  if (isNaN(paise) || !isFinite(paise)) return 0;
  return paise / 100;
}

/**
 * Format paise into Indian Rupee string (e.g., "₹1,500", "-₹350.50")
 */
export function formatINR(paise: number, options?: { showPaise?: boolean; showSign?: boolean }): string {
  const isNegative = paise < 0;
  const absPaise = Math.abs(paise);
  const rupees = absPaise / 100;

  const hasFractions = absPaise % 100 !== 0;
  const showDecimals = options?.showPaise ?? (hasFractions);

  const formattedNumber = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(rupees);

  if (isNegative) {
    return `-₹${formattedNumber}`;
  }

  if (options?.showSign && paise > 0) {
    return `+₹${formattedNumber}`;
  }

  return `₹${formattedNumber}`;
}

/**
 * Parse numeric string from user input into paise
 */
export function parseInputToPaise(input: string | number): number {
  if (typeof input === 'number') {
    return rupeesToPaise(input);
  }
  const cleanStr = input.replace(/[^\d.-]/g, '');
  const num = parseFloat(cleanStr);
  return isNaN(num) ? 0 : Math.round(num * 100);
}

