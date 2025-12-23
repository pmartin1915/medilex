import AsyncStorage from '@react-native-async-storage/async-storage';

const ERROR_LOG_KEY = '@vocab_app:error_logs';
const MAX_LOGS = 50;

export interface ErrorLog {
  id: string;
  timestamp: string;
  type: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  componentStack?: string;
  context?: string;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      const savedLogs = await AsyncStorage.getItem(ERROR_LOG_KEY);
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }

      // Override console methods to capture all logs
      this.setupConsoleOverrides();

      // Setup global error handler after AsyncStorage is ready
      this.setupGlobalErrorHandler();

      this.initialized = true;
      console.log('[ErrorLogger] Initialized successfully');
    } catch (error) {
      console.error('[ErrorLogger] Failed to initialize:', error);
    }
  }

  private setupConsoleOverrides() {
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    console.error = (...args: any[]) => {
      this.logError('error', args.join(' '));
      originalError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      this.logError('warn', args.join(' '));
      originalWarn.apply(console, args);
    };

    // Keep original console.log for normal logging
    console.log = originalLog;
  }

  private setupGlobalErrorHandler() {
    // Setup global error handler - only after initialization
    try {
      if (typeof global !== 'undefined' && global.ErrorUtils) {
        const originalHandler = global.ErrorUtils.getGlobalHandler();

        global.ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
          this.logError(
            'error',
            `${isFatal ? 'FATAL: ' : ''}${error.message || 'Unknown error'}`,
            error.stack,
            undefined,
            'Global Error Handler'
          );

          if (originalHandler) {
            originalHandler(error, isFatal);
          }
        });
      }
    } catch (error) {
      // ErrorUtils not available yet, skip global handler setup
      console.warn('[ErrorLogger] ErrorUtils not available, skipping global handler');
    }
  }

  logError(type: ErrorLog['type'], message: string, stack?: string, componentStack?: string, context?: string) {
    const errorLog: ErrorLog = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type,
      message,
      stack,
      componentStack,
      context,
    };

    this.logs.unshift(errorLog);

    // Keep only the most recent logs
    if (this.logs.length > MAX_LOGS) {
      this.logs = this.logs.slice(0, MAX_LOGS);
    }

    // Save to AsyncStorage asynchronously
    this.saveLogs();
  }

  private async saveLogs() {
    try {
      await AsyncStorage.setItem(ERROR_LOG_KEY, JSON.stringify(this.logs));
    } catch (error) {
      // Can't log this error without creating infinite loop
      console.warn('[ErrorLogger] Failed to save logs');
    }
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  async clearLogs() {
    this.logs = [];
    try {
      await AsyncStorage.removeItem(ERROR_LOG_KEY);
      console.log('[ErrorLogger] Logs cleared');
    } catch (error) {
      console.error('[ErrorLogger] Failed to clear logs:', error);
    }
  }

  logInfo(message: string, context?: string) {
    this.logError('info', message, undefined, undefined, context);
  }

  logWarning(message: string, context?: string) {
    this.logError('warn', message, undefined, undefined, context);
  }

  /**
   * Reset the logger state for testing purposes.
   * This allows tests to force re-initialization.
   */
  _resetForTesting() {
    this.initialized = false;
    this.logs = [];
  }
}

// Lazy singleton pattern - create instance only when first accessed
let errorLoggerInstance: ErrorLogger | null = null;

export function getErrorLogger(): ErrorLogger {
  if (!errorLoggerInstance) {
    errorLoggerInstance = new ErrorLogger();
  }
  return errorLoggerInstance;
}

// For backwards compatibility, export a lazy-initialized instance
export const errorLogger = getErrorLogger();
