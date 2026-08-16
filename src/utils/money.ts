/**
 * Money utility functions for handling currency in minor units (cents)
 * This prevents floating point errors in financial calculations
 */

/**
 * Convert major unit (dollars) to minor unit (cents)
 */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert minor unit (cents) to major unit (dollars)
 */
export function toMajorUnits(amountMinor: number): number {
  return amountMinor / 100;
}

/**
 * Add two amounts in minor units
 */
export function addMoney(a: number, b: number): number {
  return a + b;
}

/**
 * Subtract two amounts in minor units
 */
export function subtractMoney(a: number, b: number): number {
  return a - b;
}

/**
 * Multiply amount by a factor (for percentages, etc.)
 * Returns result in minor units
 */
export function multiplyMoney(amountMinor: number, factor: number): number {
  return Math.round(amountMinor * factor);
}

/**
 * Calculate percentage of an amount
 * @param amountMinor Amount in minor units
 * @param percentage Percentage value (e.g., 25 for 25%)
 */
export function percentageOfAmount(amountMinor: number, percentage: number): number {
  return Math.round((amountMinor * percentage) / 100);
}

/**
 * Sum an array of amounts in minor units
 */
export function sumMoney(amounts: number[]): number {
  return amounts.reduce((sum, amount) => sum + amount, 0);
}

/**
 * Calculate average of amounts in minor units
 */
export function averageMoney(amounts: number[]): number {
  if (amounts.length === 0) return 0;
  return Math.round(sumMoney(amounts) / amounts.length);
}

/**
 * Get absolute value of amount
 */
export function absMoney(amount: number): number {
  return Math.abs(amount);
}

/**
 * Compare two amounts
 * @returns -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareMoney(a: number, b: number): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Check if amount is positive (income)
 */
export function isIncome(amount: number): boolean {
  return amount > 0;
}

/**
 * Check if amount is negative (expense)
 */
export function isExpense(amount: number): boolean {
  return amount < 0;
}

/**
 * Negate an amount (switch income/expense)
 */
export function negateMoney(amount: number): number {
  return -amount;
}

/**
 * Round amount to nearest minor unit
 * (Useful after multiplication/division operations)
 */
export function roundMoney(amount: number): number {
  return Math.round(amount);
}

/**
 * Format amount for display with proper sign
 */
export function formatAmountDisplay(amountMinor: number): string {
  const abs = Math.abs(amountMinor);
  const dollars = Math.floor(abs / 100);
  const cents = abs % 100;
  const sign = amountMinor < 0 ? "-" : "+";
  return `${sign}$${dollars}.${cents.toString().padStart(2, "0")}`;
}

/**
 * Parse user input string to minor units
 * Handles formats like: "10.50", "$10.50", "10,50"
 */
export function parseMoneyInput(input: string): number {
  // Remove currency symbols and whitespace
  let cleaned = input.replace(/[$€£¥₹\s]/g, "");
  
  // Handle European decimal format (comma as decimal separator)
  if (cleaned.includes(",") && !cleaned.includes(".")) {
    cleaned = cleaned.replace(",", ".");
  }
  
  // Remove thousand separators
  cleaned = cleaned.replace(/[,.](?=\d{3}(?:\D|$))/g, "");
  
  const amount = parseFloat(cleaned);
  
  if (isNaN(amount)) {
    return 0;
  }
  
  return toMinorUnits(amount);
}

/**
 * Validate that an amount is within acceptable range
 */
export function isValidMoneyAmount(amount: number): boolean {
  // Reasonable limits: -$1B to +$1B in minor units
  const MIN_AMOUNT = -100000000000; // -$1 billion
  const MAX_AMOUNT = 100000000000;  // +$1 billion
  
  return Number.isInteger(amount) && amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;
}

/**
 * Create a hash for transaction deduplication
 */
export function createTransactionHash(
  date: Date,
  amountMinor: number,
  reference: string
): string {
  const dateStr = date.toISOString().split("T")[0];
  const base = `${dateStr}|${amountMinor}|${reference}`;
  
  // Simple hash function (not cryptographically secure, but sufficient for deduplication)
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    const char = base.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16);
}
