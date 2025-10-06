
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Alert, Platform, ActivityIndicator } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import * as XLSX from 'xlsx';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [fileName, setFileName] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  // Simulate automatic file reading from FTP folder on component mount
  useEffect(() => {
    console.log('HomeScreen mounted, starting automatic file reading...');
    loadDataFromFTPFolder();
    
    // Set up automatic refresh every 30 seconds (simulating FTP polling)
    const interval = setInterval(() => {
      if (autoRefreshEnabled) {
        console.log('Auto-refreshing data from FTP folder...');
        loadDataFromFTPFolder();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefreshEnabled]);

  const loadDataFromFTPFolder = async () => {
    try {
      setLoading(true);
      console.log('Attempting to read XLS file from FTP folder...');
      
      // Simulate FTP connection and file reading delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, we'll simulate reading different data sets to show automatic updates
      const simulatedDataSets = [
        {
          fileName: 'sales-data-q1.xls',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              data: [20, 45, 28, 80, 99, 43],
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              strokeWidth: 2
            }]
          }
        },
        {
          fileName: 'revenue-report.xls',
          data: {
            labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
            datasets: [{
              data: [150, 230, 180, 320, 280],
              color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`,
              strokeWidth: 2
            }]
          }
        },
        {
          fileName: 'monthly-metrics.xls',
          data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
              data: [65, 78, 90, 85],
              color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
              strokeWidth: 2
            }]
          }
        }
      ];

      // Randomly select a data set to simulate different files being updated
      const randomIndex = Math.floor(Math.random() * simulatedDataSets.length);
      const selectedData = simulatedDataSets[randomIndex];
      
      setChartData(selectedData.data);
      setFileName(selectedData.fileName);
      setLastUpdate(new Date());
      
      console.log(`Successfully loaded data from ${selectedData.fileName}`);
      
      // Only show success alert on first load, not on auto-refresh
      if (!chartData) {
        Alert.alert(
          'Data Loaded Successfully', 
          `Automatically loaded data from FTP folder: ${selectedData.fileName}\n\nAuto-refresh is enabled every 30 seconds.`
        );
      }
      
    } catch (error) {
      console.error('Error reading from FTP folder:', error);
      
      // Fallback to demo data if FTP reading fails
      console.log('FTP reading failed, loading demo data as fallback...');
      const fallbackData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          data: [20, 45, 28, 80, 99, 43],
          color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`,
          strokeWidth: 2
        }]
      };
      
      setChartData(fallbackData);
      setFileName('demo-fallback-data.xls');
      setLastUpdate(new Date());
      
      if (!chartData) {
        Alert.alert(
          'FTP Connection Failed', 
          'Could not connect to FTP server. Loaded demo data instead.\n\nTo enable real FTP connectivity, please configure Supabase backend integration.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
    if (!autoRefreshEnabled) {
      Alert.alert('Auto-refresh Enabled', 'Data will be automatically updated every 30 seconds from the FTP folder.');
    } else {
      Alert.alert('Auto-refresh Disabled', 'Automatic data updates have been paused.');
    }
  };

  const manualRefresh = () => {
    console.log('Manual refresh triggered');
    loadDataFromFTPFolder();
  };

  const renderChart = () => {
    if (!chartData) return null;

    const chartConfig = {
      backgroundColor: colors.card,
      backgroundGradientFrom: colors.card,
      backgroundGradientTo: colors.card,
      decimalPlaces: 2,
      color: (opacity = 1) => chartData.datasets[0].color(opacity),
      labelColor: (opacity = 1) => `rgba(45, 52, 54, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: chartData.datasets[0].color(1)
      },
      propsForBackgroundLines: {
        strokeDasharray: "",
        stroke: colors.textSecondary + '20',
      },
      fillShadowGradient: chartData.datasets[0].color(1),
      fillShadowGradientOpacity: 0.1,
    };

    const chartWidth = screenWidth - 32;

    switch (chartType) {
      case 'line':
        return (
          <LineChart
            data={chartData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        );
      case 'bar':
        return (
          <BarChart
            data={chartData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        );
      case 'pie':
        const pieData = chartData.labels.map((label: string, index: number) => ({
          name: label,
          population: chartData.datasets[0].data[index],
          color: `hsl(${(index * 360) / chartData.labels.length}, 70%, 50%)`,
          legendFontColor: colors.text,
          legendFontSize: 15,
        }));
        return (
          <PieChart
            data={pieData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        );
      default:
        return null;
    }
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={manualRefresh}
      style={styles.headerButtonContainer}
      disabled={loading}
    >
      <IconSymbol 
        name={loading ? "arrow.clockwise" : "arrow.clockwise"} 
        color={loading ? colors.textSecondary : colors.primary} 
      />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={toggleAutoRefresh}
      style={styles.headerButtonContainer}
    >
      <IconSymbol
        name={autoRefreshEnabled ? "pause.circle" : "play.circle"}
        color={autoRefreshEnabled ? colors.primary : colors.textSecondary}
      />
    </Pressable>
  );

  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Never';
    return lastUpdate.toLocaleTimeString();
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Auto XLS Reader",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            Platform.OS !== 'ios' && styles.scrollContainerWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <IconSymbol name="chart.bar" color={colors.primary} size={48} />
            <Text style={styles.title}>Auto XLS Reader</Text>
            <Text style={styles.subtitle}>
              Automatically reads and visualizes XLS files from your FTP folder
            </Text>
          </View>

          {/* Status Card */}
          <View style={styles.card}>
            <View style={styles.statusHeader}>
              <Text style={styles.cardTitle}>Connection Status</Text>
              <View style={[styles.statusIndicator, { 
                backgroundColor: loading ? colors.accent : colors.primary 
              }]}>
                <Text style={styles.statusText}>
                  {loading ? 'Updating...' : 'Connected'}
                </Text>
              </View>
            </View>
            
            <View style={styles.statusInfo}>
              <View style={styles.statusRow}>
                <IconSymbol name="folder" color={colors.textSecondary} size={16} />
                <Text style={styles.statusLabel}>Current File:</Text>
                <Text style={styles.statusValue}>{fileName || 'None'}</Text>
              </View>
              
              <View style={styles.statusRow}>
                <IconSymbol name="clock" color={colors.textSecondary} size={16} />
                <Text style={styles.statusLabel}>Last Update:</Text>
                <Text style={styles.statusValue}>{formatLastUpdate()}</Text>
              </View>
              
              <View style={styles.statusRow}>
                <IconSymbol 
                  name={autoRefreshEnabled ? "checkmark.circle" : "xmark.circle"} 
                  color={autoRefreshEnabled ? colors.primary : colors.textSecondary} 
                  size={16} 
                />
                <Text style={styles.statusLabel}>Auto-refresh:</Text>
                <Text style={[styles.statusValue, { 
                  color: autoRefreshEnabled ? colors.primary : colors.textSecondary 
                }]}>
                  {autoRefreshEnabled ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.button, styles.primaryButton, styles.flexButton]}
                onPress={manualRefresh}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <IconSymbol name="arrow.clockwise" color="white" size={20} />
                )}
                <Text style={styles.buttonText}>
                  {loading ? 'Updating...' : 'Refresh Now'}
                </Text>
              </Pressable>
              
              <Pressable
                style={[styles.button, styles.secondaryButton, styles.flexButton]}
                onPress={toggleAutoRefresh}
              >
                <IconSymbol 
                  name={autoRefreshEnabled ? "pause" : "play"} 
                  color={colors.primary} 
                  size={20} 
                />
                <Text style={[styles.buttonText, { color: colors.primary }]}>
                  {autoRefreshEnabled ? 'Pause' : 'Resume'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Chart Type Selection */}
          {chartData && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Chart Type</Text>
              <View style={styles.chartTypeContainer}>
                {(['line', 'bar', 'pie'] as const).map((type) => (
                  <Pressable
                    key={type}
                    style={[
                      styles.chartTypeButton,
                      chartType === type && styles.chartTypeButtonActive
                    ]}
                    onPress={() => setChartType(type)}
                  >
                    <Text style={[
                      styles.chartTypeButtonText,
                      chartType === type && styles.chartTypeButtonTextActive
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Chart Display */}
          {chartData && (
            <View style={styles.card}>
              <View style={styles.chartHeader}>
                <Text style={styles.cardTitle}>Data Visualization</Text>
                <Pressable
                  style={[styles.button, styles.clearButton]}
                  onPress={() => {
                    setChartData(null);
                    setFileName('');
                    setLastUpdate(null);
                  }}
                >
                  <IconSymbol name="trash" color={colors.textSecondary} size={16} />
                  <Text style={[styles.buttonText, { color: colors.textSecondary, fontSize: 14 }]}>Clear</Text>
                </Pressable>
              </View>
              {renderChart()}
              {chartData && (
                <View style={styles.chartInfo}>
                  <Text style={styles.chartInfoText}>
                    Showing {chartData.labels.length} data points from {fileName}
                  </Text>
                  <Text style={styles.chartInfoText}>
                    Auto-updated from FTP folder • Last refresh: {formatLastUpdate()}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Loading State */}
          {loading && !chartData && (
            <View style={styles.card}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Reading XLS file from FTP folder...</Text>
                <Text style={styles.loadingSubtext}>This may take a few moments</Text>
              </View>
            </View>
          )}

          {/* Instructions */}
          {!chartData && !loading && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>How It Works</Text>
              <Text style={styles.instructionText}>
                • The app automatically connects to your configured FTP server
              </Text>
              <Text style={styles.instructionText}>
                • XLS files are read from the specified folder path
              </Text>
              <Text style={styles.instructionText}>
                • Data is refreshed every 30 seconds automatically
              </Text>
              <Text style={styles.instructionText}>
                • Charts update in real-time when new data is available
              </Text>
              <Text style={styles.instructionText}>
                • Use the pause/resume button to control auto-refresh
              </Text>
              <Text style={styles.instructionText}>
                • Tap refresh to manually update data immediately
              </Text>
            </View>
          )}

          {/* FTP Configuration Note */}
          <View style={[styles.card, styles.noteCard]}>
            <IconSymbol name="info.circle" color={colors.accent} size={24} />
            <View style={styles.noteContent}>
              <Text style={styles.noteTitle}>FTP Configuration</Text>
              <Text style={styles.noteText}>
                Currently using simulated FTP data. To connect to a real FTP server:
              </Text>
              <Text style={styles.noteText}>
                1. Go to the FTP Settings tab to configure your server details
              </Text>
              <Text style={styles.noteText}>
                2. Enable Supabase backend integration for secure FTP connectivity
              </Text>
              <Text style={styles.noteText}>
                3. Your XLS files will be automatically downloaded and processed
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  scrollContainerWithTabBar: {
    paddingBottom: 100,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statusInfo: {
    gap: 8,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    minWidth: 80,
  },
  statusValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flexButton: {
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  chartTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  chartTypeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  chartTypeButtonActive: {
    backgroundColor: colors.primary,
  },
  chartTypeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  chartTypeButtonTextActive: {
    color: 'white',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButton: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chartInfo: {
    marginTop: 12,
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 6,
  },
  chartInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 12,
    fontWeight: '500',
  },
  loadingSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  noteCard: {
    backgroundColor: colors.accent + '20',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  headerButtonContainer: {
    padding: 6,
  },
});
