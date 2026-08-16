import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Expense, BankAccount } from '../types';
import { storageService } from '../services/storageService';
import { currencyService } from '../services/currencyService';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [refreshing, setRefreshing] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [loadedExpenses, loadedAccounts, currency] = await Promise.all([
        storageService.getExpenses(),
        storageService.getBankAccounts(),
        storageService.getBaseCurrency(),
      ]);
      
      setExpenses(loadedExpenses);
      setBankAccounts(loadedAccounts);
      setBaseCurrency(currency);
      calculateTotal(loadedExpenses, currency);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const calculateTotal = async (expenseList: Expense[], currency: string) => {
    let total = 0;
    for (const expense of expenseList) {
      if (expense.currency === currency) {
        total += expense.amount;
      } else {
        const converted = await currencyService.convertAmount(
          expense.amount,
          expense.currency,
          currency
        );
        total += converted;
      }
    }
    setTotalExpenses(total);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    
    // Update currency rates
    try {
      await currencyService.updateRates(baseCurrency);
    } catch (error) {
      console.error('Error updating currency rates:', error);
    }
    
    setRefreshing(false);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity
      style={styles.expenseItem}
      onPress={() => navigation.navigate('ExpenseDetail', { expenseId: item.id })}
    >
      <View style={styles.expenseLeft}>
        <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(item.category) }]}>
          <Text style={styles.categoryIconText}>{getCategoryIcon(item.category)}</Text>
        </View>
        <View>
          <Text style={styles.expenseDescription}>{item.description}</Text>
          <Text style={styles.expenseDate}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={styles.expenseRight}>
        <Text style={styles.expenseAmount}>
          -{formatCurrency(item.amount, item.currency)}
        </Text>
        {item.convertedAmount && item.convertedCurrency !== item.currency && (
          <Text style={styles.convertedAmount}>
            {formatCurrency(item.convertedAmount, item.convertedCurrency)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      Groceries: '🛒',
      Dining: '🍽️',
      Transportation: '🚗',
      Shopping: '🛍️',
      Entertainment: '🎬',
      Utilities: '💡',
      Healthcare: '🏥',
      Other: '📝',
    };
    return icons[category] || '📝';
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      Groceries: '#4CAF50',
      Dining: '#FF9800',
      Transportation: '#2196F3',
      Shopping: '#E91E63',
      Entertainment: '#9C27B0',
      Utilities: '#607D8B',
      Healthcare: '#F44336',
      Other: '#9E9E9E',
    };
    return colors[category] || '#9E9E9E';
  };

  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Expenses ({baseCurrency})</Text>
        <Text style={styles.totalAmount}>{formatCurrency(totalExpenses, baseCurrency)}</Text>
        <Text style={styles.accountCount}>
          {bankAccounts.length} Bank Account{bankAccounts.length !== 1 ? 's' : ''} Connected
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddExpense')}
        >
          <Text style={styles.actionButtonText}>+ Add Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('BankAccounts')}
        >
          <Text style={styles.actionButtonText}>🏦 Accounts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('EmailSetup')}
        >
          <Text style={styles.actionButtonText}>📧 Email Sync</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CurrencySettings')}
        >
          <Text style={styles.actionButtonText}>💱 Currency</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Expenses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        <FlatList
          data={expenses.slice(0, 10)}
          renderItem={renderExpenseItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No expenses yet</Text>
              <Text style={styles.emptySubtext}>Tap "+ Add Expense" to get started</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  accountCount: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    margin: 4,
    minWidth: '22%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    textAlign: 'center',
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  expenseItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIconText: {
    fontSize: 20,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 12,
    color: '#666',
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 4,
  },
  convertedAmount: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});
