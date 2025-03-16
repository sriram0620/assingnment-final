import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Dimensions, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, DollarSign, TrendingUp, CircleAlert as AlertCircle, Info } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import ProgressSteps from '@/components/ProgressSteps';
import axios from 'axios';

const { width } = Dimensions.get('window');
const isMobile = width < 768;
const API_URL = 'http://localhost:8081/api';

export default function AssessRiskScreen() {
  const params = useLocalSearchParams();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeField, setActiveField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    annualIncomeGrowth: '',
    monthlyExpenses: '',
    annualExpenseGrowth: '',
    inflationRate: '',
  });
  const [showEmiForm, setShowEmiForm] = useState(false);
  const [emiData, setEmiData] = useState({
    loanAmount: '',
    tenure: '',
    interestRate: '',
  });

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    if (!value) {
      newErrors[field] = 'This field is required';
    } else {
      const numValue = Number(value);
      switch (field) {
        case 'monthlyIncome':
          if (numValue <= 0) {
            newErrors[field] = 'Monthly income must be greater than 0';
          } else {
            delete newErrors[field];
          }
          break;
        case 'annualIncomeGrowth':
        case 'annualExpenseGrowth':
        case 'inflationRate':
          if (numValue < 0 || numValue > 100) {
            newErrors[field] = 'Percentage must be between 0 and 100';
          } else {
            delete newErrors[field];
          }
          break;
        case 'monthlyExpenses':
          if (numValue <= 0) {
            newErrors[field] = 'Monthly expenses must be greater than 0';
          } else if (numValue >= Number(formData.monthlyIncome)) {
            newErrors[field] = 'Expenses cannot exceed income';
          } else {
            delete newErrors[field];
          }
          break;
      }
    }
    setErrors(newErrors);
  };

  const handleNext = async () => {
    try {
      Object.entries(formData).forEach(([key, value]) => validateField(key, value));
      
      if (Object.keys(errors).length === 0) {
        // Save risk assessment data to backend
        const response = await axios.put(`${API_URL}/users/${params.userId}/risk-assessment`, {
          monthlyIncome: Number(formData.monthlyIncome),
          annualIncomeGrowth: Number(formData.annualIncomeGrowth),
          monthlyExpenses: Number(formData.monthlyExpenses),
          annualExpenseGrowth: Number(formData.annualExpenseGrowth),
          inflationRate: Number(formData.inflationRate),
          emiDetails: showEmiForm ? {
            loanAmount: Number(emiData.loanAmount),
            tenure: Number(emiData.tenure),
            interestRate: Number(emiData.interestRate),
            monthlyEMI: calculateEMI()
          } : undefined
        });

        if (response.data) {
          // Navigate to next screen with all params
          router.push({
            pathname: '/(auth)/step-3-goals',
            params: {
              ...params,
              ...formData,
              emiData: showEmiForm ? JSON.stringify(emiData) : undefined
            }
          });
        }
      }
    } catch (error) {
      console.error('Error saving risk assessment:', error);
      Alert.alert(
        'Error',
        'Failed to save risk assessment data. Please try again.'
      );
    }
  };

  const calculateEMI = () => {
    const P = Number(emiData.loanAmount);
    const N = Number(emiData.tenure) * 12;
    const R = Number(emiData.interestRate) / 12 / 100;

    const emi = P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);
    return isNaN(emi) ? 0 : Math.round(emi);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E2EBED', '#fff']}
        style={styles.gradient}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Income & Expenses</Text>
        <Text style={styles.subtitle}>Welcome {params.fullName}, let's assess your financial situation</Text>
      </View>

      <ProgressSteps currentStep={2} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.form}>
          <Animated.View 
            entering={FadeInDown.delay(100)}
            style={styles.formSection}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Monthly Income Details</Text>
              <TouchableOpacity style={styles.infoButton}>
                <Info size={16} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monthly Income</Text>
              <View style={[
                styles.inputContainer,
                activeField === 'monthlyIncome' && styles.inputContainerFocused,
                errors.monthlyIncome && styles.inputError
              ]}>
                <DollarSign size={20} color={activeField === 'monthlyIncome' ? '#000' : '#666'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your monthly income"
                  value={formData.monthlyIncome}
                  onChangeText={(value) => {
                    setFormData(prev => ({ ...prev, monthlyIncome: value }));
                    validateField('monthlyIncome', value);
                  }}
                  onFocus={() => setActiveField('monthlyIncome')}
                  onBlur={() => {
                    setActiveField(null);
                    validateField('monthlyIncome', formData.monthlyIncome);
                  }}
                  keyboardType="numeric"
                />
                {errors.monthlyIncome && (
                  <AlertCircle size={20} color="#FF4D4F" style={styles.errorIcon} />
                )}
              </View>
              {errors.monthlyIncome && (
                <Animated.Text 
                  entering={FadeIn}
                  style={styles.errorText}
                >
                  {errors.monthlyIncome}
                </Animated.Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expected Annual Income Growth Rate (%)</Text>
              <View style={[
                styles.inputContainer,
                activeField === 'annualIncomeGrowth' && styles.inputContainerFocused,
                errors.annualIncomeGrowth && styles.inputError
              ]}>
                <TrendingUp size={20} color={activeField === 'annualIncomeGrowth' ? '#000' : '#666'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter expected annual income growth"
                  value={formData.annualIncomeGrowth}
                  onChangeText={(value) => {
                    setFormData(prev => ({ ...prev, annualIncomeGrowth: value }));
                    validateField('annualIncomeGrowth', value);
                  }}
                  onFocus={() => setActiveField('annualIncomeGrowth')}
                  onBlur={() => {
                    setActiveField(null);
                    validateField('annualIncomeGrowth', formData.annualIncomeGrowth);
                  }}
                  keyboardType="numeric"
                />
                {errors.annualIncomeGrowth && (
                  <AlertCircle size={20} color="#FF4D4F" style={styles.errorIcon} />
                )}
              </View>
              {errors.annualIncomeGrowth && (
                <Animated.Text 
                  entering={FadeIn}
                  style={styles.errorText}
                >
                  {errors.annualIncomeGrowth}
                </Animated.Text>
              )}
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(200)}
            style={styles.formSection}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Monthly Expenses Details</Text>
              <TouchableOpacity style={styles.infoButton}>
                <Info size={16} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monthly Expenses</Text>
              <View style={[
                styles.inputContainer,
                activeField === 'monthlyExpenses' && styles.inputContainerFocused,
                errors.monthlyExpenses && styles.inputError
              ]}>
                <DollarSign size={20} color={activeField === 'monthlyExpenses' ? '#000' : '#666'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your monthly expenses"
                  value={formData.monthlyExpenses}
                  onChangeText={(value) => {
                    setFormData(prev => ({ ...prev, monthlyExpenses: value }));
                    validateField('monthlyExpenses', value);
                  }}
                  onFocus={() => setActiveField('monthlyExpenses')}
                  onBlur={() => {
                    setActiveField(null);
                    validateField('monthlyExpenses', formData.monthlyExpenses);
                  }}
                  keyboardType="numeric"
                />
                {errors.monthlyExpenses && (
                  <AlertCircle size={20} color="#FF4D4F" style={styles.errorIcon} />
                )}
              </View>
              {errors.monthlyExpenses && (
                <Animated.Text 
                  entering={FadeIn}
                  style={styles.errorText}
                >
                  {errors.monthlyExpenses}
                </Animated.Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expected Annual Expense Growth Rate (%)</Text>
              <View style={[
                styles.inputContainer,
                activeField === 'annualExpenseGrowth' && styles.inputContainerFocused,
                errors.annualExpenseGrowth && styles.inputError
              ]}>
                <TrendingUp size={20} color={activeField === 'annualExpenseGrowth' ? '#000' : '#666'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter expected expense growth"
                  value={formData.annualExpenseGrowth}
                  onChangeText={(value) => {
                    setFormData(prev => ({ ...prev, annualExpenseGrowth: value }));
                    validateField('annualExpenseGrowth', value);
                  }}
                  onFocus={() => setActiveField('annualExpenseGrowth')}
                  onBlur={() => {
                    setActiveField(null);
                    validateField('annualExpenseGrowth', formData.annualExpenseGrowth);
                  }}
                  keyboardType="numeric"
                />
                {errors.annualExpenseGrowth && (
                  <AlertCircle size={20} color="#FF4D4F" style={styles.errorIcon} />
                )}
              </View>
              {errors.annualExpenseGrowth && (
                <Animated.Text 
                  entering={FadeIn}
                  style={styles.errorText}
                >
                  {errors.annualExpenseGrowth}
                </Animated.Text>
              )}
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(300)}
            style={styles.formSection}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Economic Factors</Text>
              <TouchableOpacity style={styles.infoButton}>
                <Info size={16} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expected Inflation Rate (%)</Text>
              <View style={[
                styles.inputContainer,
                activeField === 'inflationRate' && styles.inputContainerFocused,
                errors.inflationRate && styles.inputError
              ]}>
                <TrendingUp size={20} color={activeField === 'inflationRate' ? '#000' : '#666'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter expected inflation rate"
                  value={formData.inflationRate}
                  onChangeText={(value) => {
                    setFormData(prev => ({ ...prev, inflationRate: value }));
                    validateField('inflationRate', value);
                  }}
                  onFocus={() => setActiveField('inflationRate')}
                  onBlur={() => {
                    setActiveField(null);
                    validateField('inflationRate', formData.inflationRate);
                  }}
                  keyboardType="numeric"
                />
                {errors.inflationRate && (
                  <AlertCircle size={20} color="#FF4D4F" style={styles.errorIcon} />
                )}
              </View>
              {errors.inflationRate && (
                <Animated.Text 
                  entering={FadeIn}
                  style={styles.errorText}
                >
                  {errors.inflationRate}
                </Animated.Text>
              )}
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400)}
            style={styles.formSection}
          >
            <TouchableOpacity
              style={styles.emiButton}
              onPress={() => setShowEmiForm(!showEmiForm)}
            >
              <Text style={styles.emiButtonText}>
                {showEmiForm ? 'Hide EMI Calculator' : 'Add Existing EMIs'}
              </Text>
            </TouchableOpacity>

            {showEmiForm && (
              <Animated.View
                entering={FadeIn}
                style={styles.emiForm}
              >
                <Text style={styles.emiTitle}>EMI Calculator</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Loan Amount</Text>
                  <View style={[
                    styles.inputContainer,
                    activeField === 'loanAmount' && styles.inputContainerFocused
                  ]}>
                    <DollarSign size={20} color={activeField === 'loanAmount' ? '#000' : '#666'} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter loan amount"
                      value={emiData.loanAmount}
                      onChangeText={(value) => setEmiData(prev => ({ ...prev, loanAmount: value }))}
                      onFocus={() => setActiveField('loanAmount')}
                      onBlur={() => setActiveField(null)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Loan Tenure (Years)</Text>
                  <View style={[
                    styles.inputContainer,
                    activeField === 'tenure' && styles.inputContainerFocused
                  ]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter loan tenure"
                      value={emiData.tenure}
                      onChangeText={(value) => setEmiData(prev => ({ ...prev, tenure: value }))}
                      onFocus={() => setActiveField('tenure')}
                      onBlur={() => setActiveField(null)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Interest Rate (%)</Text>
                  <View style={[
                    styles.inputContainer,
                    activeField === 'interestRate' && styles.inputContainerFocused
                  ]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter interest rate"
                      value={emiData.interestRate}
                      onChangeText={(value) => setEmiData(prev => ({ ...prev, interestRate: value }))}
                      onFocus={() => setActiveField('interestRate')}
                      onBlur={() => setActiveField(null)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {emiData.loanAmount && emiData.tenure && emiData.interestRate && (
                  <View style={styles.emiResult}>
                    <Text style={styles.emiResultLabel}>Monthly EMI</Text>
                    <Text style={styles.emiResultValue}>
                      ₹ {calculateEMI().toLocaleString()}
                    </Text>
                  </View>
                )}
              </Animated.View>
            )}
          </Animated.View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            Object.keys(errors).length > 0 && styles.buttonDisabled
          ]}
          onPress={handleNext}
          disabled={Object.keys(errors).length > 0}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    padding: isMobile ? 16 : 24,
    gap: 24,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  infoButton: {
    padding: 4,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    height: 56,
    paddingHorizontal: 16,
  },
  inputContainerFocused: {
    borderColor: '#C3FF4E',
    backgroundColor: '#F7FFED',
  },
  inputError: {
    borderColor: '#FF4D4F',
    backgroundColor: '#FFF2F0',
  },
  inputIcon: {
    marginRight: 12,
  },
  errorIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    paddingVertical: isMobile ? 8 : 12,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#FF4D4F',
  },
  emiButton: {
    backgroundColor: '#F7FFED',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  emiButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
  },
  emiForm: {
    gap: 20,
    marginTop: 16,
  },
  emiTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  emiResult: {
    backgroundColor: '#F7FFED',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  emiResultLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  emiResultValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#000',
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
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
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