import { BankAccount, Expense } from '../types';
import { storageService } from './storageService';
import { currencyService } from './currencyService';

// Mock email parsing - in production this would connect to actual email APIs
class EmailParserService {
  // This is a mock implementation. In production, you would:
  // 1. Use OAuth2 to connect to Gmail/Outlook APIs
  // 2. Fetch emails with bank statements
  // 3. Parse the email content or attachments
  // 4. Extract transaction data
  
  async parseBankStatementEmail(emailContent: string, bankAccount: BankAccount): Promise<Partial<Expense>[]> {
    // Mock implementation - regex patterns to extract common bank statement formats
    const expenses: Partial<Expense>[] = [];
    
    // Common patterns for bank transactions
    const patterns = [
      // Pattern for: "Debit of $100.00 at STORE NAME on DATE"
      /(?:Debit|Withdrawal|Payment)[^\d]*(\d+(?:\.\d{2})?)\s*(?:USD|EUR|GBP|INR)?\s*(?:at|from|to)?\s*([A-Za-z\s]+?)(?:on|\d)/gi,
      // Pattern for: "$100.00 - STORE NAME"
      /(\d+(?:\.\d{2})?)\s*(?:USD|EUR|GBP|INR)?\s*[-•]\s*([A-Za-z\s]+?)(?:\n|$)/gi,
      // Pattern for: "DATE DESCRIPTION AMOUNT"
      /(\d{1,2}\/\d{1,2}\/\d{2,4})\s+([A-Za-z\s]+?)\s+(\d+(?:\.\d{2})?)/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(emailContent)) !== null) {
        try {
          const amount = parseFloat(match[1] || match[3]);
          const description = match[2] || 'Unknown Transaction';
          
          if (!isNaN(amount)) {
            expenses.push({
              amount: Math.abs(amount),
              description: description.trim(),
              category: this.categorizeTransaction(description),
              date: new Date().toISOString(),
              currency: bankAccount.currency,
              bankAccountId: bankAccount.id,
            });
          }
        } catch (error) {
          console.error('Error parsing transaction:', error);
        }
      }
    });

    return expenses;
  }

  private categorizeTransaction(description: string): string {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('grocery') || lowerDesc.includes('supermarket') || lowerDesc.includes('walmart') || lowerDesc.includes('target')) {
      return 'Groceries';
    } else if (lowerDesc.includes('restaurant') || lowerDesc.includes('cafe') || lowerDesc.includes('food') || lowerDesc.includes('uber eats')) {
      return 'Dining';
    } else if (lowerDesc.includes('gas') || lowerDesc.includes('fuel') || lowerDesc.includes('shell') || lowerDesc.includes('bp')) {
      return 'Transportation';
    } else if (lowerDesc.includes('amazon') || lowerDesc.includes('shopping') || lowerDesc.includes('store')) {
      return 'Shopping';
    } else if (lowerDesc.includes('netflix') || lowerDesc.includes('spotify') || lowerDesc.includes('entertainment')) {
      return 'Entertainment';
    } else if (lowerDesc.includes('electric') || lowerDesc.includes('water') || lowerDesc.includes('utility')) {
      return 'Utilities';
    } else if (lowerDesc.includes('pharmacy') || lowerDesc.includes('medical') || lowerDesc.includes('health')) {
      return 'Healthcare';
    } else {
      return 'Other';
    }
  }

  async checkEmailForStatements(bankAccount: BankAccount): Promise<Expense[]> {
    // This is where you would integrate with actual email APIs
    // For now, return empty array as placeholder
    
    // In production, implement:
    // 1. Connect to Gmail API using OAuth2
    // 2. Search for emails from bank's email address
    // 3. Fetch and parse email content
    // 4. Extract transactions
    // 5. Convert currencies if needed
    
    console.log(`Checking emails for bank account: ${bankAccount.name}`);
    
    // Mock data for demonstration
    return [];
  }
}

export const emailParserService = new EmailParserService();
