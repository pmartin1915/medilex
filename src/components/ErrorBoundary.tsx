import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../theme/theme';
import { getErrorLogger } from '../utils/errorLogger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);

    // Log to our error logger
    try {
      const errorLogger = getErrorLogger();
      errorLogger.logError(
        'error',
        error.message || 'Unknown error',
        error.stack,
        errorInfo.componentStack || undefined,
        'ErrorBoundary'
      );
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <ScrollView style={styles.errorScroll} contentContainerStyle={styles.errorScrollContent}>
            <Text style={styles.message}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            {this.state.error?.stack && (
              <View style={styles.stackContainer}>
                <Text style={styles.stackLabel}>Stack Trace:</Text>
                <ScrollView horizontal>
                  <Text style={styles.stackTrace}>{this.state.error.stack}</Text>
                </ScrollView>
              </View>
            )}
            {this.state.errorInfo?.componentStack && (
              <View style={styles.stackContainer}>
                <Text style={styles.stackLabel}>Component Stack:</Text>
                <ScrollView horizontal>
                  <Text style={styles.stackTrace}>{this.state.errorInfo.componentStack}</Text>
                </ScrollView>
              </View>
            )}
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
          <Text style={styles.hint}>
            Check the Debug tab for full error logs
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.error,
    marginBottom: 12,
  },
  errorScroll: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
  },
  errorScrollContent: {
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  stackContainer: {
    width: '100%',
    backgroundColor: theme.colors.cardBackground,
    padding: 12,
    borderRadius: theme.borderRadius.md,
    marginBottom: 12,
  },
  stackLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.error,
    marginBottom: 8,
  },
  stackTrace: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  button: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
  },
});

export default ErrorBoundary;
