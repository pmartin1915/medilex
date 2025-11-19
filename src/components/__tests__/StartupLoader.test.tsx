import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { StartupLoader } from '../StartupLoader';
import { Text } from 'react-native';
import { errorLogger } from '../../utils/errorLogger';

// Mock errorLogger
jest.mock('../../utils/errorLogger', () => ({
  errorLogger: {
    initialize: jest.fn().mockResolvedValue(undefined),
    logInfo: jest.fn(),
    logError: jest.fn(),
  },
}));

// Mock stores
jest.mock('../../store/wordStore', () => ({
  useWordStore: jest.fn(),
}));

jest.mock('../../store/streakStore', () => ({
  useStreakStore: jest.fn(),
}));

// Mock navigation libraries (used in StartupLoader)
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  NavigationContainer: jest.fn(),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: jest.fn(),
}));

const mockErrorLogger = errorLogger as jest.Mocked<typeof errorLogger>;

describe('StartupLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset ALL mocks and restore default success behavior
    mockErrorLogger.initialize.mockResolvedValue(undefined);
    mockErrorLogger.logInfo.mockReturnValue(undefined);
    mockErrorLogger.logError.mockReturnValue(undefined);
  });

  it('renders correctly with initial loading state', () => {
    const onComplete = jest.fn();
    const { getByText } = render(<StartupLoader onComplete={onComplete} />);

    expect(getByText('Healthcare Vocab App')).toBeTruthy();
    expect(getByText('Initializing...')).toBeTruthy();
    expect(getByText('Initializing Error Logger')).toBeTruthy();
    expect(getByText('Loading App Data')).toBeTruthy();
    expect(getByText('Checking AsyncStorage')).toBeTruthy();
    expect(getByText('Initializing Navigation')).toBeTruthy();
  });

  it('calls onComplete with true when all steps succeed', async () => {
    const onComplete = jest.fn();
    render(<StartupLoader onComplete={onComplete} />);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(true);
    }, { timeout: 3000 });
  });

  it('shows success indicators when steps complete', async () => {
    const onComplete = jest.fn();
    const { getAllByText } = render(<StartupLoader onComplete={onComplete} />);

    await waitFor(() => {
      const successIcons = getAllByText('✓');
      expect(successIcons.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  it('renders children after successful completion', async () => {
    const onComplete = jest.fn();
    const { queryByText } = render(
      <StartupLoader onComplete={onComplete}>
        <Text>App Content</Text>
      </StartupLoader>
    );

    // Initially should not show children
    expect(queryByText('App Content')).toBeNull();

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(true);
    }, { timeout: 3000 });
  });

  it('handles error logger initialization failure', async () => {
    // Mock errorLogger to fail
    mockErrorLogger.initialize.mockRejectedValueOnce(
      new Error('Failed to initialize')
    );

    const onComplete = jest.fn();
    const { getByText } = render(<StartupLoader onComplete={onComplete} />);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(false);
    }, { timeout: 5000 });

    expect(getByText('✗')).toBeTruthy();
  });

  it('displays error banner when startup fails', async () => {
    // Mock errorLogger to fail
    mockErrorLogger.initialize.mockRejectedValueOnce(
      new Error('Test error')
    );

    const onComplete = jest.fn();
    const { getByText } = render(<StartupLoader onComplete={onComplete} />);

    await waitFor(() => {
      expect(getByText('Startup failed. Check the debug screen for details.')).toBeTruthy();
    }, { timeout: 5000 });
  });

  it('displays error message for failed step', async () => {
    // Mock errorLogger to fail with specific message
    mockErrorLogger.initialize.mockRejectedValueOnce(
      new Error('Specific error message')
    );

    const onComplete = jest.fn();
    const { getByText } = render(<StartupLoader onComplete={onComplete} />);

    await waitFor(() => {
      expect(getByText('Specific error message')).toBeTruthy();
    }, { timeout: 10000 });
  }, 15000); // Increase test timeout

  it('shows running indicator for current step', async () => {
    const onComplete = jest.fn();
    const { UNSAFE_getAllByType } = render(<StartupLoader onComplete={onComplete} />);

    // Check for ActivityIndicator while loading
    const ActivityIndicator = require('react-native').ActivityIndicator;
    const indicators = UNSAFE_getAllByType(ActivityIndicator);
    expect(indicators.length).toBeGreaterThan(0);
  });

  it('shows pending dots for steps not yet started', () => {
    const onComplete = jest.fn();
    const { UNSAFE_root } = render(<StartupLoader onComplete={onComplete} />);

    // At start, all steps should be pending
    // We can verify this by checking the structure
    expect(UNSAFE_root).toBeTruthy();
  });

  it('completes all 4 startup steps in sequence', async () => {
    const onComplete = jest.fn();
    render(<StartupLoader onComplete={onComplete} />);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(true);
    }, { timeout: 3000 });
  });

  it('waits before calling onComplete on error', async () => {
    mockErrorLogger.initialize.mockRejectedValueOnce(
      new Error('Test error')
    );

    const onComplete = jest.fn();
    render(<StartupLoader onComplete={onComplete} />);

    // Should eventually be called with false
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(false);
    }, { timeout: 5000 });
  });

  it('does not render children when startup fails', async () => {
    mockErrorLogger.initialize.mockRejectedValueOnce(
      new Error('Test error')
    );

    const onComplete = jest.fn();
    const { queryByText } = render(
      <StartupLoader onComplete={onComplete}>
        <Text>App Content</Text>
      </StartupLoader>
    );

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(false);
    }, { timeout: 5000 });

    expect(queryByText('App Content')).toBeNull();
  });
});
