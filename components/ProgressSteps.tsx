import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Check } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const steps = [
  { id: 1, title: 'Client Details' },
  { id: 2, title: 'Risk Assessment' },
  { id: 3, title: 'Goals' },
  { id: 4, title: 'Financial Plan' },
  { id: 5, title: 'Invest' },
];

interface ProgressStepsProps {
  currentStep: number;
}

export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <Animated.View
              entering={FadeIn.delay(index * 100)}
              style={styles.stepContainer}
            >
              <View
                style={[
                  styles.circle,
                  currentStep >= step.id && styles.activeCircle,
                  currentStep > step.id && styles.completedCircle,
                ]}
              >
                {currentStep > step.id ? (
                  <Check size={isMobile ? 14 : 16} color="#fff" />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      currentStep >= step.id && styles.activeStepNumber,
                    ]}
                  >
                    {step.id}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepTitle,
                  currentStep >= step.id && styles.activeStepTitle,
                ]}
                numberOfLines={1}
              >
                {step.title}
              </Text>
            </Animated.View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  currentStep > step.id && styles.activeLine,
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: isMobile ? 0 : 12,
    marginHorizontal: isMobile ? 0 : 16,
    marginTop: isMobile ? 0 : 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isMobile ? 12 : 20,
    paddingVertical: isMobile ? 12 : 16,
    gap: isMobile ? 8 : 12,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
    maxWidth: isMobile ? 64 : 'auto',
  },
  circle: {
    width: isMobile ? 28 : 32,
    height: isMobile ? 28 : 32,
    borderRadius: isMobile ? 14 : 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isMobile ? 4 : 8,
  },
  activeCircle: {
    backgroundColor: '#C3FF4E',
  },
  completedCircle: {
    backgroundColor: '#00B07C',
  },
  stepNumber: {
    fontSize: isMobile ? 12 : 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  activeStepNumber: {
    color: '#000',
  },
  stepTitle: {
    fontSize: isMobile ? 10 : 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  activeStepTitle: {
    color: '#000',
    fontFamily: 'Inter-Medium',
  },
  line: {
    flex: 0.5,
    height: 2,
    backgroundColor: '#f5f5f5',
    marginTop: isMobile ? -18 : -20,
  },
  activeLine: {
    backgroundColor: '#00B07C',
  },
});