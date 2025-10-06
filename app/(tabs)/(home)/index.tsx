import React, { useState } from "react";
import { Stack } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Alert, Platform, ActivityIndicator } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [fileName, setFileName] = useState<string>('');

  const loadDemoData = () => {
    console.log('Loading demo data...');
    const demoData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
        strokeWidth: 2
      }]
    };
    setChartData(demoData);
    setFileName('demo-sales-data.xls');
    Alert.alert('Demo Data Loaded', 'Sample sales data has been loaded to demonstrate the chart functionality.');
  };

  const pickDocument = async () => {
    try {
      setLoading(true);
      console.log('Starting document picker...');
      
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('File selected:', asset.name);
        setFileName(asset.name);
        await parseXLSFile(asset.uri);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    } finally {
      setLoading(false);
    }
  };

  const parseXLSFile = async (uri: string) => {
    try {
      console.log('Reading file from URI:', uri);
      const fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('File content length:', fileContent.length);
      const workbook = XLSX.read(fileContent, { type: 'base64' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      console.log('Parsed data:', jsonData);
      processDataForChart(jsonData);
    } catch (error) {
      console.error('Error parsing XLS file:', error);
      Alert.alert('Error', 'Failed to parse XLS file. Please ensure it contains valid data.');
    }
  };

  const processDataForChart = (data: any[][]) => {
    if (!data || data.length < 2) {
      Alert.alert('Error', 'File must contain at least 2 rows of data');
      return;
    }

    // Assume first row is headers, subsequent rows are data
    const headers = data[0];
    const rows = data.slice(1).filter(row => row && row.length >= 2);

    console.log('Headers:', headers);
    console.log('Filtered rows:', rows);

    if (rows.length === 0) {
      Alert.alert('Error', 'No valid data rows found. Please ensure your file has data in the first two columns.');
      return;
    }

    // For line/bar chart - use first column as labels, second column as data
    if (headers.length >= 2 && rows.length > 0) {
      const labels = rows.map(row => {
        const label = String(row[0] || '');
        return label.length > 10 ? label.substring(0, 10) + '...' : label;
      }).filter(label => label !== '');
      
      const values = rows.map(row => {
        const val = parseFloat(row[1]);
        return isNaN(val) ? 0 : val;
      });

      console.log('Processed labels:', labels);
      console.log('Processed values:', values);

      if (labels.length === 0 || values.length === 0) {
        Alert.alert('Error', 'Could not extract valid data from the file');
        return;
      }

      const maxItems = 8; // Limit for better mobile display
      const processedData = {
        labels: labels.slice(0, maxItems),
        datasets: [{
          data: values.slice(0, maxItems),
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
          strokeWidth: 2
        }]
      };

      setChartData(processedData);
      Alert.alert('Success', `Successfully loaded ${labels.length} data points from ${fileName}`);
    }
  };

  const renderChart = () => {
    if (!chartData) return null;

    const chartConfig = {
      backgroundColor: colors.card,
      backgroundGradientFrom: colors.card,
      backgroundGradientTo: colors.card,
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(45, 52, 54, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: colors.primary
      },
      propsForBackgroundLines: {
        strokeDasharray: "", // solid background lines
        stroke: colors.textSecondary + '20',
      },
      fillShadowGradient: colors.primary,
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
      onPress={pickDocument}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="plus" color={colors.primary} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => Alert.alert("Chart Types", "Switch between Line, Bar, and Pie charts using the buttons below")}
      style={styles.headerButtonContainer}
    >
      <IconSymbol
        name="gear"
        color={colors.primary}
      />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "XLS Chart Viewer",
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
            <Text style={styles.title}>XLS Chart Viewer</Text>
            <Text style={styles.subtitle}>
              Select an Excel file to visualize your data as interactive charts
            </Text>
          </View>

          {/* File Selection */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Select File</Text>
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.button, styles.primaryButton, styles.flexButton]}
                onPress={pickDocument}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <IconSymbol name="folder" color="white" size={20} />
                    <Text style={styles.buttonText}>Choose XLS File</Text>
                  </>
                )}
              </Pressable>
              <Pressable
                style={[styles.button, styles.secondaryButton, styles.flexButton]}
                onPress={loadDemoData}
                disabled={loading}
              >
                <IconSymbol name="play.circle" color={colors.primary} size={20} />
                <Text style={[styles.buttonText, { color: colors.primary }]}>Try Demo</Text>
              </Pressable>
            </View>
            {fileName && (
              <Text style={styles.fileName}>Selected: {fileName}</Text>
            )}
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
                </View>
              )}
            </View>
          )}

          {/* Instructions */}
          {!chartData && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Instructions</Text>
              <Text style={styles.instructionText}>
                • Tap "Try Demo" to see sample data visualization
              </Text>
              <Text style={styles.instructionText}>
                • Tap "Choose XLS File" to select an Excel file from your device
              </Text>
              <Text style={styles.instructionText}>
                • Your file should have data in the first two columns
              </Text>
              <Text style={styles.instructionText}>
                • First column: Labels (categories, dates, etc.)
              </Text>
              <Text style={styles.instructionText}>
                • Second column: Numeric values
              </Text>
              <Text style={styles.instructionText}>
                • First row will be treated as headers
              </Text>
              
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleTitle}>Example Excel Format:</Text>
                <View style={styles.exampleTable}>
                  <View style={styles.exampleRow}>
                    <Text style={[styles.exampleCell, styles.exampleHeader]}>Month</Text>
                    <Text style={[styles.exampleCell, styles.exampleHeader]}>Sales</Text>
                  </View>
                  <View style={styles.exampleRow}>
                    <Text style={styles.exampleCell}>January</Text>
                    <Text style={styles.exampleCell}>1500</Text>
                  </View>
                  <View style={styles.exampleRow}>
                    <Text style={styles.exampleCell}>February</Text>
                    <Text style={styles.exampleCell}>2300</Text>
                  </View>
                  <View style={styles.exampleRow}>
                    <Text style={styles.exampleCell}>March</Text>
                    <Text style={styles.exampleCell}>1800</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* FTP Server Note */}
          <View style={[styles.card, styles.noteCard]}>
            <IconSymbol name="info.circle" color={colors.accent} size={24} />
            <View style={styles.noteContent}>
              <Text style={styles.noteTitle}>FTP Server Support</Text>
              <Text style={styles.noteText}>
                To read files directly from an FTP server, you would need to enable Supabase backend integration. 
                For now, you can download files from your FTP server and select them locally.
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
    paddingBottom: 100, // Extra padding for floating tab bar
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
  fileName: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
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
  },
  headerButtonContainer: {
    padding: 6,
  },
  exampleContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  exampleTable: {
    borderWidth: 1,
    borderColor: colors.textSecondary + '40',
    borderRadius: 4,
  },
  exampleRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary + '20',
  },
  exampleCell: {
    flex: 1,
    padding: 8,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  exampleHeader: {
    fontWeight: '600',
    backgroundColor: colors.textSecondary + '10',
    color: colors.text,
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
  },
});
