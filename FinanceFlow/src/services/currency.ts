import { storage, STORAGE_KEYS } from "./storage";

const FRANKFURTER_API = "https://api.frankfurter.dev/v1";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

// Supported currencies
export const SUPPORTED_CURRENCIES = [
  "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "HKD", "NZD",
  "SEK", "KRW", "SGD", "NOK", "MXN", "INR", "RUB", "ZAR", "TRY", "BRL",
  "TWD", "DKK", "PLN", "THB", "IDR", "HUF", "CZK", "ILS", "CLP", "PHP",
  "AED", "SAR", "MYR", "VND", "EGP", "PKR", "NGN", "BDT", "ARS", "COP"
] as const;

export type CurrencyCode = typeof SUPPORTED_CURRENCIES[number];

interface RateCache {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}

/**
 * Fetch exchange rates from Frankfurter API with caching
 */
export async function getExchangeRates(
  base: CurrencyCode = "USD",
  forceRefresh = false
): Promise<Record<string, number>> {
  // Check cache first
  if (!forceRefresh) {
    const cached = getCachedRates();
    if (cached && cached.base === base) {
      const age = Date.now() - cached.timestamp;
      if (age < CACHE_TTL_MS) {
        return cached.rates;
      }
    }
  }

  try {
    // Fetch fresh rates
    const response = await fetch(`${FRANKFURTER_API}/latest?base=${base}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch rates: ${response.status}`);
    }
    
    const data = await response.json();
    const rates: Record<string, number> = { [base]: 1, ...data.rates };
    
    // Cache the rates
    cacheRates(rates, base);
    
    return rates;
  } catch (error) {
    console.warn("Currency API error, using cached rates:", error);
    
    // Fallback to cached rates even if expired
    const cached = getCachedRates();
    if (cached) {
      return cached.rates;
    }
    
    // Last resort: return identity rate
    return { [base]: 1 };
  }
}

/**
 * Convert amount from one currency to another
 * Amounts are in minor units (cents) to avoid floating point errors
 */
export async function convertCurrency(
  amountMinor: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amountMinor;
  }

  try {
    const rates = await getExchangeRates(fromCurrency);
    const rate = rates[toCurrency] ?? 1;
    
    // Convert and round to nearest integer (minor unit)
    return Math.round(amountMinor * rate);
  } catch (error) {
    console.error("Currency conversion error:", error);
    return amountMinor; // Return original amount on error
  }
}

/**
 * Format money amount with currency symbol
 */
export function formatMoney(
  amountMinor: number,
  currency: CurrencyCode = "USD",
  locale: string = "en-US"
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountMinor / 100);
  } catch (error) {
    // Fallback formatting
    return `${currency} ${(amountMinor / 100).toFixed(2)}`;
  }
}

/**
 * Format money with sign indicator for income/expense
 */
export function formatMoneyWithSign(
  amountMinor: number,
  currency: CurrencyCode = "USD",
  locale: string = "en-US"
): string {
  const formatted = formatMoney(Math.abs(amountMinor), currency, locale);
  
  if (amountMinor >= 0) {
    return `+${formatted}`;
  } else {
    return `-${formatted}`;
  }
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: CurrencyCode): string {
  try {
    const parts = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).formatToParts(1);
    
    const symbolPart = parts.find(p => p.type === "currency");
    return symbolPart?.value ?? currency;
  } catch {
    return currency;
  }
}

// Internal cache helpers
function getCachedRates(): RateCache | null {
  const ratesJson = storage.getString(STORAGE_KEYS.RATES_CACHE);
  const timestamp = storage.getString(STORAGE_KEYS.RATES_TIMESTAMP);
  const base = storage.getString(STORAGE_KEYS.BASE_CURRENCY);
  
  if (!ratesJson || !timestamp) {
    return null;
  }
  
  return {
    rates: JSON.parse(ratesJson),
    timestamp: parseInt(timestamp, 10),
    base: base ?? "USD",
  };
}

function cacheRates(rates: Record<string, number>, base: string): void {
  storage.set(STORAGE_KEYS.RATES_CACHE, JSON.stringify(rates));
  storage.set(STORAGE_KEYS.RATES_TIMESTAMP, Date.now().toString());
  storage.set(STORAGE_KEYS.BASE_CURRENCY, base);
}

/**
 * Force refresh exchange rates
 */
export async function refreshExchangeRates(base: CurrencyCode = "USD"): Promise<void> {
  await getExchangeRates(base, true);
}

/**
 * Check if rates are stale
 */
export function areRatesStale(): boolean {
  const cached = getCachedRates();
  if (!cached) return true;
  
  const age = Date.now() - cached.timestamp;
  return age > CACHE_TTL_MS;
}
