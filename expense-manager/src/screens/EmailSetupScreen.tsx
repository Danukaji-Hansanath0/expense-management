import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { EmailConfig, BankAccount } from '../types';
import { storageService } from '../services/storageService';
import { emailParserService } from '../services/emailParserService';

type EmailSetupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmailSetup'>;

const EMAIL_PROVIDERS = [
  { id: 'gmail', name: 'Gmail', domain: '@gmail.com' },
  { id: 'outlook', name: 'Outlook', domain: '@outlook.com' },
  { id: 'yahoo', name: 'Yahoo', domain: '@yahoo.com' },
  { id: 'other', name: 'Other', domain: '' },
];

export default function EmailSetupScreen() {
  const navigation = useNavigation<EmailSetupScreenNavigationProp>();
  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(EMAIL_PROVIDERS[0]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [configs, accounts] = await Promise.all([
        storageService.getEmailConfigs(),
        storageService.getBankAccounts(),
      ]);
      setEmailConfigs(configs);
      setBankAccounts(accounts);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddEmail = async () => {
    if (!newEmail || !selectedAccountId) {
      Alert.alert('Error', 'Please fill in email and select a bank account');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      const newConfig: EmailConfig = {
        id: Date.now().toString(),
        email: newEmail,
        provider: selectedProvider.id as 'gmail' | 'outlook' | 'yahoo' | 'other',
        isActive: true,
      };

      const updatedConfigs = [...emailConfigs, newConfig];
      await storageService.saveEmailConfigs(updatedConfigs);
      setEmailConfigs(updatedConfigs);

      // Update bank account with email
      const updatedAccounts = bankAccounts.map((acc) =>
        acc.id === selectedAccountId ? { ...acc, email: newEmail } : acc
      );
      await storageService.saveBankAccounts(updatedAccounts);
      setBankAccounts(updatedAccounts);

      // Reset form
      setNewEmail('');
      setSelectedAccountId('');
      setShowAddForm(false);

      Alert.alert('Success', 'Email configuration added successfully');
    } catch (error) {
      console.error('Error adding email config:', error);
      Alert.alert('Error', 'Failed to add email configuration');
    }
  };

  const handleDeleteConfig = (configId: string) => {
    Alert.alert(
      'Delete Email Configuration',
      'Are you sure you want to delete this email configuration?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedConfigs = emailConfigs.filter((c) => c.id !== configId);
              await storageService.saveEmailConfigs(updatedConfigs);
              setEmailConfigs(updatedConfigs);
              Alert.alert('Success', 'Email configuration deleted');
            } catch (error) {
              console.error('Error deleting email config:', error);
              Alert.alert('Error', 'Failed to delete email configuration');
            }
          },
        },
      ]
    );
  };

  const handleCheckEmails = async (config: EmailConfig) => {
    setLoading(true);
    try {
      // Find associated bank account
      const account = bankAccounts.find((acc) => acc.email === config.email);
      
      if (!account) {
        Alert.alert('Info', 'No bank account associated with this email');
        return;
      }

      // In production, this would connect to email API and parse statements
      // For now, show informational message
      Alert.alert(
        'Email Integration',
        `To enable automatic email parsing for ${config.email}:\n\n` +
        `1. You need to set up OAuth2 authentication with your email provider\n` +
        `2. Grant permissions to read emails from your bank\n` +
        `3. The app will automatically parse bank statement emails\n\n` +
        `This is a demo - actual implementation requires backend services.`,
        [{ text: 'OK' }]
      );

      // Update last checked time
      const updatedConfig = {
        ...config,
        lastChecked: new Date().toISOString(),
      };
      
      const updatedConfigs = emailConfigs.map((c) =>
        c.id === config.id ? updatedConfig : c
      );
      await storageService.saveEmailConfigs(updatedConfigs);
      setEmailConfigs(updatedConfigs);
    } catch (error) {
      console.error('Error checking emails:', error);
      Alert.alert('Error', 'Failed to check emails');
    } finally {
      setLoading(false);
    }
  };

  const renderConfigItem = ({ item }: { item: EmailConfig }) => (
    <View style={styles.configItem}>
      <View style={styles.emailHeader}>
        <View style={styles.emailIcon}>
          <Text style={styles.emailIconText}>📧</Text>
        </View>
        <View style={styles.emailInfo}>
          <Text style={styles.emailAddress}>{item.email}</Text>
          <Text style={styles.providerName}>
            Provider: {EMAIL_PROVIDERS.find((p) => p.id === item.provider)?.name}
          </Text>
          <Text style={styles.status}>
            Status: {item.isActive ? '✅ Active' : '❌ Inactive'}
          </Text>
          {item.lastChecked && (
            <Text style={styles.lastChecked}>
              Last checked: {new Date(item.lastChecked).toLocaleString()}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.configActions}>
        <TouchableOpacity
          style={[styles.checkButton, loading && styles.buttonDisabled]}
          onPress={() => handleCheckEmails(item)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#4F46E5" />
          ) : (
            <Text style={styles.checkButtonText}>🔄 Check Emails</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteConfig(item.id)}
        >
          <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={emailConfigs}
        renderItem={renderConfigItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No email configurations</Text>
            <Text style={styles.emptySubtext}>
              Connect your email to automatically import bank statements
            </Text>
          </View>
        }
        ListHeaderComponent={
          <>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>📧 Email Integration</Text>
              <Text style={styles.infoText}>
                Connect your email account to automatically parse bank statement emails
                and update your expenses. Supports Gmail, Outlook, Yahoo, and other providers.
              </Text>
              <Text style={styles.infoWarning}>
                ⚠️ Note: Full email integration requires OAuth2 setup with email providers
                and backend services for security.
              </Text>
            </View>

            {!showAddForm ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddForm(true)}
              >
                <Text style={styles.addButtonText}>+ Add Email Account</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.addForm}>
                <Text style={styles.formTitle}>Connect Email Account</Text>

                <Text style={styles.label}>Select Email Provider</Text>
                <View style={styles.providerContainer}>
                  {EMAIL_PROVIDERS.map((provider) => (
                    <TouchableOpacity
                      key={provider.id}
                      style={[
                        styles.providerButton,
                        selectedProvider.id === provider.id &&
                          styles.providerButtonSelected,
                      ]}
                      onPress={() => setSelectedProvider(provider)}
                    >
                      <Text
                        style={[
                          styles.providerButtonText,
                          selectedProvider.id === provider.id &&
                            styles.providerButtonTextSelected,
                        ]}
                      >
                        {provider.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder={`yourname${selectedProvider.domain || '.com'}`}
                  value={newEmail}
                  onChangeText={setNewEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.label}>Link to Bank Account</Text>
                {bankAccounts.length === 0 ? (
                  <View style={styles.noAccountsMessage}>
                    <Text style={styles.noAccountsText}>
                      No bank accounts found. Please add a bank account first.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.accountSelector}>
                    {bankAccounts.map((account) => (
                      <TouchableOpacity
                        key={account.id}
                        style={[
                          styles.accountOption,
                          selectedAccountId === account.id &&
                            styles.accountOptionSelected,
                        ]}
                        onPress={() => setSelectedAccountId(account.id)}
                      >
                        <Text
                          style={[
                            styles.accountOptionText,
                            selectedAccountId === account.id &&
                              styles.accountOptionTextSelected,
                          ]}
                        >
                          {account.name} ({account.bankName})
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={[styles.formButton, styles.cancelButton]}
                    onPress={() => setShowAddForm(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.formButton,
                      styles.saveButton,
                      bankAccounts.length === 0 && styles.buttonDisabled,
                    ]}
                    onPress={handleAddEmail}
                    disabled={bankAccounts.length === 0}
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
  infoCard: {
    backgroundColor: '#E8EAF6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  infoWarning: {
    fontSize: 12,
    color: '#F44336',
    fontStyle: 'italic',
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
  },
  providerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  providerButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: '#DDD',
    minWidth: '22%',
    alignItems: 'center',
  },
  providerButtonSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  providerButtonText: {
    fontSize: 12,
    color: '#666',
  },
  providerButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  noAccountsMessage: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  noAccountsText: {
    color: '#856404',
    fontSize: 14,
  },
  accountSelector: {
    marginVertical: 8,
  },
  accountOption: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  accountOptionSelected: {
    backgroundColor: '#E8EAF6',
    borderColor: '#4F46E5',
  },
  accountOptionText: {
    fontSize: 14,
    color: '#666',
  },
  accountOptionTextSelected: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
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
  buttonDisabled: {
    opacity: 0.5,
  },
  configItem: {
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
  emailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emailIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emailIconText: {
    fontSize: 24,
  },
  emailInfo: {
    flex: 1,
  },
  emailAddress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  status: {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 2,
  },
  lastChecked: {
    fontSize: 11,
    color: '#999',
  },
  configActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  checkButton: {
    backgroundColor: '#E8EAF6',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkButtonText: {
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
