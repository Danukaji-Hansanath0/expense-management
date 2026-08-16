# Expense Manager - Android App with Expo

A comprehensive expense and bank account management application built with Expo (React Native) featuring automatic email parsing for bank statements and live currency conversion.

## Features

### 💰 Expense Management
- Add, view, edit, and delete expenses
- Categorize expenses (Groceries, Dining, Transportation, Shopping, Entertainment, Utilities, Healthcare, Other)
- Track expenses in multiple currencies
- Automatic currency conversion to base currency
- View expense history and details

### 🏦 Bank Account Management
- Connect multiple bank accounts
- Track account balances and currencies
- Link email addresses to bank accounts
- Sync transactions from connected emails

### 📧 Email Integration
- Connect Gmail, Outlook, Yahoo, or other email providers
- Automatic parsing of bank statement emails
- Extract transaction data from email content
- Smart categorization of expenses based on merchant names
- **Note**: Full email integration requires OAuth2 setup with email providers

### 💱 Live Currency Conversion
- Support for 30+ currencies (USD, EUR, GBP, JPY, INR, etc.)
- Real-time exchange rate fetching
- Automatic caching of rates (1 hour)
- Convert all expenses to your base currency for totals
- Pull-to-refresh to update rates

## Project Structure

```
expense-manager/
├── App.tsx                          # Main app entry with navigation
├── src/
│   ├── screens/                     # Screen components
│   │   ├── HomeScreen.tsx           # Dashboard with expense summary
│   │   ├── AddExpenseScreen.tsx     # Add new expense form
│   │   ├── BankAccountsScreen.tsx   # Manage bank accounts
│   │   ├── EmailSetupScreen.tsx     # Configure email integration
│   │   ├── CurrencySettingsScreen.tsx  # Currency settings
│   │   └── ExpenseDetailScreen.tsx  # View expense details
│   ├── services/                    # Business logic
│   │   ├── storageService.ts        # Secure local storage
│   │   ├── currencyService.ts       # Currency conversion API
│   │   └── emailParserService.ts    # Email parsing logic
│   ├── types/                       # TypeScript interfaces
│   │   └── index.ts                 # Type definitions
│   └── utils/                       # Utility functions
└── package.json                     # Dependencies
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android device or emulator (for testing)
- iOS device or simulator (optional, for iOS testing)

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd expense-manager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on Android:**
   - Press `a` in the terminal to run on Android emulator
   - Or scan the QR code with the Expo Go app on your Android device

5. **Run on iOS (macOS only):**
   - Press `i` in the terminal to run on iOS simulator
   - Or scan the QR code with the Expo Go app on your iOS device

## Usage Guide

### Getting Started

1. **Set Your Base Currency**
   - Navigate to "Currency Settings"
   - Select your preferred base currency (e.g., USD, EUR, GBP)
   - All totals will be displayed in this currency

2. **Add Bank Accounts**
   - Go to "Bank Accounts"
   - Tap "+ Add Bank Account"
   - Enter account details (name, bank name, currency)

3. **Connect Email (Optional)**
   - Go to "Email Setup"
   - Tap "+ Add Email Account"
   - Select your email provider
   - Enter your email address
   - Link to a bank account

4. **Add Expenses Manually**
   - Tap "+ Add Expense" from home screen
   - Enter amount, currency, description, category, and date
   - Save the expense

5. **View Expenses**
   - Home screen shows recent expenses
   - Tap any expense to view details
   - Pull down to refresh and update currency rates

## Technical Implementation Notes

### Email Integration (Production Ready Features)

For full email integration in production, you need to:

1. **Set up OAuth2 with Email Providers:**
   - Gmail: Use Google Cloud Console to enable Gmail API
   - Outlook: Register app in Azure Portal for Microsoft Graph API
   - Yahoo: Use Yahoo Developer Network for Mail API

2. **Backend Services Required:**
   - Secure OAuth2 token storage
   - Server-side email fetching (never store credentials on client)
   - Email parsing service for bank statements
   - Webhook support for real-time updates

3. **Security Considerations:**
   - Never store email passwords in the app
   - Use secure OAuth2 flows
   - Implement proper token refresh mechanisms
   - Follow email provider's security guidelines

### Currency Conversion

- Uses free Exchange Rate API (`https://api.exchangerate-api.com/v4/latest`)
- Rates are cached for 1 hour to reduce API calls
- Supports 30+ major currencies
- Fallback to cached rates if API is unavailable

### Data Storage

- Uses Expo SecureStore for encrypted local storage
- Data stored locally on device
- No cloud sync in current implementation
- Consider adding backend for multi-device sync

## Customization

### Adding New Categories

Edit `src/screens/AddExpenseScreen.tsx`:
```typescript
const CATEGORIES = [
  'Groceries',
  'Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Other',
  // Add your custom categories here
];
```

### Adding New Currencies

Edit `src/services/currencyService.ts`:
```typescript
getSupportedCurrencies(): string[] {
  return [
    'USD', 'EUR', 'GBP', // ... add more
    'YOUR_CURRENCY_CODE',
  ];
}
```

### Styling

All styles use React Native StyleSheet. Modify colors, fonts, and layouts in each screen's style object.

## Building for Production

### Android APK

```bash
eas build --platform android
```

### iOS App Store

```bash
eas build --platform ios
```

Note: You'll need an Expo account and EAS (Expo Application Services) configured.

## Troubleshooting

### Common Issues

1. **App won't start:**
   ```bash
   npm install
   expo start -c  # Clear cache
   ```

2. **Currency rates not updating:**
   - Check internet connection
   - API might be rate-limited (wait and try again)

3. **Email integration not working:**
   - This is expected in demo mode
   - Requires backend OAuth2 implementation

4. **Navigation errors:**
   - Ensure all screen files exist
   - Check import paths are correct

## Future Enhancements

- [ ] Backend API for cloud sync
- [ ] Full OAuth2 email integration
- [ ] PDF bank statement parsing
- [ ] Budget tracking and alerts
- [ ] Expense reports and analytics
- [ ] Receipt scanning with OCR
- [ ] Multi-user support
- [ ] Export to CSV/PDF
- [ ] Biometric authentication
- [ ] Push notifications for bill reminders

## License

MIT License - Feel free to use this project for learning or commercial purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Expo documentation: https://docs.expo.dev
3. Check React Navigation docs: https://reactnavigation.org

---

**Note**: This is a demonstration project. For production use, implement proper backend services, security measures, and comply with financial data regulations (PCI DSS, GDPR, etc.).
