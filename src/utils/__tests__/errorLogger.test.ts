/**
 * errorLogger.test.ts
 * Comprehensive tests for ErrorLogger utility
 * Target coverage: 95%+
 *
 * Note: Tests work with singleton pattern - logger persists across tests
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getErrorLogger } from '../errorLogger';

type ErrorLog = {
  id: string;
  timestamp: string;
  type: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  componentStack?: string;
  context?: string;
};

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

describe('ErrorLogger', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(async () => {
    // Clear AsyncStorage
    await AsyncStorage.clear();

    // Get logger and clear its logs
    const logger = getErrorLogger();
    await logger.clearLogs();

    // Mock console methods
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  afterAll(() => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.log = originalConsoleLog;
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance on multiple calls', () => {
      const logger1 = getErrorLogger();
      const logger2 = getErrorLogger();
      expect(logger1).toBe(logger2);
    });

    it('should have all required methods', () => {
      const logger = getErrorLogger();
      expect(logger).toHaveProperty('initialize');
      expect(logger).toHaveProperty('logError');
      expect(logger).toHaveProperty('getLogs');
      expect(logger).toHaveProperty('clearLogs');
      expect(logger).toHaveProperty('logInfo');
    });
  });

  describe('initialize()', () => {
    it('should initialize successfully', async () => {
      const logger = getErrorLogger();
      await logger.initialize();

      const logs = logger.getLogs();
      expect(Array.isArray(logs)).toBe(true);
    });

    it('should load saved logs from AsyncStorage', async () => {
      const savedLogs = [
        {
          id: 'test-1',
          timestamp: new Date().toISOString(),
          type: 'error',
          message: 'Test error from storage',
        },
      ];

      await AsyncStorage.setItem('@vocab_app:error_logs', JSON.stringify(savedLogs));

      const logger = getErrorLogger();
      await logger.initialize();

      const logs = logger.getLogs();
      expect(logs.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('logError()', () => {
    it('should log error with all parameters', async () => {
      const logger = getErrorLogger();
      await logger.initialize();

      logger.logError(
        'error',
        'Test error message',
        'Error stack trace',
        'Component stack trace',
        'Test Context'
      );

      const logs = logger.getLogs();
      expect(logs.length).toBeGreaterThan(0);

      const log = logs[0];
      expect(log.type).toBe('error');
      expect(log.message).toBe('Test error message');
      expect(log.stack).toBe('Error stack trace');
      expect(log.componentStack).toBe('Component stack trace');
      expect(log.context).toBe('Test Context');
      expect(log.id).toBeDefined();
      expect(log.timestamp).toBeDefined();
    });

    it('should log warning', async () => {
      const logger = getErrorLogger();
      await logger.initialize();

      logger.logError('warn', 'Test warning');

      const logs = logger.getLogs();
      const warnLog = logs.find(l => l.message === 'Test warning');
      expect(warnLog).toBeDefined();
      expect(warnLog!.type).toBe('warn');
    });

    it('should log info', async () => {
      const logger = getErrorLogger();
      await logger.initialize();

      logger.logError('info', 'Test info message');

      const logs = logger.getLogs();
      const infoLog = logs.find(l => l.message === 'Test info message');
      expect(infoLog).toBeDefined();
      expect(infoLog!.type).toBe('info');
    });

    it('should add logs to the beginning (unshift)', async () => {
      const logger = getErrorLogger();
      await logger.initialize();

      logger.logError('error', 'First error');
      logger.logError('error', 'Second error');
      logger.logError('error', 'Third error');

      const logs = logger.getLogs();
      expect(logs[0].message).toBe('Third error'); // Most recent first
    });

    it('should enforce MAX_LOGS limit (50 logs)', async () => {
      const logger = getErrorLogger();
      await logger.initialize();

      // Add 60 logs (exceeds MAX_LOGS of 50)
      for (let i = 1; i <= 60; i++) {
        logger.logError('error', `Error ${i}`);
      }

      const logs = logger.getLogs();
      expect(logs.length).toBeLessThanOrEqual(50); // Should be capped at 50
    });

    it('should save logs to AsyncStorage after logging', async () => {
      const logger = getErrorLogger();
      await logger.initialize();

      logger.logError('error', 'Test error for storage');

      // Wait for async save
      await new Promise(resolve => setTimeout(resolve, 200));

      const savedLogs = await AsyncStorage.getItem('@vocab_app:error_logs');
      expect(savedLogs).toBeDefined();

      const parsed = JSON.parse(savedLogs!);
      expect(parsed.length).toBeGreaterThan(0);
    });

    it('should generate unique IDs for each log', async () => {
      const logger = getErrorLogger();
      await logger.initialize();

      logger.logError('error', 'Error 1');
      logger.logError('error', 'Error 2');
      logger.logError('error', 'Error 3');

      const logs = logger.getLogs();
      const ids = logs.map(log => log.id);

      // All IDs should be unique
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('getLogs()', () => {
    it('should return array of logs', () => {
      const logger = getErrorLogger();
      const logs = logger.getLogs();
      expect(Array.isArray(logs)).toBe(true);
    });

    it('should return copy of logs (not reference)', async () => {
      const logger = getErrorLogger();
      await logger.initialize();

      logger.logError('error', 'Test error');

      const logs1 = logger.getLogs();
      const logs2 = logger.getLogs();

      expect(logs1).toEqual(logs2); // Same content
      expect(logs1).not.toBe(logs2); // Different references
    });
  });

  describe('clearLogs()', () => {
    it('should clear all logs from memory', async () => {
      const logger = getErrorLogger();
      await logger.initialize();

      logger.logError('error', 'Error 1');
      logger.logError('error', 'Error 2');

      expect(logger.getLogs().length).toBeGreaterThan(0);

      await logger.clearLogs();

      expect(logger.getLogs().length).toBe(0);
    });

    it('should remove logs from AsyncStorage', async () => {
      const logger = getErrorLogger();
      await logger.initialize();

      logger.logError('error', 'Test error');

      // Wait for save
      await new Promise(resolve => setTimeout(resolve, 200));

      // Verify logs exist in storage
      let savedLogs = await AsyncStorage.getItem('@vocab_app:error_logs');
      expect(savedLogs).toBeDefined();

      await logger.clearLogs();

      // Verify logs removed from storage
      savedLogs = await AsyncStorage.getItem('@vocab_app:error_logs');
      expect(savedLogs).toBeNull();
    });
  });

  describe('logInfo()', () => {
    it('should log info message without context', async () => {
      const logger = getErrorLogger();
      await logger.initialize();

      logger.logInfo('Test info message');

      const logs = logger.getLogs();
      const infoLog = logs.find(l => l.message === 'Test info message');
      expect(infoLog).toBeDefined();
      expect(infoLog!.type).toBe('info');
      expect(infoLog!.context).toBeUndefined();
    });

    it('should log info message with context', async () => {
      const logger = getErrorLogger();
      await logger.initialize();

      logger.logInfo('User logged in', 'AuthContext');

      const logs = logger.getLogs();
      const infoLog = logs.find(l => l.message === 'User logged in');
      expect(infoLog).toBeDefined();
      expect(infoLog!.type).toBe('info');
      expect(infoLog!.context).toBe('AuthContext');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty error messages', async () => {
      const logger = getErrorLogger();
      await logger.initialize();

      logger.logError('error', '');

      const logs = logger.getLogs();
      const emptyLog = logs.find(l => l.message === '');
      expect(emptyLog).toBeDefined();
    });

    it('should handle very long error messages', async () => {
      const logger = getErrorLogger();
      await logger.initialize();

      const longMessage = 'A'.repeat(10000);
      logger.logError('error', longMessage);

      const logs = logger.getLogs();
      const longLog = logs.find(l => l.message === longMessage);
      expect(longLog).toBeDefined();
    });

    it('should handle special characters in messages', async () => {
      const logger = getErrorLogger();
      await logger.initialize();

      const specialMessage = 'Error with "quotes" and \\backslashes\\ and \nnewlines';
      logger.logError('error', specialMessage);

      const logs = logger.getLogs();
      const specialLog = logs.find(l => l.message === specialMessage);
      expect(specialLog).toBeDefined();
    });
  });
});
