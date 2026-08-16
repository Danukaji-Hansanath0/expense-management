import { Expense, BankAccount, EmailConfig, CurrencyRate } from '../types';

const STORAGE_KEYS = {
  EXPENSES: '@expense_manager_expenses',
  BANK_ACCOUNTS: '@expense_manager_bank_accounts',
  EMAIL_CONFIGS: '@expense_manager_email_configs',
  CURRENCY_RATES: '@expense_manager_currency_rates',
  BASE_CURRENCY: '@expense_manager_base_currency',
};

class StorageService {
  async saveExpenses(expenses: Expense[]): Promise<void> {
    try {
      await require('expo-secure-store').setItemAsync(
        STORAGE_KEYS.EXPENSES,
        JSON.stringify(expenses)
      );
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  }

  async getExpenses(): Promise<Expense[]> {
    try {
      const data = await require('expo-secure-store').getItemAsync(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting expenses:', error);
      return [];
    }
  }

  async saveBankAccounts(accounts: BankAccount[]): Promise<void> {
    try {
      await require('expo-secure-store').setItemAsync(
        STORAGE_KEYS.BANK_ACCOUNTS,
        JSON.stringify(accounts)
      );
    } catch (error) {
      console.error('Error saving bank accounts:', error);
    }
  }

  async getBankAccounts(): Promise<BankAccount[]> {
    try {
      const data = await require('expo-secure-store').getItemAsync(STORAGE_KEYS.BANK_ACCOUNTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting bank accounts:', error);
      return [];
    }
  }

  async saveEmailConfigs(configs: EmailConfig[]): Promise<void> {
    try {
      await require('expo-secure-store').setItemAsync(
        STORAGE_KEYS.EMAIL_CONFIGS,
        JSON.stringify(configs)
      );
    } catch (error) {
      console.error('Error saving email configs:', error);
    }
  }

  async getEmailConfigs(): Promise<EmailConfig[]> {
    try {
      const data = await require('expo-secure-store').getItemAsync(STORAGE_KEYS.EMAIL_CONFIGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting email configs:', error);
      return [];
    }
  }

  async saveCurrencyRates(rates: CurrencyRate[]): Promise<void> {
    try {
      await require('expo-secure-store').setItemAsync(
        STORAGE_KEYS.CURRENCY_RATES,
        JSON.stringify(rates)
      );
    } catch (error) {
      console.error('Error saving currency rates:', error);
    }
  }

  async getCurrencyRates(): Promise<CurrencyRate[]> {
    try {
      const data = await require('expo-secure-store').getItemAsync(STORAGE_KEYS.CURRENCY_RATES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting currency rates:', error);
      return [];
    }
  }

  async saveBaseCurrency(currency: string): Promise<void> {
    try {
      await require('expo-secure-store').setItemAsync(STORAGE_KEYS.BASE_CURRENCY, currency);
    } catch (error) {
      console.error('Error saving base currency:', error);
    }
  }

  async getBaseCurrency(): Promise<string> {
    try {
      const data = await require('expo-secure-store').getItemAsync(STORAGE_KEYS.BASE_CURRENCY);
      return data || 'USD';
    } catch (error) {
      console.error('Error getting base currency:', error);
      return 'USD';
    }
  }
}

export const storageService = new StorageService();
