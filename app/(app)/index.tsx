import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Wallet, TrendingUp, Target, PiggyBank, ChevronRight, ArrowUpRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { VictoryPie, VictoryLabel } from 'victory-native';
import CustomNavbar from '@/components/CustomNavbar';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const mockUserData = {
  name: 'surya sri rama murthy',
  totalInvestment: '₹60,000',
  monthlyInvestment: '₹25,000',
  portfolioValue: '₹12,50,000',
  monthlyReturn: '+12.5%',
  goals: [
    { name: 'Retirement', progress: 45, target: '₹2.5 Cr' },
    { name: 'Child Education', progress: 60, target: '₹50 L' },
    { name: 'Home Purchase', progress: 30, target: '₹1.2 Cr' },
  ],
  portfolio: {
    equity: 60,
    debt: 30,
    gold: 10,
  },
  upcomingSips: [
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
  ],
};

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E2EBED', '#fff']} style={styles.gradient} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{mockUserData.name}</Text>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop' }}
            style={styles.avatar}
          />
        </View>

        <Animated.View entering={FadeInDown.delay(100)} style={styles.portfolioCard}>
          <LinearGradient
            colors={['#C3FF4E', '#00B07C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.portfolioGradient}
          />
          <View style={styles.portfolioHeader}>
            <Text style={styles.portfolioTitle}>Portfolio Value</Text>
            <Text style={styles.portfolioValue}>{mockUserData.portfolioValue}</Text>
            <Text style={styles.portfolioReturn}>
              {mockUserData.monthlyReturn} this month
            </Text>
          </View>
          <View style={styles.portfolioFooter}>
            <View>
              <Text style={styles.portfolioLabel}>Monthly Investment</Text>
              <Text style={styles.portfolioAmount}>{mockUserData.monthlyInvestment}</Text>
            </View>
            <View>
              <Text style={styles.portfolioLabel}>Total Investment</Text>
              <Text style={styles.portfolioAmount}>{mockUserData.totalInvestment}</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio Allocation</Text>
          <View style={styles.allocationContainer}>
            <View style={styles.pieChart}>
              <VictoryPie
                data={[
                  { x: 'Equity', y: mockUserData.portfolio.equity },
                  { x: 'Debt', y: mockUserData.portfolio.debt },
                  { x: 'Gold', y: mockUserData.portfolio.gold },
                ]}
                colorScale={['#C3FF4E', '#00B07C', '#FFB800']}
                width={200}
                height={200}
                innerRadius={70}
                labelComponent={<VictoryLabel style={{ fill: 'transparent' }} />}
              />
              <View style={styles.pieChartCenter}>
                <Text style={styles.pieChartLabel}>Current</Text>
                <Text style={styles.pieChartValue}>Portfolio</Text>
              </View>
            </View>
            <View style={styles.allocationLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#C3FF4E' }]} />
                <Text style={styles.legendLabel}>Equity</Text>
                <Text style={styles.legendValue}>{mockUserData.portfolio.equity}%</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#00B07C' }]} />
                <Text style={styles.legendLabel}>Debt</Text>
                <Text style={styles.legendValue}>{mockUserData.portfolio.debt}%</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FFB800' }]} />
                <Text style={styles.legendLabel}>Gold</Text>
                <Text style={styles.legendValue}>{mockUserData.portfolio.gold}%</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goal Progress</Text>
          {mockUserData.goals.map((goal, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(200 + index * 100)}
              style={styles.goalCard}
            >
              <View style={styles.goalHeader}>
                <Text style={styles.goalName}>{goal.name}</Text>
                <Text style={styles.goalTarget}>{goal.target}</Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${goal.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{goal.progress}%</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming SIPs</Text>
          {mockUserData.upcomingSips.map((sip, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(300 + index * 100)}
              style={styles.sipCard}
            >
              <Image source={{ uri: sip.image }} style={styles.sipImage} />
              <View style={styles.sipInfo}>
                <Text style={styles.sipName}>{sip.name}</Text>
                <Text style={styles.sipDate}>{sip.date}</Text>
              </View>
              <View style={styles.sipAmount}>
                <Text style={styles.sipAmountText}>₹{sip.amount}</Text>
                <ArrowUpRight size={20} color="#00B07C" />
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <CustomNavbar />
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
  scrollView: {
    flex: 1,
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  portfolioCard: {
    margin: 24,
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
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  portfolioLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#000',
    marginBottom: 4,
  },
  portfolioAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
  },
  section: {
    padding: 24,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 16,
  },
  allocationContainer: {
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    gap: 24,
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
  pieChart: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChartCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  pieChartLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  pieChartValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#000',
  },
  allocationLegend: {
    flex: 1,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  legendValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#000',
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
  },
  goalTarget: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#00B07C',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C3FF4E',
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    width: 48,
    textAlign: 'right',
  },
  sipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
});