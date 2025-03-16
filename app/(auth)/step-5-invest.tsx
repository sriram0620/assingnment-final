import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Wallet, CreditCard, Ban as Bank, ChevronRight, Shield, BadgeCheck, CircleAlert as AlertCircle } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import ProgressSteps from '@/components/ProgressSteps';
import axios from 'axios';

const { width } = Dimensions.get('window');
const isMobile = width < 768;
// const API_URL = 'http://localhost:5000/api';
const paymentMethods = [
  {
    id: 'netbanking',
    title: 'Net Banking',
    icon: Bank,
    description: 'Direct bank transfer',
  },
  {
    id: 'upi',
    title: 'UPI',
    icon: Wallet,
    description: 'Instant UPI payment',
  },
  {
    id: 'card',
    title: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Pay using card',
  },
];

const investmentDetails = {
  monthlyInvestment: 60000,
  portfolioAllocation: [
    { name: 'Large Cap Mutual Funds', amount: 25000 },
    { name: 'Mid Cap Mutual Funds', amount: 15000 },
    { name: 'Debt Funds', amount: 12000 },
    { name: 'Gold ETF', amount: 8000 },
  ],
  benefits: [
    'Automated monthly investments',
    'Portfolio rebalancing',
    'Tax-saving investments',
    'Expert fund selection',
  ],
};

export default function InvestScreen() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amount, setAmount] = useState(investmentDetails.monthlyInvestment.toString());

  const handleInvest = async () => {
    try {
      // await axios.put(`${API_URL}/users/user123/investment`, {
      //   investment: {
      //     paymentMethod: selectedMethod,
      //     monthlyAmount: parseInt(amount),
      //     portfolioAllocation: investmentDetails.portfolioAllocation
      //   }
      // });
      
      router.replace('/(app)');
    } catch (error) {
      console.error('Error updating investment details:', error);
      Alert.alert('Error', 'Failed to update investment details');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E2EBED', '#fff']} style={styles.gradient} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Start Investing</Text>
        <Text style={styles.subtitle}>Set up your first investment</Text>
      </View>

      <ProgressSteps currentStep={5} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Investment Amount</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="Enter amount"
              />
              <TouchableOpacity 
                style={styles.maxButton}
                onPress={() => setAmount(investmentDetails.monthlyInvestment.toString())}
              >
                <Text style={styles.maxButtonText}>MAX</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Portfolio Allocation</Text>
            <View style={styles.allocationList}>
              {investmentDetails.portfolioAllocation.map((item, index) => (
                <View key={index} style={styles.allocationItem}>
                  <Text style={styles.allocationName}>{item.name}</Text>
                  <Text style={styles.allocationAmount}>₹{item.amount.toLocaleString()}</Text>
                </View>
              ))}
              <View style={[styles.allocationItem, styles.totalItem]}>
                <Text style={styles.totalLabel}>Total Investment</Text>
                <Text style={styles.totalAmount}>
                  ₹{investmentDetails.monthlyInvestment.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Payment Method</Text>
            <View style={styles.paymentMethods}>
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.paymentMethod,
                      selectedMethod === method.id && styles.selectedMethod,
                    ]}
                    onPress={() => setSelectedMethod(method.id)}
                  >
                    <Icon
                      size={24}
                      color={selectedMethod === method.id ? '#000' : '#666'}
                    />
                    <View style={styles.paymentInfo}>
                      <Text style={styles.paymentTitle}>{method.title}</Text>
                      <Text style={styles.paymentDescription}>{method.description}</Text>
                    </View>
                    <ChevronRight size={20} color="#666" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.benefitsCard}>
            <LinearGradient colors={['#F7FFED', '#fff']} style={styles.benefitsGradient} />
            <View style={styles.benefitsHeader}>
              <Shield size={24} color="#00B07C" />
              <Text style={styles.benefitsTitle}>Benefits</Text>
            </View>
            <View style={styles.benefitsList}>
              {investmentDetails.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <BadgeCheck size={20} color="#00B07C" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.disclaimerCard}>
            <AlertCircle size={20} color="#666" />
            <Text style={styles.disclaimerText}>
              By proceeding, you agree to set up an automated monthly investment plan. You can modify or cancel this at any time.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !selectedMethod && styles.buttonDisabled]}
          onPress={handleInvest}
          disabled={!selectedMethod}
        >
          <Text style={styles.buttonText}>Start Investing</Text>
          <BadgeCheck size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  header: {
    padding: 24,
    paddingTop: Platform.OS === 'web' ? 24 : 60,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: isMobile ? 16 : 24,
    gap: 24,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FFED',
    borderRadius: 12,
    padding: 16,
  },
  currencySymbol: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#000',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#000',
  },
  maxButton: {
    backgroundColor: '#C3FF4E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  maxButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#000',
  },
  allocationList: {
    gap: 16,
  },
  allocationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  allocationName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  allocationAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
  },
  totalItem: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
  },
  totalAmount: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#00B07C',
  },
  paymentMethods: {
    gap: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#F7FFED',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedMethod: {
    borderColor: '#C3FF4E',
    backgroundColor: '#F7FFED',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontFamily: 'Inter-SemiB old',
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  paymentDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  benefitsCard: {
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  benefitsGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  benefitsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#000',
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
  },
  disclaimerText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  footer: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    backgroundColor: '#C3FF4E',
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#e1e1e1',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#000',
  },
});