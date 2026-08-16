import axios from 'axios';
import { CurrencyRate } from '../types';

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest';

class CurrencyService {
  private cache: Map<string, CurrencyRate> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private CACHE_DURATION = 3600000; // 1 hour in milliseconds

  async getExchangeRate(from: string, to: string): Promise<number> {
    const cacheKey = `${from}_${to}`;
    const now = Date.now();

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const expiry = this.cacheExpiry.get(cacheKey) || 0;
      if (now < expiry) {
        return this.cache.get(cacheKey)!.rate;
      }
    }

    try {
      // If from and to are the same
      if (from === to) {
        return 1;
      }

      const response = await axios.get(`${EXCHANGE_RATE_API}/${from.toUpperCase()}`);
      const rates = response.data.rates;
      
      if (rates && rates[to.toUpperCase()] !== undefined) {
        const rate = rates[to.toUpperCase()];
        
        // Cache the rate
        this.cache.set(cacheKey, {
          from: from.toUpperCase(),
          to: to.toUpperCase(),
          rate,
          lastUpdated: new Date().toISOString(),
        });
        this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);
        
        return rate;
      }
      
      throw new Error(`Rate not found for ${to}`);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      // Return cached rate if available even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey)!.rate;
      }
      return 1; // Fallback to 1 if all else fails
    }
  }

  async convertAmount(amount: number, from: string, to: string): Promise<number> {
    const rate = await this.getExchangeRate(from, to);
    return amount * rate;
  }

  async updateRates(baseCurrency: string): Promise<void> {
    try {
      const response = await axios.get(`${EXCHANGE_RATE_API}/${baseCurrency.toUpperCase()}`);
      const rates = response.data.rates;
      const timestamp = new Date().toISOString();

      const currencyRates: CurrencyRate[] = Object.keys(rates).map((currency) => ({
        from: baseCurrency.toUpperCase(),
        to: currency,
        rate: rates[currency],
        lastUpdated: timestamp,
      }));

      // Cache all rates
      currencyRates.forEach((rate) => {
        const cacheKey = `${rate.from}_${rate.to}`;
        this.cache.set(cacheKey, rate);
        this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);
      });
    } catch (error) {
      console.error('Error updating rates:', error);
      throw error;
    }
  }

  getSupportedCurrencies(): string[] {
    // Common currencies list
    return [
      'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'SGD',
      'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'MXN', 'BRL', 'ZAR', 'RUB', 'KRW',
      'TRY', 'PLN', 'THB', 'MYR', 'IDR', 'PHP', 'AED', 'SAR', 'EGP', 'NGN'
    ];
  }
}

export const currencyService = new CurrencyService();
