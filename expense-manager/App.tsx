import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import BankAccountsScreen from './src/screens/BankAccountsScreen';
import EmailSetupScreen from './src/screens/EmailSetupScreen';
import CurrencySettingsScreen from './src/screens/CurrencySettingsScreen';
import ExpenseDetailScreen from './src/screens/ExpenseDetailScreen';

export type RootStackParamList = {
  Home: undefined;
  AddExpense: undefined;
  BankAccounts: undefined;
  EmailSetup: undefined;
  CurrencySettings: undefined;
  ExpenseDetail: { expenseId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4F46E5',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Expense Manager' }}
        />
        <Stack.Screen 
          name="AddExpense" 
          component={AddExpenseScreen} 
          options={{ title: 'Add Expense' }}
        />
        <Stack.Screen 
          name="BankAccounts" 
          component={BankAccountsScreen} 
          options={{ title: 'Bank Accounts' }}
        />
        <Stack.Screen 
          name="EmailSetup" 
          component={EmailSetupScreen} 
          options={{ title: 'Email Setup' }}
        />
        <Stack.Screen 
          name="CurrencySettings" 
          component={CurrencySettingsScreen} 
          options={{ title: 'Currency Settings' }}
        />
        <Stack.Screen 
          name="ExpenseDetail" 
          component={ExpenseDetailScreen} 
          options={{ title: 'Expense Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
