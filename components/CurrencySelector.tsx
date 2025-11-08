import { Check } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';
import type { Currency } from '@/constants/currencies';
import { getCurrencySymbol } from '@/constants/currencies';
import { useCurrency } from '@/contexts/CurrencyContext';

type CurrencySelectorProps = {
  visible: boolean;
  onClose: () => void;
};

const CURRENCIES: { code: Currency; name: string; flag: string }[] = [
  { code: 'FCFA', name: 'Franc CFA', flag: '🇨🇮' },
  { code: 'USD', name: 'Dollar américain', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
];

export default function CurrencySelector({
  visible,
  onClose,
}: CurrencySelectorProps) {
  const { selectedCurrency, changeCurrency } = useCurrency();

  const handleSelectCurrency = (currency: Currency) => {
    changeCurrency(currency);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Choisir la devise</Text>
            <Text style={styles.subtitle}>
              Les prix seront affichés dans la devise sélectionnée
            </Text>
          </View>

          <View style={styles.currenciesList}>
            {CURRENCIES.map((currency) => (
              <Pressable
                key={currency.code}
                style={[
                  styles.currencyItem,
                  selectedCurrency === currency.code && styles.currencyItemActive,
                ]}
                onPress={() => handleSelectCurrency(currency.code)}
              >
                <View style={styles.currencyLeft}>
                  <Text style={styles.flag}>{currency.flag}</Text>
                  <View style={styles.currencyInfo}>
                    <Text style={styles.currencyName}>{currency.name}</Text>
                    <Text style={styles.currencyCode}>
                      {getCurrencySymbol(currency.code)}
                    </Text>
                  </View>
                </View>

                {selectedCurrency === currency.code && (
                  <Check size={24} color={Colors.light.primary} />
                )}
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fermer</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: Colors.light.background,
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  currenciesList: {
    paddingHorizontal: 16,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  currencyItemActive: {
    backgroundColor: Colors.light.primary + '15',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  currencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  flag: {
    fontSize: 32,
  },
  currencyInfo: {
    gap: 4,
  },
  currencyName: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  currencyCode: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  closeButton: {
    margin: 16,
    marginTop: 8,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
});
