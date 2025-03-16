import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions, Image, ActivityIndicator, Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, User, Mail, Phone, CircleAlert as AlertCircle, BadgeCheck, Shield } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import axios from 'axios';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const features = [
  {
    icon: Shield,
    title: 'Secure Investment',
    description: 'Bank-grade security for your investments',
  },
  {
    icon: BadgeCheck,
    title: 'Expert Guidance',
    description: 'Get personalized investment advice',
  },
];

const API_URL = 'http://localhost:5000/api';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    age: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field] = 'Please enter a valid email address';
        }
        break;
      case 'mobile':
        if (!value.trim()) {
          newErrors[field] = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(value.replace(/[^0-9]/g, ''))) {
          newErrors[field] = 'Please enter a valid 10-digit mobile number';
        }
        break;
      case 'age':
        const ageNum = parseInt(value);
        if (!value.trim()) {
          newErrors[field] = 'Age is required';
        } else if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
          newErrors[field] = 'Age must be between 18 and 100';
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/[^0-9]/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    
    const age = parseInt(formData.age);
    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else if (isNaN(age) || age < 18 || age > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);

      // Validate form
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      const response = await axios.post(`${API_URL}/register`, {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        age: parseInt(formData.age),
        password: formData.password
      });

      // Handle success
      const { user } = response.data;
      
      // Navigate to next screen
      router.push({
        pathname: '/(auth)/step-1-client-details',
        params: {
          fullName: user.fullName,
          age: user.age.toString(),
          userId: user.id
        }
      });

    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      Alert.alert('Registration Error', errorMessage);
    } finally {
      setIsLoading(false);
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us to start your investment journey</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=2070&auto=format&fit=crop' }}
            style={styles.heroImage}
          />

          <View style={styles.form}>
            <Animated.View 
              entering={FadeInDown.delay(100)}
              style={styles.inputGroup}
            >
              <Text style={styles.label}>Full Name</Text>
              <View style={[
                styles.inputContainer,
                activeField === 'fullName' && styles.inputContainerFocused,
                errors.fullName && styles.inputError
              ]}>
                <User size={20} color={activeField === 'fullName' ? '#000' : '#666'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChangeText={(value) => {
                    setFormData(prev => ({ ...prev, fullName: value }));
                    validateField('fullName', value);
                  }}
                  onFocus={() => setActiveField('fullName')}
                  onBlur={() => {
                    setActiveField(null);
                    validateField('fullName', formData.fullName);
                  }}
                />
                {errors.fullName && (
                  <AlertCircle size={20} color="#FF4D4F" style={styles.errorIcon} />
                )}
              </View>
              {errors.fullName && (
                <Animated.Text 
                  entering={FadeIn}
                  style={styles.errorText}
                >
                  {errors.fullName}
                </Animated.Text>
              )}
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(200)}
              style={styles.inputGroup}
            >
              <Text style={styles.label}>Email Address</Text>
              <View style={[
                styles.inputContainer,
                activeField === 'email' && styles.inputContainerFocused,
                errors.email && styles.inputError
              ]}>
                <Mail size={20} color={activeField === 'email' ? '#000' : '#666'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value) => {
                    setFormData(prev => ({ ...prev, email: value }));
                    validateField('email', value);
                  }}
                  onFocus={() => setActiveField('email')}
                  onBlur={() => {
                    setActiveField(null);
                    validateField('email', formData.email);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && (
                  <AlertCircle size={20} color="#FF4D4F" style={styles.errorIcon} />
                )}
              </View>
              {errors.email && (
                <Animated.Text 
                  entering={FadeIn}
                  style={styles.errorText}
                >
                  {errors.email}
                </Animated.Text>
              )}
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(300)}
              style={styles.inputGroup}
            >
              <Text style={styles.label}>Mobile Number</Text>
              <View style={[
                styles.inputContainer,
                activeField === 'mobile' && styles.inputContainerFocused,
                errors.mobile && styles.inputError
              ]}>
                <Phone size={20} color={activeField === 'mobile' ? '#000' : '#666'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChangeText={(value) => {
                    setFormData(prev => ({ ...prev, mobile: value }));
                    validateField('mobile', value);
                  }}
                  onFocus={() => setActiveField('mobile')}
                  onBlur={() => {
                    setActiveField(null);
                    validateField('mobile', formData.mobile);
                  }}
                  keyboardType="phone-pad"
                />
                {errors.mobile && (
                  <AlertCircle size={20} color="#FF4D4F" style={styles.errorIcon} />
                )}
              </View>
              {errors.mobile && (
                <Animated.Text 
                  entering={FadeIn}
                  style={styles.errorText}
                >
                  {errors.mobile}
                </Animated.Text>
              )}
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(400)}
              style={styles.inputGroup}
            >
              <Text style={styles.label}>Age</Text>
              <View style={[
                styles.inputContainer,
                activeField === 'age' && styles.inputContainerFocused,
                errors.age && styles.inputError
              ]}>
                <User size={20} color={activeField === 'age' ? '#000' : '#666'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your age"
                  value={formData.age}
                  onChangeText={(value) => {
                    setFormData(prev => ({ ...prev, age: value }));
                    validateField('age', value);
                  }}
                  onFocus={() => setActiveField('age')}
                  onBlur={() => {
                    setActiveField(null);
                    validateField('age', formData.age);
                  }}
                  keyboardType="numeric"
                />
                {errors.age && (
                  <AlertCircle size={20} color="#FF4D4F" style={styles.errorIcon} />
                )}
              </View>
              {errors.age && (
                <Animated.Text 
                  entering={FadeIn}
                  style={styles.errorText}
                >
                  {errors.age}
                </Animated.Text>
              )}
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(500)}
              style={styles.inputGroup}
            >
              <Text style={styles.label}>Password</Text>
              <View style={[
                styles.inputContainer,
                activeField === 'password' && styles.inputContainerFocused,
                errors.password && styles.inputError
              ]}>
                <Shield size={20} color={activeField === 'password' ? '#000' : '#666'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(value) => {
                    setFormData(prev => ({ ...prev, password: value }));
                    validateField('password', value);
                  }}
                  onFocus={() => setActiveField('password')}
                  onBlur={() => {
                    setActiveField(null);
                    validateField('password', formData.password);
                  }}
                  secureTextEntry
                />
                {errors.password && (
                  <AlertCircle size={20} color="#FF4D4F" style={styles.errorIcon} />
                )}
              </View>
              {errors.password && (
                <Animated.Text 
                  entering={FadeIn}
                  style={styles.errorText}
                >
                  {errors.password}
                </Animated.Text>
              )}
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(600)}
              style={styles.inputGroup}
            >
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[
                styles.inputContainer,
                activeField === 'confirmPassword' && styles.inputContainerFocused,
                errors.confirmPassword && styles.inputError
              ]}>
                <Shield size={20} color={activeField === 'confirmPassword' ? '#000' : '#666'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => {
                    setFormData(prev => ({ ...prev, confirmPassword: value }));
                    validateField('confirmPassword', value);
                  }}
                  onFocus={() => setActiveField('confirmPassword')}
                  onBlur={() => {
                    setActiveField(null);
                    validateField('confirmPassword', formData.confirmPassword);
                  }}
                  secureTextEntry
                />
                {errors.confirmPassword && (
                  <AlertCircle size={20} color="#FF4D4F" style={styles.errorIcon} />
                )}
              </View>
              {errors.confirmPassword && (
                <Animated.Text 
                  entering={FadeIn}
                  style={styles.errorText}
                >
                  {errors.confirmPassword}
                </Animated.Text>
              )}
            </Animated.View>
          </View>

          <View style={styles.featuresContainer}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Animated.View
                  key={index}
                  entering={FadeInDown.delay(500 + index * 100)}
                  style={styles.featureCard}
                >
                  <View style={styles.featureIcon}>
                    <Icon size={24} color="#00B07C" />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            (isLoading || Object.keys(errors).length > 0) && styles.buttonDisabled
          ]}
          onPress={handleRegister}
          disabled={isLoading || Object.keys(errors).length > 0}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Text style={styles.buttonText}>Create Account</Text>
              <ArrowLeft size={20} color="#000" style={{ transform: [{ rotate: '180deg' }] }} />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginTextBold}>Login</Text>
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
  formContainer: {
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
    padding: isMobile ? 16 : 24,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
  },
  form: {
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
    transition: 'all 0.2s ease',
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
    color: '#000',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#FF4D4F',
  },
  featuresContainer: {
    marginTop: 32,
    gap: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#F7FFED',
    borderRadius: 12,
    padding: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  featureDescription: {
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
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  loginTextBold: {
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
});