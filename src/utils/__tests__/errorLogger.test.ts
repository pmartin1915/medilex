import AsyncStorage from '@react-native-async-storage/async-storage';
import { errorLogger, getErrorLogger } from '../errorLogger';

describe('ErrorLogger', () => {
  let logger: ReturnType<typeof getErrorLogger>;

  beforeEach(async () => {
    // Clear AsyncStorage
    await AsyncStorage.clear();

    // Get fresh logger instance
    logger = getErrorLogger();

    // Clear any existing logs
    await logger.clearLogs();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance on multiple calls', () => {
      const logger1 = getErrorLogger();
      const logger2 = getErrorLogger();

      expect(logger1).toBe(logger2);
    });

    it('should have all required methods', () => {
      expect(logger).toHaveProperty('initialize');
      expect(logger).toHaveProperty('logError');
      expect(logger).toHaveProperty('logWarning');
      expect(logger).toHaveProperty('logInfo');
      expect(logger).toHaveProperty('getLogs');
      expect(logger).toHaveProperty('clearLogs');
    });
  });

  describe('initialize()', () => {
    it('should initialize successfully', async () => {
      await expect(logger.initialize()).resolves.not.toThrow();
    });

    it('should load saved logs from AsyncStorage', async () => {
      const mockLogs = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          type: 'error' as const,
          message: 'Test error',
        },
      ];

      await AsyncStorage.setItem('@vocab_app:error_logs', JSON.stringify(mockLogs));

      await logger.initialize();
      const logs = logger.getLogs();

      expect(logs.length).toBeGreaterThan(0);
    });
  });

  describe('logError()', () => {
    it('should log error with all parameters', async () => {
      await logger.initialize();

      logger.logError('error', 'Test error message', 'Error stack', 'Component stack', 'Test context');

      const logs = logger.getLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].type).toBe('error');
      expect(logs[0].message).toBe('Test error message');
      expect(logs[0].stack).toBe('Error stack');
      expect(logs[0].componentStack).toBe('Component stack');
      expect(logs[0].context).toBe('Test context');
    });

    it('should log warning', async () => {
      await logger.initialize();

      logger.logWarning('Test warning');

      const logs = logger.getLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].type).toBe('warn');
    });

    it('should log info', async () => {
      await logger.initialize();

      logger.logInfo('Test info', 'Test context');

      const logs = logger.getLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].type).toBe('info');
      expect(logs[0].context).toBe('Test context');
    });

    it('should add logs to the beginning (unshift)', async () => {
      await logger.initialize();

      logger.logError('error', 'First');
      logger.logError('error', 'Second');

      const logs = logger.getLogs();
      expect(logs[0].message).toBe('Second');
      expect(logs[1].message).toBe('First');
    });

    it('should enforce MAX_LOGS limit (50 logs)', async () => {
      await logger.initialize();

      // Add 60 logs
      for (let i = 0; i < 60; i++) {
        logger.logError('error', `Error ${i}`);
      }

      const logs = logger.getLogs();
      expect(logs.length).toBe(50);
      expect(logs[0].message).toBe('Error 59'); // Most recent
    });

    it('should save logs to AsyncStorage after logging', async () => {
      await logger.initialize();

      logger.logError('error', 'Test');

      // Wait a bit for async save
      await new Promise(resolve => setTimeout(resolve, 100));

      const saved = await AsyncStorage.getItem('@vocab_app:error_logs');
      expect(saved).toBeTruthy();

      const parsed = JSON.parse(saved!);
      expect(parsed.length).toBe(1);
    });

    it('should generate unique IDs for each log', async () => {
      await logger.initialize();

      logger.logError('error', 'First');
      logger.logError('error', 'Second');

      const logs = logger.getLogs();
      expect(logs[0].id).not.toBe(logs[1].id);
    });
  });

  describe('getLogs()', () => {
    it('should return array of logs', async () => {
      await logger.initialize();

      logger.logError('error', 'Test');

      const logs = logger.getLogs();
      expect(Array.isArray(logs)).toBe(true);
      expect(logs.length).toBe(1);
    });

    it('should return copy of logs (not reference)', async () => {
      await logger.initialize();

      logger.logError('error', 'Test');

      const logs1 = logger.getLogs();
      const logs2 = logger.getLogs();

      expect(logs1).not.toBe(logs2); // Different references
      expect(logs1).toEqual(logs2); // Same content
    });
  });

  describe('clearLogs()', () => {
    it('should clear all logs from memory', async () => {
      await logger.initialize();

      logger.logError('error', 'Test 1');
      logger.logError('error', 'Test 2');

      await logger.clearLogs();

      const logs = logger.getLogs();
      expect(logs.length).toBe(0);
    });

    it('should remove logs from AsyncStorage', async () => {
      await logger.initialize();

      logger.logError('error', 'Test');
      await logger.clearLogs();

      const saved = await AsyncStorage.getItem('@vocab_app:error_logs');
      expect(saved).toBeNull();
    });
  });

  describe('logInfo()', () => {
    it('should log info message without context', async () => {
      await logger.initialize();

      logger.logInfo('Info message');

      const logs = logger.getLogs();
      expect(logs[0].type).toBe('info');
      expect(logs[0].message).toBe('Info message');
    });

    it('should log info message with context', async () => {
      await logger.initialize();

      logger.logInfo('Info message', 'App startup');

      const logs = logger.getLogs();
      expect(logs[0].context).toBe('App startup');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty error messages', async () => {
      await logger.initialize();

      logger.logError('error', '');

      const logs = logger.getLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].message).toBe('');
    });

    it('should handle very long error messages', async () => {
      await logger.initialize();

      const longMessage = 'x'.repeat(10000);
      logger.logError('error', longMessage);

      const logs = logger.getLogs();
      expect(logs[0].message).toBe(longMessage);
    });

    it('should handle special characters in messages', async () => {
      await logger.initialize();

      const specialMessage = 'Test\n\r\t"\'<>&';
      logger.logError('error', specialMessage);

      const logs = logger.getLogs();
      expect(logs[0].message).toBe(specialMessage);
    });
  });
});
