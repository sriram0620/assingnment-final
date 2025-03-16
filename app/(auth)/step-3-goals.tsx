import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Download, ChevronDown, ChartBar as BarChart2, ChartPie as PieChart, ChartLine as LineChart, Info } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryPie, VictoryLine, VictoryAxis, VictoryTooltip, VictoryLabel } from 'victory-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import ProgressSteps from '@/components/ProgressSteps';
import axios from 'axios';

const { width } = Dimensions.get('window');
const isMobile = width < 768;
const API_URL = 'http://localhost:5000/api';
const COLORS = ['#C3FF4E', '#00B07C', '#FFB800', '#FF4D4F', '#8B5CF6'];

const dummyData = {
  goals: [
    { name: 'Child Education', amount: 2500000, inflationAdjusted: 3200000 },
    { name: 'Lavish Wedding', amount: 3000000, inflationAdjusted: 3800000 },
    { name: 'Home Purchase', amount: 5000000, inflationAdjusted: 6500000 },
    { name: 'Retirement', amount: 10000000, inflationAdjusted: 15000000 },
    { name: 'Adhoc', amount: 1000000, inflationAdjusted: 1200000 },
  ],
  portfolio: {
    minSIP: 50000,
    avgReturns: '12%',
    totalSavings: 2500000,
  },
};

const chartData = dummyData.goals.map((goal, index) => ({
  ...goal,
  color: COLORS[index % COLORS.length],
  label: goal.name,
  y: goal.amount,
}));

type ChartType = 'bar' | 'pie' | 'line';

export default function GoalsScreen() {
  const params = useLocalSearchParams();
  const [selectedDataType, setSelectedDataType] = useState('Initial Amount');
  const [showDataTypeDropdown, setShowDataTypeDropdown] = useState(false);
  const [chartType, setChartType] = useState<ChartType>('bar');

  const dataTypes = [
    'Initial Amount',
    'Monthly Investment',
    'Annual Investment',
    'Expected Returns',
  ];

  const generatePDF = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #000; font-size: 24px; margin-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
            .table th { background-color: #f7f7f7; }
            .highlight { color: #00B07C; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Financial Goals Summary</h1>
          
          <div class="section">
            <h2>Portfolio Overview</h2>
            <p>Minimum SIP Amount: ₹${dummyData.portfolio.minSIP}</p>
            <p>Average Portfolio Returns: ${dummyData.portfolio.avgReturns}</p>
            <p>Total Cash Savings: ₹${dummyData.portfolio.totalSavings}</p>
          </div>

          <div class="section">
            <h2>Goals Breakdown</h2>
            <table class="table">
              <tr>
                <th>Goal</th>
                <th>Initial Amount</th>
                <th>Inflation Adjusted</th>
              </tr>
              ${dummyData.goals.map(goal => `
                <tr>
                  <td>${goal.name}</td>
                  <td>₹${goal.amount.toLocaleString()}</td>
                  <td>₹${goal.inflationAdjusted.toLocaleString()}</td>
                </tr>
              `).join('')}
              <tr>
                <td><strong>Total</strong></td>
                <td class="highlight">₹${dummyData.goals.reduce((sum, goal) => sum + goal.amount, 0).toLocaleString()}</td>
                <td class="highlight">₹${dummyData.goals.reduce((sum, goal) => sum + goal.inflationAdjusted, 0).toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <h2>User Details</h2>
            <p>Monthly Income: ₹${params.monthlyIncome}</p>
            <p>Monthly Expenses: ₹${params.monthlyExpenses}</p>
            <p>Annual Income Growth: ${params.annualIncomeGrowth}%</p>
            <p>Annual Expense Growth: ${params.annualExpenseGrowth}%</p>
            <p>Inflation Rate: ${params.inflationRate}%</p>
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

  const handleFinalize = async () => {
    try {
      await axios.put(`${API_URL}/users/${params.userId}/goals`, {
        goals: dummyData.goals
      });
      
      router.push({
        pathname: '/(auth)/step-4-plan',
        params: {
          ...params,
        }
      });
    } catch (error) {
      console.error('Error updating goals:', error);
      Alert.alert('Error', 'Failed to update goals');
    }
  };

  const renderChart = () => {
    const chartHeight = isMobile ? 250 : 300;
    const padding = { 
      top: 20, 
      bottom: isMobile ? 50 : 50, 
      left: isMobile ? 50 : 60, 
      right: isMobile ? 20 : 30 
    };

    switch (chartType) {
      case 'bar':
        return (
          <VictoryChart
            theme={VictoryTheme.material}
            height={chartHeight}
            padding={padding}
            domainPadding={{ x: isMobile ? 15 : 20 }}
            scale={{ x: "time" }}
            width={isMobile ? width - 40 : undefined}
          >
            <VictoryAxis
              tickFormat={(t) => `${t}`}
              style={{
                tickLabels: { 
                  angle: -45, 
                  fontSize: isMobile ? 8 : 10,
                  padding: isMobile ? 15 : 20 
                }
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => `₹${(t/1000000).toFixed(1)}M`}
              style={{
                tickLabels: { 
                  fontSize: isMobile ? 8 : 10,
                  padding: isMobile ? 5 : 8
                }
              }}
            />
            <VictoryBar
              data={chartData}
              x="name"
              y="amount"
              style={{
                data: {
                  fill: ({ datum }) => datum.color,
                }
              }}
              labels={({ datum }) => `₹${(datum.amount/1000000).toFixed(1)}M`}
              labelComponent={
                <VictoryTooltip
                  style={{ fontSize: isMobile ? 8 : 10 }}
                  flyoutStyle={{
                    stroke: '#e1e1e1',
                    fill: 'white',
                  }}
                />
              }
            />
          </VictoryChart>
        );
      case 'pie':
        return (
          <VictoryPie
            data={chartData}
            height={chartHeight}
            width={isMobile ? width - 40 : undefined}
            colorScale={COLORS}
            labels={({ datum }) => `${datum.name}\n₹${(datum.amount/1000000).toFixed(1)}M`}
            style={{
              labels: {
                fontSize: isMobile ? 8 : 10,
                fill: "#000"
              }
            }}
            padding={padding}
            labelRadius={({ innerRadius }) => (innerRadius || 0) + (isMobile ? 40 : 60)}
          />
        );
      case 'line':
        return (
          <VictoryChart
            theme={VictoryTheme.material}
            height={chartHeight}
            padding={padding}
            width={isMobile ? width - 40 : undefined}
          >
            <VictoryAxis
              tickFormat={(t) => `${t}`}
              style={{
                tickLabels: { 
                  angle: -45, 
                  fontSize: isMobile ? 8 : 10,
                  padding: isMobile ? 15 : 20 
                }
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => `₹${(t/1000000).toFixed(1)}M`}
              style={{
                tickLabels: { 
                  fontSize: isMobile ? 8 : 10,
                  padding: isMobile ? 5 : 8
                }
              }}
            />
            <VictoryLine
              data={chartData}
              x="name"
              y="amount"
              style={{
                data: { stroke: "#C3FF4E", strokeWidth: 3 }
              }}
              labels={({ datum }) => `₹${(datum.amount/1000000).toFixed(1)}M`}
              labelComponent={
                <VictoryTooltip
                  style={{ fontSize: isMobile ? 8 : 10 }}
                  flyoutStyle={{
                    stroke: '#e1e1e1',
                    fill: 'white',
                  }}
                />
              }
            />
          </VictoryChart>
        );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E2EBED', '#fff']} style={styles.gradient} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>All in One Variable SIP</Text>
        <Text style={styles.subtitle}>Financial Goal Plan Summary</Text>
      </View>

      <ProgressSteps currentStep={3} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Animated.View 
            entering={FadeInDown.delay(100)}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Portfolio Overview</Text>
              <TouchableOpacity onPress={generatePDF} style={styles.downloadButton}>
                <Download size={20} color="#000" />
                <Text style={styles.downloadText}>Download PDF</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Minimum SIP Amount</Text>
                <Text style={styles.statValue}>₹{dummyData.portfolio.minSIP.toLocaleString()}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Average Portfolio Returns</Text>
                <Text style={styles.statValue}>{dummyData.portfolio.avgReturns}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Cash Savings</Text>
                <Text style={styles.statValue}>₹{dummyData.portfolio.totalSavings.toLocaleString()}</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(200)}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleContainer}>
                <Text style={styles.cardTitle}>Goals Summary</Text>
                <TouchableOpacity style={styles.infoButton}>
                  <Info size={16} color="#666" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowDataTypeDropdown(!showDataTypeDropdown)}
              >
                <Text style={styles.dropdownText}>{selectedDataType}</Text>
                <ChevronDown size={20} color="#000" />
              </TouchableOpacity>
            </View>

            {showDataTypeDropdown && (
              <Animated.View entering={FadeIn} style={styles.dropdownMenu}>
                {dataTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedDataType(type);
                      setShowDataTypeDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tableContainer}
            >
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, { width: 150 }]}>Goal Name</Text>
                  <Text style={[styles.tableHeaderCell, { width: 120 }]}>Amount</Text>
                  <Text style={[styles.tableHeaderCell, { width: 150 }]}>Inflation Adjusted</Text>
                </View>
                {dummyData.goals.map((goal, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: 150 }]}>{goal.name}</Text>
                    <Text style={[styles.tableCell, { width: 120 }]}>
                      ₹{goal.amount.toLocaleString()}
                    </Text>
                    <Text style={[styles.tableCell, { width: 150 }]}>
                      ₹{goal.inflationAdjusted.toLocaleString()}
                    </Text>
                  </View>
                ))}
                <View style={[styles.tableRow, styles.totalRow]}>
                  <Text style={[styles.tableCell, styles.totalCell, { width: 150 }]}>All Goals Combined</Text>
                  <Text style={[styles.tableCell, styles.totalCell, { width: 120 }]}>
                    ₹{dummyData.goals
                      .reduce((sum, goal) => sum + goal.amount, 0)
                      .toLocaleString()}
                  </Text>
                  <Text style={[styles.tableCell, styles.totalCell, { width: 150 }]}>
                    ₹{dummyData.goals
                      .reduce((sum, goal) => sum + goal.inflationAdjusted, 0)
                      .toLocaleString()}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(300)}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleContainer}>
                <Text style={styles.cardTitle}>Portfolio Visualization</Text>
                <TouchableOpacity style={styles.infoButton}>
                  <Info size={16} color="#666" />
                </TouchableOpacity>
              </View>
              <View style={styles.chartControls}>
                <TouchableOpacity
                  style={[styles.chartTypeButton, chartType === 'bar' && styles.chartTypeButtonActive]}
                  onPress={() => setChartType('bar')}
                >
                  <BarChart2 size={20} color={chartType === 'bar' ? '#000' : '#666'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.chartTypeButton, chartType === 'pie' && styles.chartTypeButtonActive]}
                  onPress={() => setChartType('pie')}
                >
                  <PieChart size={20} color={chartType === 'pie' ? '#000' : '#666'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.chartTypeButton, chartType === 'line' && styles.chartTypeButtonActive]}
                  onPress={() => setChartType('line')}
                >
                  <LineChart size={20} color={chartType === 'line' ? '#000' : '#666'} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.chartContainer}>
              {renderChart()}
            </View>

            <View style={styles.chartLegend}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>{item.name}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400)}
            style={styles.congratsCard}
          >
            <LinearGradient colors={['#C3FF4E', '#00B07C']} style={styles.congratsGradient} />
            <Text style={styles.congratsTitle}>Congratulations! 🎉</Text>
            <Text style={styles.congratsText}>
              You Are Achieving All Your Goals. Click On Finalize Plan To Finalize Your Plan
            </Text>
          </Animated.View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleFinalize}>
          <Text style={styles.buttonText}>Finalize Plan</Text>
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
    padding: isMobile ? 16 : 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'visible',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    gap: isMobile ? 12 : 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  infoButton: {
    padding: 4,
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
  statsGrid: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#F7FFED',
    borderRadius: 12,
    padding: 16,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F7FFED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: isMobile ? '100%' : 'auto',
    justifyContent: isMobile ? 'space-between' : 'flex-start',
  },
  dropdownText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#000',
  },
  dropdownMenu: {
    position: 'absolute',
    top: isMobile ? 100 : 60,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 1000,
    minWidth: 200,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dropdownItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#000',
  },
  tableContainer: {
    paddingBottom: 16,
  },
  table: {
    minWidth: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F7FFED',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableCell: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  totalRow: {
    backgroundColor: '#F7FFED',
    borderRadius: 12,
    borderBottomWidth: 0,
  },
  totalCell: {
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  chartControls: {
    flexDirection: 'row',
    gap: 8,
  },
  chartTypeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  chartTypeButtonActive: {
    backgroundColor: '#F7FFED',
  },
  chartContainer: {
    height: isMobile ? 250 : 300,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: isMobile ? 12 : 24,
    marginTop: 16,
    paddingHorizontal: isMobile ? 8 : 0,
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
    fontSize: isMobile ? 10 : 12,
    color: '#666',
  },
  congratsCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  congratsGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  congratsTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#000',
    marginBottom: 8,
  },
  congratsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
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
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#000',
  },
});