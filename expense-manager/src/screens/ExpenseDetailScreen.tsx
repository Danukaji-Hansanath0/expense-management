import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Expense } from '../types';
import { storageService } from '../services/storageService';

type ExpenseDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExpenseDetail'>;
type ExpenseDetailScreenRouteProp = RouteProp<RootStackParamList, 'ExpenseDetail'>;

interface Props {
  navigation: ExpenseDetailScreenNavigationProp;
  route: ExpenseDetailScreenRouteProp;
}

export default function ExpenseDetailScreen({ navigation, route }: Props) {
  const { expenseId } = route.params;
  const [expense, setExpense] = useState<Expense | null>(null);
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');

  useEffect(() => {
    loadExpense();
  }, [expenseId]);

  const loadExpense = async () => {
    try {
      const expenses = await storageService.getExpenses();
      const foundExpense = expenses.find((e) => e.id === expenseId);
      
      if (foundExpense) {
        setExpense(foundExpense);
        const currency = await storageService.getBaseCurrency();
        setBaseCurrency(currency);
      } else {
        Alert.alert('Error', 'Expense not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading expense:', error);
      Alert.alert('Error', 'Failed to load expense details');
    }
  };

  const handleDeleteExpense = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const expenses = await storageService.getExpenses();
              const updatedExpenses = expenses.filter((e) => e.id !== expenseId);
              await storageService.saveExpenses(updatedExpenses);
              
              Alert.alert('Success', 'Expense deleted', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              console.error('Error deleting expense:', error);
              Alert.alert('Error', 'Failed to delete expense');
            }
          },
        },
      ]
    );
  };

  if (!expense) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

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
    <ScrollView style={styles.container}>
      {/* Category Icon */}
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.categoryIconLarge,
            { backgroundColor: getCategoryColor(expense.category) },
          ]}
        >
          <Text style={styles.categoryIconTextLarge}>
            {getCategoryIcon(expense.category)}
          </Text>
        </View>
      </View>

      {/* Amount */}
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>{formatCurrency(expense.amount, expense.currency)}</Text>
        {expense.convertedAmount && expense.convertedCurrency !== expense.currency && (
          <Text style={styles.convertedAmount}>
            ≈ {formatCurrency(expense.convertedAmount, expense.convertedCurrency)}
          </Text>
        )}
      </View>

      {/* Details Card */}
      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Description</Text>
          <Text style={styles.detailValue}>{expense.description}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Category</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{expense.category}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>
            {new Date(expense.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Original Currency</Text>
          <Text style={styles.detailValue}>{expense.currency}</Text>
        </View>

        {expense.convertedCurrency && expense.convertedCurrency !== expense.currency && (
          <>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Converted To</Text>
              <Text style={styles.detailValue}>{expense.convertedCurrency}</Text>
            </View>
          </>
        )}

        {expense.bankAccountId && (
          <>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bank Account</Text>
              <Text style={styles.detailValue}>Linked Account</Text>
            </View>
          </>
        )}
      </View>

      {/* Delete Button */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteExpense}>
        <Text style={styles.deleteButtonText}>🗑️ Delete Expense</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  iconContainer: {
    alignItems: 'center',
    padding: 24,
  },
  categoryIconLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIconTextLarge: {
    fontSize: 48,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 4,
  },
  convertedAmount: {
    fontSize: 18,
    color: '#999',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 4,
  },
  categoryBadge: {
    backgroundColor: '#E8EAF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryBadgeText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 32,
  },
});
