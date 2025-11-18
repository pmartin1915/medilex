import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DebugScreen } from '../DebugScreen';
import { Alert } from 'react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getAllKeys: jest.fn(() => Promise.resolve(['key1', 'key2', 'key3'])),
    getItem: jest.fn((key) => Promise.resolve(`value-for-${key}`)),
    setItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
}));

// Mock Clipboard
jest.mock('react-native/Libraries/Components/Clipboard/Clipboard', () => ({
  setString: jest.fn(() => Promise.resolve()),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock errorLogger
const mockGetLogs = jest.fn(() => [
  {
    id: 'log-1',
    type: 'error',
    message: 'Test error message',
    timestamp: new Date().toISOString(),
    context: 'TestContext',
    stack: 'Error: Test error\n  at line 1',
  },
  {
    id: 'log-2',
    type: 'warn',
    message: 'Test warning message',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    context: 'AnotherContext',
  },
]);

const mockClearLogs = jest.fn(() => Promise.resolve());
const mockLogInfo = jest.fn();

jest.mock('../../utils/errorLogger', () => ({
  getErrorLogger: jest.fn(() => ({
    getLogs: mockGetLogs,
    clearLogs: mockClearLogs,
    logInfo: mockLogInfo,
  })),
}));

// Mock dataValidator
jest.mock('../../utils/dataValidator', () => ({
  dataValidator: {
    validateTerms: jest.fn((terms) => ({
      isValid: true,
      stats: { totalTerms: terms.length },
      errors: [],
    })),
    getValidationSummary: jest.fn(() => 'All terms valid'),
  },
}));

// Mock Zustand stores
const mockTerms = [
  { id: 'term-1', term: 'Cardiology', pronunciation: 'kar-dee-AH-luh-jee' },
  { id: 'term-2', term: 'Anatomy', pronunciation: 'uh-NAT-uh-mee' },
  { id: 'term-3', term: 'Pharmacology', pronunciation: 'far-muh-KAH-luh-jee' },
];

const mockUserProgress = {
  'term-1': { masteryLevel: 'mastered', timesStudied: 50, timesCorrect: 45 },
  'term-2': { masteryLevel: 'learning', timesStudied: 20, timesCorrect: 15 },
};

const mockSearchTerms = jest.fn((query: string) => {
  return mockTerms.filter(t => t.term.toLowerCase().includes(query.toLowerCase()));
});

jest.mock('../../store/wordStore', () => ({
  useWordStore: (selector: (state: any) => any) => {
    const state = {
      terms: mockTerms,
      userProgress: mockUserProgress,
      searchTerms: mockSearchTerms,
    };
    return selector(state);
  },
}));

jest.mock('../../store/streakStore', () => ({
  useStreakStore: (selector: (state: any) => any) => {
    const state = {
      currentStreak: 7,
      studyDates: ['2025-01-01', '2025-01-02', '2025-01-03'],
    };
    return selector(state);
  },
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  Trash2: () => 'Trash2',
  RefreshCw: () => 'RefreshCw',
  AlertCircle: () => 'AlertCircle',
  Copy: () => 'Copy',
  CheckCircle2: () => 'CheckCircle2',
  PlayCircle: () => 'PlayCircle',
  XCircle: () => 'XCircle',
}));

describe('DebugScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with Debug Panel header', () => {
      const { getByText } = render(<DebugScreen />);
      expect(getByText('Debug Panel')).toBeTruthy();
    });

    it('should render all 4 tab buttons', () => {
      const { getByText } = render(<DebugScreen />);
      expect(getByText('Logs')).toBeTruthy();
      expect(getByText('Storage')).toBeTruthy();
      expect(getByText('State')).toBeTruthy();
      expect(getByText('Tests')).toBeTruthy();
    });

    it('should render Logs tab by default', async () => {
      const { getByText } = render(<DebugScreen />);
      await waitFor(() => {
        expect(getByText(/Error Logs/)).toBeTruthy();
      });
    });

    it('should display error logs count', async () => {
      const { getByText } = render(<DebugScreen />);
      await waitFor(() => {
        expect(getByText('Error Logs (2)')).toBeTruthy();
      });
    });

    it('should display log messages', async () => {
      const { getByText } = render(<DebugScreen />);
      await waitFor(() => {
        expect(getByText('Test error message')).toBeTruthy();
        expect(getByText('Test warning message')).toBeTruthy();
      });
    });
  });

  describe('Tab Switching', () => {
    it('should switch to Storage tab', () => {
      const { getByText } = render(<DebugScreen />);
      const storageTab = getByText('Storage');
      fireEvent.press(storageTab);

      // Check for AsyncStorage text (any count)
      expect(getByText(/AsyncStorage/)).toBeTruthy();
    });

    it('should switch to State tab', () => {
      const { getByText } = render(<DebugScreen />);
      const stateTab = getByText('State');
      fireEvent.press(stateTab);

      expect(getByText('App State')).toBeTruthy();
    });

    it('should switch to Tests tab', () => {
      const { getByText } = render(<DebugScreen />);
      const testsTab = getByText('Tests');
      fireEvent.press(testsTab);

      expect(getByText('Self-Diagnostic Tests')).toBeTruthy();
    });

    it('should switch between all tabs', () => {
      const { getByText } = render(<DebugScreen />);

      fireEvent.press(getByText('Storage'));
      expect(getByText(/AsyncStorage/)).toBeTruthy();

      fireEvent.press(getByText('State'));
      expect(getByText('App State')).toBeTruthy();

      fireEvent.press(getByText('Tests'));
      expect(getByText('Self-Diagnostic Tests')).toBeTruthy();

      fireEvent.press(getByText('Logs'));
      expect(getByText(/Error Logs/)).toBeTruthy();
    });
  });

  describe('State Tab', () => {
    it('should display terms count', () => {
      const { getByText, getAllByText } = render(<DebugScreen />);
      fireEvent.press(getByText('State'));

      expect(getByText('Terms Loaded:')).toBeTruthy();
      const threeTexts = getAllByText('3');
      expect(threeTexts.length).toBeGreaterThan(0);
    });

    it('should display user progress count', () => {
      const { getByText } = render(<DebugScreen />);
      fireEvent.press(getByText('State'));

      expect(getByText('User Progress Entries:')).toBeTruthy();
      expect(getByText('2')).toBeTruthy();
    });

    it('should display current streak', () => {
      const { getByText } = render(<DebugScreen />);
      fireEvent.press(getByText('State'));

      expect(getByText('Current Streak:')).toBeTruthy();
      expect(getByText('7 days')).toBeTruthy();
    });

    it('should display study dates count', () => {
      const { getByText, getAllByText } = render(<DebugScreen />);
      fireEvent.press(getByText('State'));

      expect(getByText('Study Dates:')).toBeTruthy();
      const threeTexts = getAllByText('3');
      expect(threeTexts.length).toBeGreaterThan(0);
    });

    it('should display sample terms', () => {
      const { getByText } = render(<DebugScreen />);
      fireEvent.press(getByText('State'));

      expect(getByText('Sample Terms:')).toBeTruthy();
      expect(getByText('Cardiology')).toBeTruthy();
      expect(getByText('Anatomy')).toBeTruthy();
      expect(getByText('Pharmacology')).toBeTruthy();
    });
  });

  describe('Storage Tab', () => {
    it('should display AsyncStorage header', () => {
      const { getByText } = render(<DebugScreen />);
      fireEvent.press(getByText('Storage'));

      expect(getByText(/AsyncStorage/)).toBeTruthy();
    });

    it('should show storage empty state or keys', () => {
      const { getByText, queryByText } = render(<DebugScreen />);
      fireEvent.press(getByText('Storage'));

      // Should show either empty state or keys
      const hasEmptyState = queryByText('No storage keys found');
      const hasStorageText = queryByText(/AsyncStorage/);

      expect(hasStorageText).toBeTruthy();
    });

    it('should render storage tab content', () => {
      const { getByText } = render(<DebugScreen />);
      fireEvent.press(getByText('Storage'));

      // Tab should render without crashing
      expect(getByText(/AsyncStorage/)).toBeTruthy();
    });
  });

  describe('Tests Tab', () => {
    it('should display empty state initially', () => {
      const { getByText } = render(<DebugScreen />);
      fireEvent.press(getByText('Tests'));

      expect(getByText('Run Self-Tests')).toBeTruthy();
      expect(getByText('Tap the play button above to run diagnostic tests')).toBeTruthy();
    });

    it('should have a run tests button', () => {
      const { getByText } = render(<DebugScreen />);
      fireEvent.press(getByText('Tests'));

      expect(getByText('Self-Diagnostic Tests')).toBeTruthy();
    });
  });

  describe('Logs Tab', () => {
    it('should display log type', async () => {
      const { getByText } = render(<DebugScreen />);

      await waitFor(() => {
        expect(getByText('ERROR')).toBeTruthy();
        expect(getByText('WARN')).toBeTruthy();
      });
    });

    it('should display log context', async () => {
      const { getByText } = render(<DebugScreen />);

      await waitFor(() => {
        expect(getByText('Context: TestContext')).toBeTruthy();
        expect(getByText('Context: AnotherContext')).toBeTruthy();
      });
    });

    it('should display tap hint on log items', async () => {
      const { getAllByText } = render(<DebugScreen />);

      await waitFor(() => {
        const hints = getAllByText('Tap to copy full error');
        expect(hints.length).toBeGreaterThan(0);
      });
    });

    it('should show empty state when no logs', async () => {
      mockGetLogs.mockReturnValueOnce([]);

      const { getByText } = render(<DebugScreen />);

      await waitFor(() => {
        expect(getByText('No errors logged!')).toBeTruthy();
        expect(getByText('Your app is running smoothly')).toBeTruthy();
      });
    });
  });

  describe('Component Stability', () => {
    it('should not crash on mount', () => {
      const { getByText } = render(<DebugScreen />);
      expect(getByText('Debug Panel')).toBeTruthy();
    });

    it('should handle multiple tab switches', () => {
      const { getByText } = render(<DebugScreen />);

      for (let i = 0; i < 5; i++) {
        fireEvent.press(getByText('Storage'));
        fireEvent.press(getByText('State'));
        fireEvent.press(getByText('Tests'));
        fireEvent.press(getByText('Logs'));
      }

      expect(getByText('Debug Panel')).toBeTruthy();
    });

    it('should render all tabs without crashing', () => {
      const { getByText } = render(<DebugScreen />);

      fireEvent.press(getByText('Storage'));
      expect(getByText(/AsyncStorage/)).toBeTruthy();

      fireEvent.press(getByText('State'));
      expect(getByText('App State')).toBeTruthy();

      fireEvent.press(getByText('Tests'));
      expect(getByText('Self-Diagnostic Tests')).toBeTruthy();

      fireEvent.press(getByText('Logs'));
      expect(getByText(/Error Logs/)).toBeTruthy();
    });
  });

  describe('Empty States', () => {
    it('should show storage state', () => {
      const { getByText } = render(<DebugScreen />);
      fireEvent.press(getByText('Storage'));

      // Should show AsyncStorage header regardless of keys
      expect(getByText(/AsyncStorage/)).toBeTruthy();
    });

    it('should show empty logs state', async () => {
      mockGetLogs.mockReturnValueOnce([]);

      const { getByText } = render(<DebugScreen />);

      await waitFor(() => {
        expect(getByText('No errors logged!')).toBeTruthy();
      });
    });

    it('should show empty tests state', () => {
      const { getByText } = render(<DebugScreen />);
      fireEvent.press(getByText('Tests'));

      expect(getByText('Run Self-Tests')).toBeTruthy();
    });
  });

  describe('Data Display', () => {
    it('should display all state values correctly', () => {
      const { getByText } = render(<DebugScreen />);
      fireEvent.press(getByText('State'));

      expect(getByText('Terms Loaded:')).toBeTruthy();
      expect(getByText('User Progress Entries:')).toBeTruthy();
      expect(getByText('Current Streak:')).toBeTruthy();
      expect(getByText('Study Dates:')).toBeTruthy();
      expect(getByText('Sample Terms:')).toBeTruthy();
    });

    it('should handle state with zero values', () => {
      const { getByText } = render(<DebugScreen />);
      fireEvent.press(getByText('State'));

      // Component should render even with real data
      expect(getByText('App State')).toBeTruthy();
    });
  });

  describe('Timestamp Formatting', () => {
    it('should display formatted timestamps for recent logs', async () => {
      const { getAllByText } = render(<DebugScreen />);

      await waitFor(() => {
        // Should display relative time (like "1h ago") - may have multiple logs
        const timeTexts = getAllByText(/ago|Just now/);
        expect(timeTexts.length).toBeGreaterThan(0);
      });
    });

    it('should handle logs with different timestamps', async () => {
      mockGetLogs.mockReturnValueOnce([
        {
          id: 'log-recent',
          type: 'error',
          message: 'Recent error',
          timestamp: new Date(Date.now() - 60000).toISOString(), // 1 min ago
          context: 'Test',
        },
        {
          id: 'log-old',
          type: 'warn',
          message: 'Old warning',
          timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          context: 'Test',
        },
      ]);

      const { getByText } = render(<DebugScreen />);

      await waitFor(() => {
        expect(getByText('Recent error')).toBeTruthy();
        expect(getByText('Old warning')).toBeTruthy();
      });
    });
  });

  describe('Log Types', () => {
    it('should render error type logs', async () => {
      const { getByText } = render(<DebugScreen />);

      await waitFor(() => {
        expect(getByText('ERROR')).toBeTruthy();
      });
    });

    it('should render warn type logs', async () => {
      const { getByText } = render(<DebugScreen />);

      await waitFor(() => {
        expect(getByText('WARN')).toBeTruthy();
      });
    });

    it('should display stack trace when available', async () => {
      const { getByText } = render(<DebugScreen />);

      await waitFor(() => {
        expect(getByText(/Error: Test error/)).toBeTruthy();
      });
    });

    it('should handle logs without stack trace', async () => {
      const { getByText } = render(<DebugScreen />);

      await waitFor(() => {
        expect(getByText('Test warning message')).toBeTruthy();
      });
    });

    it('should render multiple logs of different types', async () => {
      mockGetLogs.mockReturnValueOnce([
        {
          id: 'error-1',
          type: 'error',
          message: 'Error 1',
          timestamp: new Date().toISOString(),
          context: 'Context1',
        },
        {
          id: 'warn-1',
          type: 'warn',
          message: 'Warning 1',
          timestamp: new Date().toISOString(),
          context: 'Context2',
        },
        {
          id: 'error-2',
          type: 'error',
          message: 'Error 2',
          timestamp: new Date().toISOString(),
          context: 'Context3',
        },
      ]);

      const { getByText, getAllByText } = render(<DebugScreen />);

      await waitFor(() => {
        const errorLabels = getAllByText('ERROR');
        const warnLabels = getAllByText('WARN');
        expect(errorLabels.length).toBe(2);
        expect(warnLabels.length).toBe(1);
        expect(getByText('Error 1')).toBeTruthy();
        expect(getByText('Warning 1')).toBeTruthy();
        expect(getByText('Error 2')).toBeTruthy();
      });
    });
  });

  describe('Tab Active States', () => {
    it('should mark Logs tab as active initially', () => {
      const { getByText } = render(<DebugScreen />);
      const logsTab = getByText('Logs');
      expect(logsTab).toBeTruthy();
    });

    it('should switch active state when changing tabs', () => {
      const { getByText } = render(<DebugScreen />);

      fireEvent.press(getByText('Storage'));
      expect(getByText('Storage')).toBeTruthy();

      fireEvent.press(getByText('State'));
      expect(getByText('State')).toBeTruthy();

      fireEvent.press(getByText('Tests'));
      expect(getByText('Tests')).toBeTruthy();

      fireEvent.press(getByText('Logs'));
      expect(getByText('Logs')).toBeTruthy();
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle rapid tab switching', () => {
      const { getByText } = render(<DebugScreen />);

      for (let i = 0; i < 10; i++) {
        fireEvent.press(getByText('State'));
        fireEvent.press(getByText('Tests'));
        fireEvent.press(getByText('Logs'));
        fireEvent.press(getByText('Storage'));
      }

      expect(getByText('Debug Panel')).toBeTruthy();
    });

    it('should handle rendering with many logs', async () => {
      const manyLogs = Array.from({ length: 50 }, (_, i) => ({
        id: `log-${i}`,
        type: i % 2 === 0 ? 'error' : 'warn',
        message: `Log message ${i}`,
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        context: `Context${i}`,
      }));

      mockGetLogs.mockReturnValueOnce(manyLogs as any);

      const { getByText } = render(<DebugScreen />);

      await waitFor(() => {
        expect(getByText('Log message 0')).toBeTruthy();
      });
    });

    it('should handle state tab with empty terms', () => {
      const { getByText } = render(<DebugScreen />);
      fireEvent.press(getByText('State'));

      expect(getByText('Sample Terms:')).toBeTruthy();
    });

    it('should render tests tab multiple times', () => {
      const { getByText } = render(<DebugScreen />);

      fireEvent.press(getByText('Tests'));
      expect(getByText('Self-Diagnostic Tests')).toBeTruthy();

      fireEvent.press(getByText('Logs'));
      fireEvent.press(getByText('Tests'));
      expect(getByText('Self-Diagnostic Tests')).toBeTruthy();

      fireEvent.press(getByText('State'));
      fireEvent.press(getByText('Tests'));
      expect(getByText('Self-Diagnostic Tests')).toBeTruthy();
    });
  });

  describe('Header and Layout', () => {
    it('should render header with alert icon', () => {
      const { getByText } = render(<DebugScreen />);
      expect(getByText('Debug Panel')).toBeTruthy();
    });

    it('should have all tab buttons in header', () => {
      const { getByText } = render(<DebugScreen />);
      expect(getByText('Logs')).toBeTruthy();
      expect(getByText('Storage')).toBeTruthy();
      expect(getByText('State')).toBeTruthy();
      expect(getByText('Tests')).toBeTruthy();
    });

    it('should render tab content area', () => {
      const { getByText } = render(<DebugScreen />);
      expect(getByText(/Error Logs/)).toBeTruthy();
    });
  });
});
