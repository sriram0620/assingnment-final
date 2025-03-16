import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, User, Calendar, Heart, CircleAlert as AlertCircle } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ClientDetailsScreen() {
  const params = useLocalSearchParams();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    retirementAge: '',
    lifeExpectancy: '',
  });

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

  const handleNext = () => {
    // Validate all fields
    validateField('retirementAge', formData.retirementAge);
    validateField('lifeExpectancy', formData.lifeExpectancy);
    
    // Check if there are any errors
    if (Object.keys(errors).length === 0) {
      router.push({
        pathname: '/(auth)/assess-risk',
        params: {
          ...params,
          ...formData
        }
      });
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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Retirement Age (Years)</Text>
            <View style={[styles.inputContainer, errors.retirementAge && styles.inputError]}>
              <Calendar size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your expected retirement age"
                value={formData.retirementAge}
                onChangeText={(value) => {
                  setFormData(prev => ({ ...prev, retirementAge: value }));
                  validateField('retirementAge', value);
                }}
                keyboardType="numeric"
              />
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
            <Text style={styles.label}>Life Expectancy (Years)</Text>
            <View style={[styles.inputContainer, errors.lifeExpectancy && styles.inputError]}>
              <Heart size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your expected life expectancy"
                value={formData.lifeExpectancy}
                onChangeText={(value) => {
                  setFormData(prev => ({ ...prev, lifeExpectancy: value }));
                  validateField('lifeExpectancy', value);
                }}
                keyboardType="numeric"
              />
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
  form: {
    padding: 24,
    gap: 24,
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
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#FF4D4F',
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