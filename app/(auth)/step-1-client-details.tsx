import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Dimensions, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, User, Calendar, Heart, Info, CircleAlert as AlertCircle } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import ProgressSteps from '@/components/ProgressSteps';
import axios from 'axios';

const { width } = Dimensions.get('window');
const isMobile = width < 768;
const API_URL = 'http://localhost:5000/api'; // Change from api.example.com

export default function ClientDetailsScreen() {
  const params = useLocalSearchParams();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    retirementAge: '',
    lifeExpectancy: '',
  });
  const [activeField, setActiveField] = useState<string | null>(null);

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    const age = Number(params.age);

    if (!value) {
      newErrors[field] = `${field === 'retirementAge' ? 'Retirement age' : 'Life expectancy'} is required`;
    } else {
      const numValue = Number(value);
      if (field === 'retirementAge') {
        if (numValue <= age) {
          newErrors[field] = 'Retirement age must be greater than current age';
        } else if (numValue > 100) {
          newErrors[field] = 'Retirement age must be less than 100';
        } else {
          delete newErrors[field];
        }
      } else if (field === 'lifeExpectancy') {
        if (numValue <= Number(formData.retirementAge)) {
          newErrors[field] = 'Life expectancy must be greater than retirement age';
        } else if (numValue > 120) {
          newErrors[field] = 'Life expectancy must be less than 120';
        } else {
          delete newErrors[field];
        }
      }
    }
    setErrors(newErrors);
  };

  const handleNext = async () => {
    try {
      validateField('retirementAge', formData.retirementAge);
      validateField('lifeExpectancy', formData.lifeExpectancy);
      
      if (Object.keys(errors).length === 0 && formData.retirementAge && formData.lifeExpectancy) {
        const response = await axios.put(`${API_URL}/users/${params.userId}/client-details`, {
          retirementAge: parseInt(formData.retirementAge),
          lifeExpectancy: parseInt(formData.lifeExpectancy)
        });

        if (response.data) {
          router.push({
            pathname: '/(auth)/assess-risk',
            params: {
              ...params,
              ...formData
            }
          });
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error updating client details:', error.message);
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to connect to server. Please try again.'
        );
      } else {
        console.error('Error:', error);
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
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
        <Text style={styles.title}>Client Details</Text>
        <Text style={styles.subtitle}>To start planning your financial goals, let's get to know more about you</Text>
      </View>

      <ProgressSteps currentStep={1} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.form}>
          <Animated.View 
            entering={FadeInDown.delay(100)}
            style={styles.infoSection}
          >
            <View style={styles.infoCard}>
              <User size={24} color="#000" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{params.fullName}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Calendar size={24} color="#000" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Current Age</Text>
                <Text style={styles.infoValue}>{params.age} years</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(200)}
            style={styles.inputSection}
          >
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Retirement Age</Text>
                <TouchableOpacity style={styles.infoButton}>
                  <Info size={16} color="#666" />
                </TouchableOpacity>
              </View>
              <View style={[
                styles.inputContainer,
                activeField === 'retirementAge' && styles.inputContainerFocused,
                errors.retirementAge && styles.inputError
              ]}>
                <Calendar size={20} color={activeField === 'retirementAge' ? '#000' : '#666'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your expected retirement age"
                  value={formData.retirementAge}
                  onChangeText={(value) => {
                    const numValue = value.replace(/[^0-9]/g, '');
                    setFormData(prev => ({ ...prev, retirementAge: numValue }));
                    validateField('retirementAge', numValue);
                  }}
                  onFocus={() => setActiveField('retirementAge')}
                  onBlur={() => {
                    setActiveField(null);
                    validateField('retirementAge', formData.retirementAge);
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <Text style={styles.inputSuffix}>years</Text>
                {errors.retirementAge && (
                  <AlertCircle size={20} color="#FF4D4F" style={styles.errorIcon} />
                )}
              </View>
              {errors.retirementAge && (
                <Animated.Text 
                  entering={FadeIn}
                  style={styles.errorText}
                >
                  {errors.retirementAge}
                </Animated.Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Life Expectancy</Text>
                <TouchableOpacity style={styles.infoButton}>
                  <Info size={16} color="#666" />
                </TouchableOpacity>
              </View>
              <View style={[
                styles.inputContainer,
                activeField === 'lifeExpectancy' && styles.inputContainerFocused,
                errors.lifeExpectancy && styles.inputError
              ]}>
                <Heart size={20} color={activeField === 'lifeExpectancy' ? '#000' : '#666'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your expected life expectancy"
                  value={formData.lifeExpectancy}
                  onChangeText={(value) => {
                    const numValue = value.replace(/[^0-9]/g, '');
                    setFormData(prev => ({ ...prev, lifeExpectancy: numValue }));
                    validateField('lifeExpectancy', numValue);
                  }}
                  onFocus={() => setActiveField('lifeExpectancy')}
                  onBlur={() => {
                    setActiveField(null);
                    validateField('lifeExpectancy', formData.lifeExpectancy);
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <Text style={styles.inputSuffix}>years</Text>
                {errors.lifeExpectancy && (
                  <AlertCircle size={20} color="#FF4D4F" style={styles.errorIcon} />
                )}
              </View>
              {errors.lifeExpectancy && (
                <Animated.Text 
                  entering={FadeIn}
                  style={styles.errorText}
                >
                  {errors.lifeExpectancy}
                </Animated.Text>
              )}
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(300)}
            style={styles.helpCard}
          >
            <Info size={20} color="#666" />
            <Text style={styles.helpText}>
              These details help us calculate your retirement corpus and plan your investments accordingly.
            </Text>
          </Animated.View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            (!formData.retirementAge || !formData.lifeExpectancy || Object.keys(errors).length > 0) && styles.buttonDisabled
          ]}
          onPress={handleNext}
          disabled={!formData.retirementAge || !formData.lifeExpectancy || Object.keys(errors).length > 0}
        >
          <Text style={[
            styles.buttonText,
            (!formData.retirementAge || !formData.lifeExpectancy || Object.keys(errors).length > 0) && styles.buttonTextDisabled
          ]}>
            Continue
          </Text>
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
  infoSection: {
    gap: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FFED',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
  },
  inputSection: {
    gap: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  inputGroup: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#000',
  },
  infoButton: {
    padding: 4,
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
  inputSuffix: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#FF4D4F',
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  helpText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#C3FF4E',
  },
  buttonDisabled: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  buttonTextDisabled: {
    color: '#999999',
  },
});