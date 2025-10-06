import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, TextInput, Alert } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FTPScreen() {
  const [ftpConfig, setFtpConfig] = useState({
    host: '',
    port: '21',
    username: '',
    password: '',
    path: ''
  });

  const handleConnect = () => {
    if (!ftpConfig.host || !ftpConfig.username) {
      Alert.alert('Error', 'Please fill in the required fields (Host and Username)');
      return;
    }

    Alert.alert(
      'FTP Connection',
      'To connect to FTP servers and download files automatically, you need to enable Supabase backend integration.\n\nPress the Supabase button in the app to connect to a Supabase project, then we can implement server-side FTP functionality.',
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
          <Text style={styles.title}>FTP Server Connection</Text>
          <Text style={styles.subtitle}>
            Connect to your FTP server to automatically download and visualize XLS files
          </Text>
        </View>

        {/* Connection Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Server Configuration</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Host *</Text>
            <TextInput
              style={styles.input}
              placeholder="ftp.example.com"
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
            <Text style={styles.label}>File Path</Text>
            <TextInput
              style={styles.input}
              placeholder="/path/to/your/file.xls"
              placeholderTextColor={colors.textSecondary}
              value={ftpConfig.path}
              onChangeText={(text) => setFtpConfig(prev => ({ ...prev, path: text }))}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={handleConnect}
          >
            <IconSymbol name="link" color="white" size={20} />
            <Text style={styles.buttonText}>Connect to FTP Server</Text>
          </Pressable>
        </View>

        {/* Features */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Features</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <IconSymbol name="checkmark.circle" color={colors.primary} size={20} />
              <Text style={styles.featureText}>Automatic file download from FTP server</Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol name="checkmark.circle" color={colors.primary} size={20} />
              <Text style={styles.featureText}>Real-time data synchronization</Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol name="checkmark.circle" color={colors.primary} size={20} />
              <Text style={styles.featureText}>Scheduled data updates</Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol name="checkmark.circle" color={colors.primary} size={20} />
              <Text style={styles.featureText}>Multiple file format support</Text>
            </View>
          </View>
        </View>

        {/* Backend Notice */}
        <View style={[styles.card, styles.noticeCard]}>
          <IconSymbol name="exclamationmark.triangle" color={colors.accent} size={24} />
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>Backend Required</Text>
            <Text style={styles.noticeText}>
              FTP server connectivity requires backend functionality. Enable Supabase integration to:
            </Text>
            <Text style={styles.noticeText}>• Connect to FTP servers securely</Text>
            <Text style={styles.noticeText}>• Download files automatically</Text>
            <Text style={styles.noticeText}>• Schedule periodic data updates</Text>
            <Text style={styles.noticeText}>• Store connection credentials safely</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How to Enable FTP Support</Text>
          <View style={styles.stepList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Press the Supabase button in the app</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Create or connect to a Supabase project</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Configure your FTP server details</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>Start downloading and visualizing data automatically</Text>
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
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
