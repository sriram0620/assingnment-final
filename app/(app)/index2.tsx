import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Wallet, ChartPie as PieChart, Target, TrendingUp, ArrowRight, Bell, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import CustomNavbar from '@/components/CustomNavbar';  // Add this import

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const portfolioStats = {
  totalValue: '₹12,50,000',
  monthlyReturn: '+12.5%',
  monthlyInvestment: '₹60,000',
};

const quickActions = [
  {
    title: 'Invest Now',
    icon: TrendingUp,
    color: '#C3FF4E',
    description: 'Start or modify SIP',
  },
  {
    title: 'Track Goals',
    icon: Target,
    color: '#00B07C',
    description: 'Monitor progress',
  },
  {
    title: 'Portfolio',
    icon: PieChart,
    color: '#FFB800',
    description: 'View holdings',
  },
  {
    title: 'Transactions',
    icon: Wallet,
    color: '#FF4D4F',
    description: 'Payment history',
  },
];

const upcomingSips = [
  {
    name: 'Large Cap Fund',
    date: '5th Apr',
    amount: '25,000',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop',
  },
  {
    name: 'Mid Cap Fund',
    date: '10th Apr',
    amount: '15,000',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop',
  },
];

const insights = [
  {
    title: 'Market Update',
    description: 'Nifty 50 hits all-time high. What does it mean for your portfolio?',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop',
  },
  {
    title: 'Investment Strategy',
    description: 'How to build a recession-proof investment portfolio',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  
  // Add navigation handler
  const handlePortfolioPress = (actionTitle: string) => {
    if (actionTitle === 'Portfolio') {
      router.push('/(app)/index2');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E2EBED', '#fff']} style={styles.gradient} />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>surya sri rama murthy</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color="#000" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          entering={FadeInDown.delay(100)}
          style={styles.portfolioCard}
        >
          <LinearGradient
            colors={['#C3FF4E', '#00B07C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.portfolioGradient}
          />
          <View style={styles.portfolioHeader}>
            <Text style={styles.portfolioTitle}>Portfolio Value</Text>
            <Text style={styles.portfolioValue}>{portfolioStats.totalValue}</Text>
            <Text style={styles.portfolioReturn}>
              {portfolioStats.monthlyReturn} this month
            </Text>
          </View>
          <View style={styles.portfolioFooter}>
            <Text style={styles.portfolioLabel}>Monthly Investment</Text>
            <Text style={styles.portfolioAmount}>
              ₹{portfolioStats.monthlyInvestment}
            </Text>
          </View>
        </Animated.View>

        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <Animated.View
              key={action.title}
              entering={FadeInDown.delay(200 + index * 100)}
              style={styles.quickActionCard}
            >
              <TouchableOpacity 
                style={styles.quickAction}
                onPress={() => handlePortfolioPress(action.title)}
              >
                <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
                  <action.icon size={24} color="#000" />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionDescription}>{action.description}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Animated.View
          entering={FadeInDown.delay(600)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming SIPs</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <ArrowRight size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.sipList}>
            {upcomingSips.map((sip, index) => (
              <TouchableOpacity key={index} style={styles.sipCard}>
                <Image
                  source={{ uri: sip.image }}
                  style={styles.sipImage}
                />
                <View style={styles.sipInfo}>
                  <Text style={styles.sipName}>{sip.name}</Text>
                  <Text style={styles.sipDate}>{sip.date}</Text>
                </View>
                <View style={styles.sipAmount}>
                  <Text style={styles.sipAmountText}>₹{sip.amount}</Text>
                  <ChevronRight size={20} color="#666" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(700)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Market Insights</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <ArrowRight size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.insightsList}
          >
            {insights.map((insight, index) => (
              <TouchableOpacity key={index} style={styles.insightCard}>
                <Image
                  source={{ uri: insight.image }}
                  style={styles.insightImage}
                />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightDescription}>{insight.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>

      {/* Add CustomNavbar at the bottom */}
      <CustomNavbar />
    </View>
  );
}

// Update container style to handle the navbar
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: Platform.OS === 'web' ? 24 : 60,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  name: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#000',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4D4F',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: isMobile ? 16 : 24,
    gap: 24,
    paddingBottom: 80, // Add padding to prevent content from being hidden behind navbar
  },
  portfolioCard: {
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
  },
  portfolioGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  portfolioHeader: {
    marginBottom: 24,
  },
  portfolioTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },
  portfolioValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#000',
    marginBottom: 4,
  },
  portfolioReturn: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#000',
  },
  portfolioFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  portfolioLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#000',
  },
  portfolioAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    minWidth: isMobile ? '45%' : '22%',
  },
  quickAction: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  quickActionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
  },
  sipList: {
    gap: 12,
  },
  sipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sipImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sipInfo: {
    flex: 1,
  },
  sipName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  sipDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  sipAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sipAmountText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
  },
  insightsList: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  insightCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  insightImage: {
    width: '100%',
    height: 160,
  },
  insightContent: {
    padding: 16,
  },
  insightTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  insightDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
});