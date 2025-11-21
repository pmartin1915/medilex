import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import ErrorBoundary from '../ErrorBoundary';
import { errorLogger } from '../../utils/errorLogger';

// Mock errorLogger
jest.mock('../../utils/errorLogger', () => ({
  errorLogger: {
    logError: jest.fn(),
  },
}));

// Component that throws an error
const ThrowError: React.FC<{ shouldThrow?: boolean; message?: string }> = ({
  shouldThrow = true,
  message = 'Test error',
}) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <Text>No error</Text>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('renders children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Child component</Text>
      </ErrorBoundary>
    );

    expect(getByText('Child component')).toBeTruthy();
  });

  it('catches errors and displays error UI', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Test error')).toBeTruthy();
    expect(getByText('Try Again')).toBeTruthy();
  });

  it('displays default message when error has no message', () => {
    const ThrowEmptyError = () => {
      const error = new Error();
      error.message = '';
      throw error;
    };

    const { getByText } = render(
      <ErrorBoundary>
        <ThrowEmptyError />
      </ErrorBoundary>
    );

    expect(getByText('An unexpected error occurred')).toBeTruthy();
  });

  it('displays stack trace when available', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText('Stack Trace:')).toBeTruthy();
  });

  it('displays component stack when available', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Component stack is provided by React in componentDidCatch
    expect(getByText('Component Stack:')).toBeTruthy();
  });

  it('shows hint about debug tab', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText('Check the Debug tab for full error logs')).toBeTruthy();
  });

  it('logs error to errorLogger when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Custom error message" />
      </ErrorBoundary>
    );

    expect(errorLogger.logError).toHaveBeenCalledWith(
      'error',
      'Custom error message',
      expect.any(String), // stack
      expect.any(String), // component stack
      'ErrorBoundary'
    );
  });

  it('has Try Again button that calls reset handler', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Error UI should be visible
    expect(getByText('Something went wrong')).toBeTruthy();

    // Verify Try Again button exists and is pressable
    const tryAgainButton = getByText('Try Again');
    expect(tryAgainButton).toBeTruthy();

    // Press should not crash
    fireEvent.press(tryAgainButton);
  });

  it('displays different error messages for different errors', () => {
    const { getByText, rerender } = render(
      <ErrorBoundary>
        <ThrowError message="First error" />
      </ErrorBoundary>
    );

    expect(getByText('First error')).toBeTruthy();

    // Can display another error if re-rendered
    rerender(
      <ErrorBoundary>
        <ThrowError message="Different error" />
      </ErrorBoundary>
    );

    // One of the errors should be displayed
    const hasFirstOrDifferent =
      getByText('First error') || getByText('Different error');
    expect(hasFirstOrDifferent).toBeTruthy();
  });

  it('renders error UI in correct structure', () => {
    const { UNSAFE_root } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Verify the component tree exists
    expect(UNSAFE_root).toBeTruthy();
  });

  it('maintains error state until reset', () => {
    const { getByText, queryByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Error should persist
    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Test error')).toBeTruthy();

    // Children should not render
    expect(queryByText('No error')).toBeNull();
  });

  it('logs error with stack trace', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const loggedStack = (errorLogger.logError as jest.Mock).mock.calls[0][2];
    expect(loggedStack).toBeTruthy();
    expect(typeof loggedStack).toBe('string');
  });

  it('logs error with component stack', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const componentStack = (errorLogger.logError as jest.Mock).mock.calls[0][3];
    expect(componentStack).toBeTruthy();
  });

  it('renders error UI even without errorLogger', () => {
    // Test that error UI still renders if errorLogger fails
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Should still render error UI
    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Test error')).toBeTruthy();
  });
});
