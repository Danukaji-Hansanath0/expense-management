export interface Expense {
  id: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string;
  bankAccountId?: string;
  convertedAmount?: number;
  convertedCurrency?: string;
}

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  currency: string;
  balance: number;
  email?: string;
  lastSyncDate?: string;
}

export interface EmailConfig {
  id: string;
  email: string;
  provider: 'gmail' | 'outlook' | 'yahoo' | 'other';
  isActive: boolean;
  lastChecked?: string;
}

export interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}
