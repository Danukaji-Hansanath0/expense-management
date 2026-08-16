import { Timestamp } from "firebase/firestore";

// Account types
export type AccountType = 
  | "checking"
  | "savings"
  | "credit"
  | "cash"
  | "e-wallet"
  | "investment"
  | "loan"
  | "other";

export interface Account {
  id: string;
  bankName: string;
  nickname: string;
  type: AccountType;
  currency: string;
  balance: number;
  color: string;
  icon: string;
  lastSyncAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type TransactionDirection = "in" | "out";
export type TransactionSource = "manual" | "email" | "import";
export type TransactionStatus = "pending_review" | "posted" | "archived";

export interface Transaction {
  id: string;
  accountId: string;
  date: Timestamp;
  amount: number;
  currency: string;
  convertedAmount: number;
  direction: TransactionDirection;
  category: string;
  merchant: string;
  note?: string;
  source: TransactionSource;
  hash?: string;
  status: TransactionStatus;
  receiptUrl?: string;
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Budget {
  id: string;
  categoryId: string;
  monthlyLimit: number;
  currency: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  keywords: string[];
}

export type EmailProvider = "gmail" | "outlook" | "yahoo" | "imap";
export type EmailConnectionStatus = "active" | "error" | "disconnected";

export interface EmailConnection {
  id: string;
  provider: EmailProvider;
  email: string;
  status: EmailConnectionStatus;
  lastScanAt?: Timestamp;
  errorMessage?: string;
  createdAt: Timestamp;
}

export type ThemeMode = "system" | "light" | "dark";

export interface UserProfile {
  uid: string;
  name: string;
  baseCurrency: string;
  theme: ThemeMode;
  createdAt: Timestamp;
}
