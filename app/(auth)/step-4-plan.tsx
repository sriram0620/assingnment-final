import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, TrendingUp, Wallet, Clock, CircleAlert as AlertCircle, ChevronRight, Download, BadgeCheck } from 'lucide-react-native';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis, VictoryArea, VictoryLabel } from 'victory-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import ProgressSteps from '@/components/ProgressSteps';
import axios from 'axios';

const { width } = Dimensions.get('window');
const isMobile = width < 768;
const API_URL = 'http://localhost:5000/api';
const planDetails = {
  summary: {
    totalInvestment: '₹2.5 Cr',
    expectedReturns: '₹5.8 Cr',
    timeHorizon: '25 years',
    riskLevel: 'Moderate',
  },
  monthlyBreakdown: {
    sip: 45000,
    insurance: 5000,
    emergency: 10000,
    total: 60000,
  },
  projections: Array.from({ length: 12 }, (_, i) => ({
    x: i + 1,
    y: Math.pow(1.12, i) * 100000,
    projection: Math.pow(1.15, i) * 100000,
  })),
  recommendations: [
    {
      title: 'Equity Mutual Funds',
      allocation: '60%',
      description: 'High-growth potential with managed risk',
      color: '#C3FF4E',
    },
    {
      title: 'Debt Instruments',
      allocation: '30%',
      description: 'Stable returns with lower risk',
      color: '#00B07C',
    },
    {
      title: 'Gold & Others',
      allocation: '10%',
      description: 'Hedge against market volatility',
      color: '#FFB800',
    },
  ],
};

export default function FinancialPlanScreen() {
  const params = useLocalSearchParams();

  const handleDownloadPlan = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            h1 { color: #000; font-size: 24px; margin-bottom: 20px; }
            h2 { color: #333; font-size: 20px; margin: 30px 0 15px; }
            .section { margin-bottom: 30px; background: #f9f9f9; padding: 20px; border-radius: 8px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
            .stat { background: #fff; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .stat-label { color: #666; font-size: 14px; margin-bottom: 5px; }
            .stat-value { color: #000; font-size: 18px; font-weight: bold; }
            .highlight { color: #00B07C; font-weight: bold; }
            .recommendations { margin-top: 20px; }
            .recommendation { background: #fff; padding: 15px; margin-bottom: 10px; border-radius: 6px; }
            .monthly-breakdown { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .monthly-breakdown th, .monthly-breakdown td { 
              padding: 12px; 
              text-align: left; 
              border-bottom: 1px solid #eee; 
            }
            .monthly-breakdown th { background: #f5f5f5; }
            .total-row { font-weight: bold; background: #f7ffed; }
          </style>
        </head>
        <body>
          <h1>Your Financial Plan Summary</h1>
          
          <div class="section">
            <h2>Plan Overview</h2>
            <div class="grid">
              <div class="stat">
                <div class="stat-label">Total Investment</div>
                <div class="stat-value">${planDetails.summary.totalInvestment}</div>
              </div>
              <div class="stat">
                <div class="stat-label">Expected Returns</div>
                <div class="stat-value">${planDetails.summary.expectedReturns}</div>
              </div>
              <div class="stat">
                <div class="stat-label">Time Horizon</div>
                <div class="stat-value">${planDetails.summary.timeHorizon}</div>
              </div>
              <div class="stat">
                <div class="stat-label">Risk Level</div>
                <div class="stat-value">${planDetails.summary.riskLevel}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Monthly Investment Breakdown</h2>
            <table class="monthly-breakdown">
              <tr>
                <th>Investment Type</th>
                <th>Amount (₹)</th>
              </tr>
              <tr>
                <td>SIP Investments</td>
                <td>${planDetails.monthlyBreakdown.sip.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Insurance Premium</td>
                <td>${planDetails.monthlyBreakdown.insurance.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Emergency Fund</td>
                <td>${planDetails.monthlyBreakdown.emergency.toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td>Total Monthly Investment</td>
                <td>${planDetails.monthlyBreakdown.total.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <h2>Investment Recommendations</h2>
            <div class="recommendations">
              ${planDetails.recommendations.map(rec => `
                <div class="recommendation">
                  <h3>${rec.title} - ${rec.allocation}</h3>
                  <p>${rec.description}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section">
            <h2>User Profile & Goals</h2>
            <div class="grid">
              <div class="stat">
                <div class="stat-label">Monthly Income</div>
                <div class="stat-value">₹${params.monthlyIncome}</div>
              </div>
              <div class="stat">
                <div class="stat-label">Monthly Expenses</div>
                <div class="stat-value">₹${params.monthlyExpenses}</div>
              </div>
              <div class="stat">
                <div class="stat-label">Income Growth</div>
                <div class="stat-value">${params.annualIncomeGrowth}% per year</div>
              </div>
              <div class="stat">
                <div class="stat-label">Expense Growth</div>
                <div class="stat-value">${params.annualExpenseGrowth}% per year</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });
      
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleProceed = async () => {
    try {
      await axios.put(`${API_URL}/users/${params.userId}/plan`, {
        plan: {
          monthlyInvestment: planDetails.monthlyBreakdown.total,
          portfolioAllocation: planDetails.recommendations,
          expectedReturns: planDetails.summary.expectedReturns,
          riskLevel: planDetails.summary.riskLevel
        }
      });
      
      router.push({
        pathname: '/(auth)/step-5-invest',
        params: {
          ...params,
        }
      });
    } catch (error) {
      console.error('Error updating plan:', error);
      Alert.alert('Error', 'Failed to update plan');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E2EBED', '#fff']} style={styles.gradient} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Financial Plan</Text>
        <Text style={styles.subtitle}>Comprehensive strategy to achieve your goals</Text>
      </View>

      <ProgressSteps currentStep={4} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Plan Summary</Text>
              <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadPlan}>
                <Download size={20} color="#000" />
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Wallet size={24} color="#00B07C" />
                <Text style={styles.summaryLabel}>Total Investment</Text>
                <Text style={styles.summaryValue}>{planDetails.summary.totalInvestment}</Text>
              </View>
              <View style={styles.summaryItem}>
                <TrendingUp size={24} color="#C3FF4E" />
                <Text style={styles.summaryLabel}>Expected Returns</Text>
                <Text style={styles.summaryValue}>{planDetails.summary.expectedReturns}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Clock size={24} color="#FFB800" />
                <Text style={styles.summaryLabel}>Time Horizon</Text>
                <Text style={styles.summaryValue}>{planDetails.summary.timeHorizon}</Text>
              </View>
              <View style={styles.summaryItem}>
                <AlertCircle size={24} color="#FF4D4F" />
                <Text style={styles.summaryLabel}>Risk Level</Text>
                <Text style={styles.summaryValue}>{planDetails.summary.riskLevel}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Monthly Investment Breakdown</Text>
            <View style={styles.breakdownList}>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>SIP Investments</Text>
                <Text style={styles.breakdownValue}>₹{planDetails.monthlyBreakdown.sip.toLocaleString()}</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Insurance Premium</Text>
                <Text style={styles.breakdownValue}>₹{planDetails.monthlyBreakdown.insurance.toLocaleString()}</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Emergency Fund</Text>
                <Text style={styles.breakdownValue}>₹{planDetails.monthlyBreakdown.emergency.toLocaleString()}</Text>
              </View>
              <View style={[styles.breakdownItem, styles.totalItem]}>
                <Text style={styles.totalLabel}>Total Monthly Investment</Text>
                <Text style={styles.totalValue}>₹{planDetails.monthlyBreakdown.total.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Wealth Projection</Text>
            <View style={styles.chartContainer}>
              <VictoryChart
                theme={VictoryTheme.material}
                height={250}
                width={isMobile ? width - 48 : undefined}
                padding={{ 
                  top: 20, 
                  bottom: isMobile ? 40 : 50, 
                  left: isMobile ? 60 : 70, 
                  right: isMobile ? 20 : 30 
                }}
                domainPadding={{ x: isMobile ? 15 : 20 }}
              >
                <VictoryAxis
                  tickFormat={(t) => `Y${t}`}
                  style={{
                    tickLabels: { 
                      fontSize: isMobile ? 10 : 12,
                      padding: isMobile ? 5 : 8
                    }
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(t) => `₹${(t/100000).toFixed(0)}L`}
                  style={{
                    tickLabels: { 
                      fontSize: isMobile ? 10 : 12,
                      padding: isMobile ? 5 : 8
                    }
                  }}
                />
                <VictoryArea
                  data={planDetails.projections}
                  style={{
                    data: {
                      fill: "url(#gradient)",
                      fillOpacity: 0.2,
                      stroke: "#C3FF4E",
                      strokeWidth: 2
                    }
                  }}
                />
                <VictoryLine
                  data={planDetails.projections.map(d => ({ x: d.x, y: d.projection }))}
                  style={{
                    data: { stroke: "#00B07C", strokeDasharray: "5,5" }
                  }}
                />
              </VictoryChart>
            </View>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#C3FF4E' }]} />
                <Text style={styles.legendText}>Actual Investment</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#00B07C' }]} />
                <Text style={styles.legendText}>Projected Returns</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Investment Recommendations</Text>
            <View style={styles.recommendationsList}>
              {planDetails.recommendations.map((rec, index) => (
                <TouchableOpacity key={index} style={styles.recommendationItem}>
                  <View style={[styles.recommendationColor, { backgroundColor: rec.color }]} />
                  <View style={styles.recommendationContent}>
                    <Text style={styles.recommendationTitle}>{rec.title}</Text>
                    <Text style={styles.recommendationDesc}>{rec.description}</Text>
                  </View>
                  <View style={styles.recommendationAllocation}>
                    <Text style={styles.allocationText}>{rec.allocation}</Text>
                    <ChevronRight size={20} color="#666" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.disclaimerCard}>
            <AlertCircle size={20} color="#666" />
            <Text style={styles.disclaimerText}>
              This plan is based on current market conditions and assumptions. Actual returns may vary. Please review the detailed terms and conditions.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleProceed}>
          <Text style={styles.buttonText}>Proceed to Invest</Text>
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
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: isMobile ? 16 : 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F7FFED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  downloadText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#000',
  },
  summaryGrid: {
    flexDirection: isMobile ? 'column' : 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  summaryItem: {
    flex: isMobile ? undefined : 1,
    minWidth: isMobile ? '100%' : '22%',
    backgroundColor: '#F7FFED',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  summaryValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: isMobile ? 16 : 20,
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
  breakdownList: {
    gap: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  breakdownLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  breakdownValue: {
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
  totalValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#00B07C',
  },
  chartContainer: {
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: isMobile ? -16 : 0,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: isMobile ? 16 : 24,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontFamily: 'Inter-Regular',
    fontSize: isMobile ? 12 : 14,
    color: '#666',
  },
  recommendationsList: {
    gap: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#F7FFED',
    borderRadius: 12,
    padding: 16,
  },
  recommendationColor: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  recommendationDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  recommendationAllocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  allocationText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
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
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#000',
  },
});