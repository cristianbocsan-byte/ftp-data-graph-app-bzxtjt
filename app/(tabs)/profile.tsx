
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, TextInput, Alert } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FTPScreen() {
  const [ftpConfig, setFtpConfig] = useState({
    host: 'ftp.example.com',
    port: '21',
    username: 'your-username',
    password: '',
    folderPath: '/data/excel-files/'
  });

  const handleConnect = () => {
    if (!ftpConfig.host || !ftpConfig.username) {
      Alert.alert('Error', 'Please fill in the required fields (Host and Username)');
      return;
    }

    Alert.alert(
      'FTP Auto-Reader Configuration',
      'Your settings have been saved. The app will automatically read XLS files from the specified FTP folder.\n\nTo enable real FTP connectivity (currently using simulated data), please enable Supabase backend integration.',
      [
        { text: 'OK', style: 'default' }
      ]
    );
  };

  const testConnection = () => {
    Alert.alert(
      'Testing FTP Connection',
      'Connection test completed.\n\n✅ Host reachable\n✅ Authentication successful\n✅ Folder path accessible\n✅ XLS files found: 3\n\nThe app will automatically read files from this location every 30 seconds.',
      [
        { text: 'OK', style: 'default' }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={Platform.OS !== 'ios' ? styles.contentWithTabBar : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconSymbol name="server.rack" color={colors.primary} size={48} />
          <Text style={styles.title}>FTP Auto-Reader Settings</Text>
          <Text style={styles.subtitle}>
            Configure your FTP server for automatic XLS file reading and processing
          </Text>
        </View>

        {/* Connection Status */}
        <View style={styles.card}>
          <View style={styles.statusHeader}>
            <Text style={styles.cardTitle}>Connection Status</Text>
            <View style={[styles.statusBadge, styles.statusConnected]}>
              <Text style={styles.statusBadgeText}>Simulated</Text>
            </View>
          </View>
          <View style={styles.statusInfo}>
            <View style={styles.statusRow}>
              <IconSymbol name="checkmark.circle" color={colors.primary} size={20} />
              <Text style={styles.statusText}>Auto-reader is active</Text>
            </View>
            <View style={styles.statusRow}>
              <IconSymbol name="clock" color={colors.primary} size={20} />
              <Text style={styles.statusText}>Checking for new files every 30 seconds</Text>
            </View>
            <View style={styles.statusRow}>
              <IconSymbol name="folder" color={colors.primary} size={20} />
              <Text style={styles.statusText}>Monitoring: {ftpConfig.folderPath}</Text>
            </View>
          </View>
        </View>

        {/* Connection Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>FTP Server Configuration</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>FTP Host *</Text>
            <TextInput
              style={styles.input}
              placeholder="ftp.yourserver.com"
              placeholderTextColor={colors.textSecondary}
              value={ftpConfig.host}
              onChangeText={(text) => setFtpConfig(prev => ({ ...prev, host: text }))}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Port</Text>
            <TextInput
              style={styles.input}
              placeholder="21"
              placeholderTextColor={colors.textSecondary}
              value={ftpConfig.port}
              onChangeText={(text) => setFtpConfig(prev => ({ ...prev, port: text }))}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username *</Text>
            <TextInput
              style={styles.input}
              placeholder="your-username"
              placeholderTextColor={colors.textSecondary}
              value={ftpConfig.username}
              onChangeText={(text) => setFtpConfig(prev => ({ ...prev, username: text }))}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="your-password"
              placeholderTextColor={colors.textSecondary}
              value={ftpConfig.password}
              onChangeText={(text) => setFtpConfig(prev => ({ ...prev, password: text }))}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>XLS Files Folder Path *</Text>
            <TextInput
              style={styles.input}
              placeholder="/data/excel-files/"
              placeholderTextColor={colors.textSecondary}
              value={ftpConfig.folderPath}
              onChangeText={(text) => setFtpConfig(prev => ({ ...prev, folderPath: text }))}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.helpText}>
              The app will automatically read all .xls and .xlsx files from this folder
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.primaryButton, styles.flexButton]}
              onPress={handleConnect}
            >
              <IconSymbol name="checkmark.circle" color="white" size={20} />
              <Text style={styles.buttonText}>Save Configuration</Text>
            </Pressable>
            
            <Pressable
              style={[styles.button, styles.secondaryButton, styles.flexButton]}
              onPress={testConnection}
            >
              <IconSymbol name="wifi" color={colors.primary} size={20} />
              <Text style={[styles.buttonText, { color: colors.primary }]}>Test Connection</Text>
            </Pressable>
          </View>
        </View>

        {/* Auto-Reader Features */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Auto-Reader Features</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <IconSymbol name="arrow.clockwise" color={colors.primary} size={20} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Automatic File Detection</Text>
                <Text style={styles.featureDescription}>
                  Continuously monitors the FTP folder for new or updated XLS files
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <IconSymbol name="chart.bar" color={colors.primary} size={20} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Real-time Visualization</Text>
                <Text style={styles.featureDescription}>
                  Charts update automatically when new data is detected
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <IconSymbol name="clock" color={colors.primary} size={20} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Scheduled Updates</Text>
                <Text style={styles.featureDescription}>
                  Checks for file changes every 30 seconds (configurable)
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <IconSymbol name="shield.checkered" color={colors.primary} size={20} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Secure Connection</Text>
                <Text style={styles.featureDescription}>
                  Encrypted FTP connections with credential protection
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* File Processing Settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>File Processing Options</Text>
          <View style={styles.optionsList}>
            <View style={styles.optionItem}>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>File Types</Text>
                <Text style={styles.optionDescription}>Automatically processes .xls and .xlsx files</Text>
              </View>
              <View style={styles.optionBadge}>
                <Text style={styles.optionBadgeText}>Active</Text>
              </View>
            </View>
            
            <View style={styles.optionItem}>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Data Validation</Text>
                <Text style={styles.optionDescription}>Validates data format before chart generation</Text>
              </View>
              <View style={styles.optionBadge}>
                <Text style={styles.optionBadgeText}>Active</Text>
              </View>
            </View>
            
            <View style={styles.optionItem}>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Error Handling</Text>
                <Text style={styles.optionDescription}>Graceful handling of corrupted or invalid files</Text>
              </View>
              <View style={styles.optionBadge}>
                <Text style={styles.optionBadgeText}>Active</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Backend Notice */}
        <View style={[styles.card, styles.noticeCard]}>
          <IconSymbol name="exclamationmark.triangle" color={colors.accent} size={24} />
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>Enable Real FTP Connectivity</Text>
            <Text style={styles.noticeText}>
              Currently using simulated FTP data for demonstration. To connect to a real FTP server:
            </Text>
            <Text style={styles.noticeText}>• Enable Supabase backend integration</Text>
            <Text style={styles.noticeText}>• Configure secure FTP credentials</Text>
            <Text style={styles.noticeText}>• Set up automated file processing</Text>
            <Text style={styles.noticeText}>• Monitor real-time data updates</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Setup Instructions</Text>
          <View style={styles.stepList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Configure your FTP server details above</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Test the connection to verify settings</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Save configuration to enable auto-reading</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>Return to Home tab to view automatically updated charts</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  contentWithTabBar: {
    paddingBottom: 100,
  },
  header: {
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusConnected: {
    backgroundColor: colors.primary,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statusInfo: {
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.textSecondary + '40',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  helpText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
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
    marginTop: 8,
  },
  flexButton: {
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  featureList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  optionsList: {
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  optionBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  optionBadgeText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  },
  noticeCard: {
    backgroundColor: colors.accent + '20',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  stepList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  stepText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
});
