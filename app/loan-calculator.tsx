import { Stack } from 'expo-router';
import { Calculator } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Slider from '@/components/Slider';

import Colors from '@/constants/colors';

function formatPrice(price: number): string {
  return price.toLocaleString('fr-FR') + ' FCFA';
}

export default function LoanCalculatorScreen() {
  const [loanAmount, setLoanAmount] = useState(50000000);
  const [downPayment, setDownPayment] = useState(10000000);
  const [duration, setDuration] = useState(15);
  const [interestRate, setInterestRate] = useState(6.5);

  const borrowed = loanAmount - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const months = duration * 12;
  const monthlyPayment =
    borrowed * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  const totalCost = monthlyPayment * months;
  const totalInterest = totalCost - borrowed;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Calculatrice de prêt',
          headerBackTitle: 'Retour',
          presentation: 'modal',
        }}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Calculator size={32} color={Colors.light.primary} />
            </View>
            <Text style={styles.title}>Calculatrice de prêt immobilier</Text>
            <Text style={styles.subtitle}>
              Calculez vos mensualités et votre capacité d&apos;emprunt
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Prix du bien</Text>
              <Text style={styles.sliderValue}>{formatPrice(loanAmount)}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={5000000}
              maximumValue={200000000}
              step={1000000}
              value={loanAmount}
              onValueChange={setLoanAmount}
              minimumTrackTintColor={Colors.light.primary}
              maximumTrackTintColor={Colors.light.border}
              thumbTintColor={Colors.light.primary}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Apport personnel</Text>
              <Text style={styles.sliderValue}>{formatPrice(downPayment)}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={50000000}
              step={500000}
              value={downPayment}
              onValueChange={setDownPayment}
              minimumTrackTintColor={Colors.light.primary}
              maximumTrackTintColor={Colors.light.border}
              thumbTintColor={Colors.light.primary}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Durée</Text>
              <Text style={styles.sliderValue}>{duration} ans</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={25}
              step={1}
              value={duration}
              onValueChange={setDuration}
              minimumTrackTintColor={Colors.light.primary}
              maximumTrackTintColor={Colors.light.border}
              thumbTintColor={Colors.light.primary}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Taux d&apos;intérêt</Text>
              <Text style={styles.sliderValue}>{interestRate.toFixed(1)}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={3}
              maximumValue={12}
              step={0.1}
              value={interestRate}
              onValueChange={setInterestRate}
              minimumTrackTintColor={Colors.light.primary}
              maximumTrackTintColor={Colors.light.border}
              thumbTintColor={Colors.light.primary}
            />
          </View>

          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Mensualité estimée</Text>
            <Text style={styles.resultValue}>{formatPrice(Math.round(monthlyPayment))}</Text>

            <View style={styles.resultDetails}>
              <View style={styles.resultDetailItem}>
                <Text style={styles.resultDetailLabel}>Montant emprunté</Text>
                <Text style={styles.resultDetailValue}>{formatPrice(borrowed)}</Text>
              </View>
              <View style={styles.resultDetailItem}>
                <Text style={styles.resultDetailLabel}>Coût total</Text>
                <Text style={styles.resultDetailValue}>{formatPrice(Math.round(totalCost))}</Text>
              </View>
              <View style={styles.resultDetailItem}>
                <Text style={styles.resultDetailLabel}>Intérêts totaux</Text>
                <Text style={styles.resultDetailValue}>{formatPrice(Math.round(totalInterest))}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>ℹ️ Informations</Text>
            <Text style={styles.infoText}>
              Cette calculatrice vous donne une estimation des mensualités. Les taux réels peuvent
              varier selon les banques et votre profil emprunteur. Consultez un conseiller bancaire
              pour une étude personnalisée.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  resultBox: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  resultLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.light.primary,
    marginBottom: 24,
  },
  resultDetails: {
    gap: 16,
  },
  resultDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultDetailLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  resultDetailValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
});
