import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';

interface StartupStep {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  error?: string;
}

interface Props {
  onComplete: (success: boolean) => void;
  children?: React.ReactNode;
}

export const StartupLoader: React.FC<Props> = ({ onComplete, children }) => {
  const [steps, setSteps] = useState<StartupStep[]>([
    { name: 'Initializing Error Logger', status: 'pending' },
    { name: 'Loading App Data', status: 'pending' },
    { name: 'Checking AsyncStorage', status: 'pending' },
    { name: 'Initializing Navigation', status: 'pending' },
  ]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    // Timeout fallback - if startup takes > 5 seconds, proceed anyway
    const timeoutId = setTimeout(() => {
      console.warn('Startup timeout - proceeding anyway');
      setTimedOut(true);
      setIsLoading(false);
      onComplete(true);
    }, 5000);

    runStartupSequence().then(() => {
      clearTimeout(timeoutId);
    }).catch((error) => {
      console.error('Startup error:', error);
      clearTimeout(timeoutId);
      setIsLoading(false);
      onComplete(true);
    });

    return () => clearTimeout(timeoutId);
  }, []);

  const updateStep = (index: number, status: StartupStep['status'], error?: string) => {
    setSteps(prev => {
      const newSteps = [...prev];
      newSteps[index] = { ...newSteps[index], status, error };
      return newSteps;
    });
  };

  const runStartupSequence = async () => {
    let errorLogger: any = null;

    try {
      // Step 0: Initialize Error Logger
      setCurrentStepIndex(0);
      updateStep(0, 'running');
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        // Dynamically import errorLogger after React Native is ready
        const errorLoggerModule = await import('../utils/errorLogger');
        errorLogger = errorLoggerModule.getErrorLogger();
        await errorLogger.initialize();
        errorLogger.logInfo('Error logger initialized', 'StartupLoader');
        updateStep(0, 'success');
      } catch (error: any) {
        console.error('Error logger initialization failed:', error);
        updateStep(0, 'error', error.message);
        throw error;
      }

      // Step 1: Load App Data
      setCurrentStepIndex(1);
      updateStep(1, 'running');
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        // Check if we can import stores
        const { useWordStore } = await import('../store/wordStore');
        const { useStreakStore } = await import('../store/streakStore');

        if (errorLogger) {
          errorLogger.logInfo('Stores imported successfully', 'StartupLoader');
        }
        updateStep(1, 'success');
      } catch (error: any) {
        updateStep(1, 'error', error.message);
        if (errorLogger) {
          errorLogger.logError('error', `Failed to import stores: ${error.message}`, error.stack, undefined, 'StartupLoader');
        }
        console.error('Failed to import stores:', error);
        throw error;
      }

      // Step 2: Check AsyncStorage
      setCurrentStepIndex(2);
      updateStep(2, 'running');
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;

        // Try to read/write test data
        const testKey = '@vocab_app:startup_test';
        await AsyncStorage.setItem(testKey, 'test');
        const testValue = await AsyncStorage.getItem(testKey);
        await AsyncStorage.removeItem(testKey);

        if (testValue !== 'test') {
          throw new Error('AsyncStorage read/write test failed');
        }

        if (errorLogger) {
          errorLogger.logInfo('AsyncStorage working correctly', 'StartupLoader');
        }
        updateStep(2, 'success');
      } catch (error: any) {
        updateStep(2, 'error', error.message);
        if (errorLogger) {
          errorLogger.logError('error', `AsyncStorage test failed: ${error.message}`, error.stack, undefined, 'StartupLoader');
        }
        console.error('AsyncStorage test failed:', error);
        throw error;
      }

      // Step 3: Initialize Navigation
      setCurrentStepIndex(3);
      updateStep(3, 'running');
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        // Check if navigation dependencies are available
        await import('@react-navigation/native');
        await import('@react-navigation/bottom-tabs');

        if (errorLogger) {
          errorLogger.logInfo('Navigation libraries loaded', 'StartupLoader');
        }
        updateStep(3, 'success');
      } catch (error: any) {
        updateStep(3, 'error', error.message);
        if (errorLogger) {
          errorLogger.logError('error', `Navigation init failed: ${error.message}`, error.stack, undefined, 'StartupLoader');
        }
        console.error('Navigation init failed:', error);
        throw error;
      }

      // All steps completed successfully
      if (errorLogger) {
        errorLogger.logInfo('Startup sequence completed successfully', 'StartupLoader');
      }
      console.log('Startup sequence completed successfully');
      setIsLoading(false);

      // Immediate completion - no delay
      onComplete(true);

    } catch (error: any) {
      if (errorLogger) {
        errorLogger.logError('error', `Startup failed: ${error.message}`, error.stack, undefined, 'StartupLoader');
      }
      console.error('Startup failed:', error);
      setIsLoading(false);

      // Proceed anyway on error
      onComplete(true);
    }
  };

  if ((!isLoading && steps.every(s => s.status === 'success')) || timedOut) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Healthcare Vocab App</Text>
      <Text style={styles.subtitle}>Initializing...</Text>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={step.name} style={styles.stepRow}>
            <View style={styles.stepIndicator}>
              {step.status === 'running' && (
                <ActivityIndicator size="small" color={theme.colors.accent} />
              )}
              {step.status === 'success' && (
                <Text style={styles.successIcon}>✓</Text>
              )}
              {step.status === 'error' && (
                <Text style={styles.errorIcon}>✗</Text>
              )}
              {step.status === 'pending' && (
                <View style={styles.pendingDot} />
              )}
            </View>
            <View style={styles.stepContent}>
              <Text style={[
                styles.stepName,
                step.status === 'error' && styles.stepNameError
              ]}>
                {step.name}
              </Text>
              {step.error && (
                <Text style={styles.stepError}>{step.error}</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {steps.some(s => s.status === 'error') && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>
            Startup failed. Check the debug screen for details.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 40,
  },
  stepsContainer: {
    width: '100%',
    maxWidth: 400,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  successIcon: {
    fontSize: 24,
    color: theme.colors.success,
    fontWeight: '700',
  },
  errorIcon: {
    fontSize: 24,
    color: theme.colors.error,
    fontWeight: '700',
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.textTertiary,
  },
  stepContent: {
    flex: 1,
  },
  stepName: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  stepNameError: {
    color: theme.colors.error,
  },
  stepError: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 4,
    fontFamily: 'monospace',
  },
  errorBanner: {
    marginTop: 30,
    backgroundColor: theme.colors.error,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
  },
  errorBannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
