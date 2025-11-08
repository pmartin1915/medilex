import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Clipboard,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/theme';
import { errorLogger, ErrorLog } from '../utils/errorLogger';
import { useWordStore } from '../store/wordStore';
import { useStreakStore } from '../store/streakStore';
import { Trash2, RefreshCw, AlertCircle, Copy, CheckCircle2 } from 'lucide-react-native';

export const DebugScreen = () => {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [storageKeys, setStorageKeys] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<'logs' | 'storage' | 'state'>('logs');
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);

  const terms = useWordStore(state => state.terms);
  const userProgress = useWordStore(state => state.userProgress);
  const streak = useStreakStore(state => state.currentStreak);
  const studyDates = useStreakStore(state => state.studyDates);

  useEffect(() => {
    loadDebugInfo();
  }, []);

  const loadDebugInfo = async () => {
    // Load error logs
    const errorLogs = errorLogger.getLogs();
    setLogs(errorLogs);

    // Load AsyncStorage keys
    try {
      const keys = await AsyncStorage.getAllKeys();
      setStorageKeys(keys);
    } catch (error) {
      console.error('Failed to load storage keys:', error);
    }
  };

  const handleClearLogs = () => {
    Alert.alert(
      'Clear Logs',
      'Are you sure you want to clear all error logs?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await errorLogger.clearLogs();
            loadDebugInfo();
          },
        },
      ]
    );
  };

  const handleClearStorage = () => {
    Alert.alert(
      'Clear All Storage',
      'This will delete ALL app data including your progress. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'All storage cleared. Please restart the app.');
              loadDebugInfo();
            } catch (error: any) {
              Alert.alert('Error', `Failed to clear storage: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const handleViewStorageValue = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      Alert.alert(
        key,
        value || 'null',
        [{ text: 'OK' }],
        { cancelable: true }
      );
    } catch (error: any) {
      Alert.alert('Error', `Failed to read key: ${error.message}`);
    }
  };

  const handleCopyLog = async (log: ErrorLog) => {
    try {
      const logText = `
=== ERROR LOG ===
Type: ${log.type.toUpperCase()}
Time: ${new Date(log.timestamp).toLocaleString()}
Context: ${log.context || 'N/A'}

Message:
${log.message}

${log.stack ? `Stack Trace:\n${log.stack}\n` : ''}
${log.componentStack ? `Component Stack:\n${log.componentStack}\n` : ''}
=================
      `.trim();

      await Clipboard.setString(logText);
      setCopiedLogId(log.id);

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedLogId(null), 2000);
    } catch (error: any) {
      Alert.alert('Error', `Failed to copy: ${error.message}`);
    }
  };

  const handleCopyAllLogs = async () => {
    try {
      const allLogsText = logs.map(log => {
        return `
=== ERROR LOG ===
Type: ${log.type.toUpperCase()}
Time: ${new Date(log.timestamp).toLocaleString()}
Context: ${log.context || 'N/A'}
Message: ${log.message}
${log.stack ? `Stack: ${log.stack}` : ''}
=================`;
      }).join('\n\n');

      await Clipboard.setString(allLogsText);
      Alert.alert('Success', `Copied ${logs.length} error logs to clipboard`);
    } catch (error: any) {
      Alert.alert('Error', `Failed to copy logs: ${error.message}`);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleTimeString();
  };

  const renderLogs = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Error Logs ({logs.length})</Text>
        {logs.length > 0 && (
          <TouchableOpacity onPress={handleCopyAllLogs} style={styles.iconButton}>
            <Copy size={20} color={theme.colors.accent} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleClearLogs} style={styles.iconButton}>
          <Trash2 size={20} color={theme.colors.error} />
        </TouchableOpacity>
        <TouchableOpacity onPress={loadDebugInfo} style={styles.iconButton}>
          <RefreshCw size={20} color={theme.colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.logsList}>
        {logs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <CheckCircle2 size={48} color={theme.colors.success} />
            <Text style={styles.emptyText}>No errors logged!</Text>
            <Text style={styles.emptySubtext}>Your app is running smoothly</Text>
          </View>
        ) : (
          logs.map((log) => (
            <TouchableOpacity
              key={log.id}
              style={[
                styles.logItem,
                log.type === 'error' && styles.logItemError,
                log.type === 'warn' && styles.logItemWarn,
              ]}
              onPress={() => handleCopyLog(log)}
              activeOpacity={0.7}
            >
              <View style={styles.logHeader}>
                <View style={styles.logHeaderLeft}>
                  <Text style={styles.logType}>{log.type.toUpperCase()}</Text>
                  <Text style={styles.logTime}>{formatTimestamp(log.timestamp)}</Text>
                </View>
                <View style={styles.copyIndicator}>
                  {copiedLogId === log.id ? (
                    <CheckCircle2 size={16} color={theme.colors.success} />
                  ) : (
                    <Copy size={16} color={theme.colors.textTertiary} />
                  )}
                </View>
              </View>
              <Text style={styles.logMessage}>{log.message}</Text>
              {log.context && (
                <Text style={styles.logContext}>Context: {log.context}</Text>
              )}
              {log.stack && (
                <Text style={styles.logStack} numberOfLines={3}>
                  {log.stack}
                </Text>
              )}
              <Text style={styles.tapHint}>Tap to copy full error</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderStorage = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>AsyncStorage ({storageKeys.length} keys)</Text>
        <TouchableOpacity onPress={handleClearStorage} style={styles.iconButton}>
          <Trash2 size={20} color={theme.colors.error} />
        </TouchableOpacity>
        <TouchableOpacity onPress={loadDebugInfo} style={styles.iconButton}>
          <RefreshCw size={20} color={theme.colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.storageList}>
        {storageKeys.length === 0 ? (
          <Text style={styles.emptyText}>No storage keys found</Text>
        ) : (
          storageKeys.map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.storageItem}
              onPress={() => handleViewStorageValue(key)}
            >
              <Text style={styles.storageKey}>{key}</Text>
              <Text style={styles.storageTap}>Tap to view</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderState = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>App State</Text>
        <TouchableOpacity onPress={loadDebugInfo} style={styles.iconButton}>
          <RefreshCw size={20} color={theme.colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.stateList}>
        <View style={styles.stateSection}>
          <Text style={styles.stateLabel}>Terms Loaded:</Text>
          <Text style={styles.stateValue}>{terms.length}</Text>
        </View>

        <View style={styles.stateSection}>
          <Text style={styles.stateLabel}>User Progress Entries:</Text>
          <Text style={styles.stateValue}>
            {Object.keys(userProgress).length}
          </Text>
        </View>

        <View style={styles.stateSection}>
          <Text style={styles.stateLabel}>Current Streak:</Text>
          <Text style={styles.stateValue}>{streak} days</Text>
        </View>

        <View style={styles.stateSection}>
          <Text style={styles.stateLabel}>Study Dates:</Text>
          <Text style={styles.stateValue}>{studyDates.length}</Text>
        </View>

        <View style={styles.stateSection}>
          <Text style={styles.stateLabel}>Sample Terms:</Text>
          <ScrollView horizontal style={styles.termsPreview}>
            {terms.slice(0, 3).map((term) => (
              <View key={term.id} style={styles.termPreviewCard}>
                <Text style={styles.termPreviewText}>{term.term}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AlertCircle size={24} color={theme.colors.warning} />
        <Text style={styles.headerTitle}>Debug Panel</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'logs' && styles.tabActive]}
          onPress={() => setSelectedTab('logs')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'logs' && styles.tabTextActive,
            ]}
          >
            Logs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'storage' && styles.tabActive]}
          onPress={() => setSelectedTab('storage')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'storage' && styles.tabTextActive,
            ]}
          >
            Storage
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'state' && styles.tabActive]}
          onPress={() => setSelectedTab('state')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'state' && styles.tabTextActive,
            ]}
          >
            State
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'logs' && renderLogs()}
      {selectedTab === 'storage' && renderStorage()}
      {selectedTab === 'state' && renderState()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginLeft: 12,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.accent,
  },
  tabContent: {
    flex: 1,
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  logsList: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  emptySubtext: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  logItem: {
    backgroundColor: theme.colors.cardBackground,
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
  },
  logItemError: {
    borderLeftColor: theme.colors.error,
  },
  logItemWarn: {
    borderLeftColor: theme.colors.warning,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  copyIndicator: {
    padding: 4,
  },
  logType: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  logTime: {
    fontSize: 11,
    color: theme.colors.textTertiary,
  },
  tapHint: {
    fontSize: 10,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'right',
  },
  logMessage: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  logContext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  logStack: {
    fontSize: 10,
    color: theme.colors.textTertiary,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  storageList: {
    flex: 1,
  },
  storageItem: {
    backgroundColor: theme.colors.cardBackground,
    marginHorizontal: 12,
    marginVertical: 4,
    padding: 16,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storageKey: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontFamily: 'monospace',
    flex: 1,
  },
  storageTap: {
    fontSize: 12,
    color: theme.colors.accent,
    fontWeight: '600',
  },
  stateList: {
    flex: 1,
    padding: 16,
  },
  stateSection: {
    backgroundColor: theme.colors.cardBackground,
    padding: 16,
    borderRadius: theme.borderRadius.md,
    marginBottom: 12,
  },
  stateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  stateValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  termsPreview: {
    marginTop: 8,
  },
  termPreviewCard: {
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: theme.borderRadius.sm,
    marginRight: 8,
  },
  termPreviewText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
});
