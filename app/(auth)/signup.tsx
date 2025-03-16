import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, User, Mail, Phone, Lock, Check, Target, ChartBar, PiggyBank } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import ProgressSteps from '@/components/ProgressSteps';

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone: string) => {
  return /^\d{10}$/.test(phone.replace(/\D/g, ''));
};

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    delete newErrors[field];

    switch (field) {
      case 'fullName':
        if (!value.trim()) {
          newErrors[field] = 'Full name is required';
        } else if (value.trim().length < 2) {
          newErrors[field] = 'Name must be at least 2 characters';
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors[field] = 'Email is required';
        } else if (!validateEmail(value)) {
          newErrors[field] = 'Please enter a valid email address';
        }
        break;
      case 'mobile':
        if (!value.trim()) {
          newErrors[field] = 'Mobile number is required';
        } else if (!validatePhone(value)) {
          newErrors[field] = 'Please enter a valid 10-digit mobile number';
        }
        break;
      case 'password':
        if (!value) {
          newErrors[field] = 'Password is required';
        } else if (value.length < 8) {
          newErrors[field] = 'Password must be at least 8 characters';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          newErrors[field] = 'Please confirm your password';
        } else if (value !== formData.password) {
          newErrors[field] = 'Passwords do not match';
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleSignup = () => {
    // Validate all fields
    Object.keys(formData).forEach(key => validateField(key, formData[key as keyof typeof formData]));

    if (Object.keys(errors).length === 0) {
      router.push('/(app)');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E2EBED', '#fff']} style={styles.gradient} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us to start your investment journey</Text>
      </View>

      <ProgressSteps currentStep={1} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputContainer, errors.fullName && styles.inputError]}>
              <User size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={formData.fullName}
                onChangeText={(value) => {
                  setFormData(prev => ({ ...prev, fullName: value }));
                  validateField('fullName', value);
                }}
              />
            </View>
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputContainer, errors.email && styles.inputError]}>
              <Mail size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => {
                  setFormData(prev => ({ ...prev, email: value }));
                  validateField('email', value);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={[styles.inputContainer, errors.mobile && styles.inputError]}>
              <Phone size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChangeText={(value) => {
                  setFormData(prev => ({ ...prev, mobile: value }));
                  validateField('mobile', value);
                }}
                keyboardType="phone-pad"
              />
            </View>
            {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, errors.password && styles.inputError]}>
              <Lock size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) => {
                  setFormData(prev => ({ ...prev, password: value }));
                  validateField('password', value);
                }}
                secureTextEntry
              />
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
              <Lock size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) => {
                  setFormData(prev => ({ ...prev, confirmPassword: value }));
                  validateField('confirmPassword', value);
                }}
                secureTextEntry
              />
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, Object.keys(errors).length > 0 && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={Object.keys(errors).length > 0}
        >
          <Text style={styles.buttonText}>Create Account</Text>
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