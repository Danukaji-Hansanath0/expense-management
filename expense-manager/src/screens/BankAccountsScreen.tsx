import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { BankAccount } from '../types';
import { storageService } from '../services/storageService';

type BankAccountsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BankAccounts'>;

export default function BankAccountsScreen() {
  const navigation = useNavigation<BankAccountsScreenNavigationProp>();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newBankName, setNewBankName] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newCurrency, setNewCurrency] = useState('USD');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const loadedAccounts = await storageService.getBankAccounts();
      setAccounts(loadedAccounts);
    } catch (error) {
      console.error('Error loading bank accounts:', error);
    }
  };

  const handleAddAccount = async () => {
    if (!newAccountName || !newBankName) {
      Alert.alert('Error', 'Please fill in account name and bank name');
      return;
    }

    try {
      const newAccount: BankAccount = {
        id: Date.now().toString(),
        name: newAccountName,
        bankName: newBankName,
        accountNumber: newAccountNumber || '****',
        currency: newCurrency,
        balance: 0,
        lastSyncDate: undefined,
      };

      const updatedAccounts = [...accounts, newAccount];
      await storageService.saveBankAccounts(updatedAccounts);
      setAccounts(updatedAccounts);
      
      // Reset form
      setNewAccountName('');
      setNewBankName('');
      setNewAccountNumber('');
      setNewCurrency('USD');
      setShowAddForm(false);
      
      Alert.alert('Success', 'Bank account added successfully');
    } catch (error) {
      console.error('Error adding bank account:', error);
      Alert.alert('Error', 'Failed to add bank account');
    }
  };

  const handleDeleteAccount = (accountId: string) => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this bank account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedAccounts = accounts.filter((acc) => acc.id !== accountId);
              await storageService.saveBankAccounts(updatedAccounts);
              setAccounts(updatedAccounts);
              Alert.alert('Success', 'Bank account deleted');
            } catch (error) {
              console.error('Error deleting bank account:', error);
              Alert.alert('Error', 'Failed to delete bank account');
            }
          },
        },
      ]
    );
  };

  const handleSyncAccount = async (account: BankAccount) => {
    Alert.alert(
      'Sync Account',
      `Sync transactions for ${account.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sync Now',
          onPress: async () => {
            try {
              // In production, this would trigger email parsing
              // For now, just update the last sync date
              const updatedAccount = {
                ...account,
                lastSyncDate: new Date().toISOString(),
              };
              
              const updatedAccounts = accounts.map((acc) =>
                acc.id === account.id ? updatedAccount : acc
              );
              
              await storageService.saveBankAccounts(updatedAccounts);
              setAccounts(updatedAccounts);
              
              Alert.alert('Success', 'Account synced successfully');
            } catch (error) {
              console.error('Error syncing account:', error);
              Alert.alert('Error', 'Failed to sync account');
            }
          },
        },
      ]
    );
  };

  const renderAccountItem = ({ item }: { item: BankAccount }) => (
    <View style={styles.accountItem}>
      <View style={styles.accountHeader}>
        <View style={styles.bankIcon}>
          <Text style={styles.bankIconText}>🏦</Text>
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{item.name}</Text>
          <Text style={styles.bankName}>{item.bankName}</Text>
          <Text style={styles.accountNumber}>Account: {item.accountNumber}</Text>
        </View>
      </View>
      
      <View style={styles.accountDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Currency:</Text>
          <Text style={styles.detailValue}>{item.currency}</Text>
        </View>
        {item.lastSyncDate && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last Sync:</Text>
            <Text style={styles.detailValue}>
              {new Date(item.lastSyncDate).toLocaleString()}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.accountActions}>
        <TouchableOpacity
          style={styles.syncButton}
          onPress={() => handleSyncAccount(item)}
        >
          <Text style={styles.syncButtonText}>🔄 Sync</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteAccount(item.id)}
        >
          <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        renderItem={renderAccountItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bank accounts connected</Text>
            <Text style={styles.emptySubtext}>
              Add a bank account to start tracking expenses
            </Text>
          </View>
        }
        ListHeaderComponent={
          <>
            {!showAddForm ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddForm(true)}
              >
                <Text style={styles.addButtonText}>+ Add Bank Account</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.addForm}>
                <Text style={styles.formTitle}>Add New Bank Account</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="Account Name (e.g., Main Checking)"
                  value={newAccountName}
                  onChangeText={setNewAccountName}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Bank Name (e.g., Chase)"
                  value={newBankName}
                  onChangeText={setNewBankName}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Account Number (last 4 digits)"
                  value={newAccountNumber}
                  onChangeText={setNewAccountNumber}
                  keyboardType="number-pad"
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Currency (e.g., USD)"
                  value={newCurrency}
                  onChangeText={setNewCurrency}
                  maxLength={3}
                />
                
                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={[styles.formButton, styles.cancelButton]}
                    onPress={() => setShowAddForm(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.formButton, styles.saveButton]}
                    onPress={handleAddAccount}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  addButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  accountItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bankIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bankIconText: {
    fontSize: 24,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bankName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 12,
    color: '#999',
  },
  accountDetails: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  accountActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  syncButton: {
    backgroundColor: '#E8EAF6',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  syncButtonText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 8,
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '600',
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
