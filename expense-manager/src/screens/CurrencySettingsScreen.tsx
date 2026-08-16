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
import { storageService } from '../services/storageService';
import { currencyService } from '../services/currencyService';

export default function CurrencySettingsScreen() {
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [currency, rates] = await Promise.all([
        storageService.getBaseCurrency(),
        storageService.getCurrencyRates(),
      ]);
      
      setBaseCurrency(currency);
      setAvailableCurrencies(currencyService.getSupportedCurrencies());
      
      if (rates.length > 0) {
        const latestRate = rates[0];
        setLastUpdated(latestRate.lastUpdated);
      }
    } catch (error) {
      console.error('Error loading currency data:', error);
    }
  };

  const handleUpdateRates = async () => {
    setLoading(true);
    try {
      await currencyService.updateRates(baseCurrency);
      
      // Save updated rates to storage
      const rates = Array.from((currencyService as any).cache.values());
      await storageService.saveCurrencyRates(rates);
      
      setLastUpdated(new Date().toISOString());
      Alert.alert('Success', 'Currency rates updated successfully');
    } catch (error) {
      console.error('Error updating rates:', error);
      Alert.alert('Error', 'Failed to update currency rates. Using cached rates.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeBaseCurrency = (currency: string) => {
    setBaseCurrency(currency);
    setShowCurrencyPicker(false);
    setSearchQuery('');
    
    // Save to storage
    storageService.saveBaseCurrency(currency);
    
    Alert.alert(
      'Base Currency Changed',
      `Your base currency is now ${currency}. All expenses will be converted to this currency for totals.`,
      [{ text: 'OK' }]
    );
  };

  const filteredCurrencies = availableCurrencies.filter((curr) =>
    curr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Current Base Currency */}
      <View style={styles.currentCurrencyCard}>
        <Text style={styles.cardTitle}>Base Currency</Text>
        <TouchableOpacity
          style={styles.currencySelector}
          onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
        >
          <Text style={styles.currencyCode}>{baseCurrency}</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Tap to change base currency</Text>
      </View>

      {/* Update Rates Button */}
      <TouchableOpacity
        style={[styles.updateButton, loading && styles.buttonDisabled]}
        onPress={handleUpdateRates}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.updateButtonText}>🔄 Update Exchange Rates</Text>
        )}
      </TouchableOpacity>

      {/* Last Updated Info */}
      {lastUpdated && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Last Updated:</Text>
          <Text style={styles.infoValue}>
            {new Date(lastUpdated).toLocaleString()}
          </Text>
        </View>
      )}

      {/* Currency Picker */}
      {showCurrencyPicker && (
        <View style={styles.currencyPicker}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Base Currency</Text>
            <TouchableOpacity onPress={() => setShowCurrencyPicker(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search currency..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FlatList
            data={filteredCurrencies}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.currencyOption,
                  baseCurrency === item && styles.currencyOptionSelected,
                ]}
                onPress={() => handleChangeBaseCurrency(item)}
              >
                <Text
                  style={[
                    styles.currencyOptionText,
                    baseCurrency === item && styles.currencyOptionTextSelected,
                  ]}
                >
                  {item}
                </Text>
                {baseCurrency === item && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            style={styles.currencyList}
          />
        </View>
      )}

      {/* Supported Currencies List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Supported Currencies</Text>
        <View style={styles.currenciesGrid}>
          {availableCurrencies.map((currency) => (
            <View key={currency} style={styles.currencyBadge}>
              <Text style={styles.currencyBadgeText}>{currency}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 How Currency Conversion Works</Text>
        <Text style={styles.infoText}>
          • All expenses are stored in their original currency
        </Text>
        <Text style={styles.infoText}>
          • The app automatically converts amounts to your base currency for totals
        </Text>
        <Text style={styles.infoText}>
          • Exchange rates are fetched live and cached for 1 hour
        </Text>
        <Text style={styles.infoText}>
          • Pull down on the home screen to refresh rates
        </Text>
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
  currentCurrencyCard: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    paddingHorizontal: 24,
    minWidth: 150,
    justifyContent: 'center',
  },
  currencyCode: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginRight: 8,
  },
  dropdownIcon: {
    fontSize: 14,
    color: '#4F46E5',
  },
  hint: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 12,
    opacity: 0.9,
  },
  updateButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  currencyPicker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    maxHeight: 300,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
    padding: 4,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 12,
  },
  currencyList: {
    maxHeight: 200,
  },
  currencyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  currencyOptionSelected: {
    backgroundColor: '#E8EAF6',
  },
  currencyOptionText: {
    fontSize: 16,
    color: '#333',
  },
  currencyOptionTextSelected: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  currenciesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  currencyBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    margin: 4,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  currencyBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#E8EAF6',
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
    marginBottom: 6,
  },
});
