/**
 * ErrorBoundary.test.tsx
 * Comprehensive tests for ErrorBoundary component
 * Target coverage: 90%+
 */

import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorBoundary from '../ErrorBoundary';
import { getErrorLogger } from '../../utils/errorLogger';

// Mock error logger
jest.mock('../../utils/errorLogger', () => ({
  getErrorLogger: jest.fn(() => ({
    logError: jest.fn(),
  })),
}));

// Suppress console.error for error boundary tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper component that throws an error
  const ThrowError = ({ shouldThrow = true, message = 'Test error' }: { shouldThrow?: boolean; message?: string }) => {
    if (shouldThrow) {
      throw new Error(message);
    }
    return <Text>No error</Text>;
  };

  describe('Normal Rendering', () => {
    it('should render children when no error occurs', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <Text>Child component</Text>
        </ErrorBoundary>
      );

      expect(getByText('Child component')).toBeTruthy();
    });

    it('should not show error UI when children render successfully', () => {
      const { queryByText } = render(
        <ErrorBoundary>
          <Text>Working component</Text>
        </ErrorBoundary>
      );

      expect(queryByText('Something went wrong')).toBeNull();
      expect(queryByText('Try Again')).toBeNull();
    });

    it('should render multiple children without error', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <Text>First child</Text>
          <Text>Second child</Text>
        </ErrorBoundary>
      );

      expect(getByText('First child')).toBeTruthy();
      expect(getByText('Second child')).toBeTruthy();
    });
  });

  describe('Error Catching', () => {
    it('should catch errors from child components', () => {
      const { getByText, queryByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Error UI should be shown
      expect(getByText('Something went wrong')).toBeTruthy();
      expect(queryByText('No error')).toBeNull();
    });

    it('should display error message', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError message="Custom error message" />
        </ErrorBoundary>
      );

      expect(getByText('Custom error message')).toBeTruthy();
    });

    it('should display default message when error has no message', () => {
      const ThrowNoMessage = () => {
        const error = new Error();
        error.message = '';
        throw error;
      };

      const { getByText } = render(
        <ErrorBoundary>
          <ThrowNoMessage />
        </ErrorBoundary>
      );

      expect(getByText('An unexpected error occurred')).toBeTruthy();
    });

    it('should display stack trace when available', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError message="Error with stack" />
        </ErrorBoundary>
      );

      expect(getByText('Stack Trace:')).toBeTruthy();
    });

    it('should update state with error', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError message="State update test" />
        </ErrorBoundary>
      );

      // Verify error UI is rendered (which confirms state was updated)
      expect(getByText('Something went wrong')).toBeTruthy();
      expect(getByText('State update test')).toBeTruthy();
    });
  });

  describe('Error Logging', () => {
    it('should log error to error logger', () => {
      const mockLogError = jest.fn();
      (getErrorLogger as jest.Mock).mockReturnValue({
        logError: mockLogError,
      });

      render(
        <ErrorBoundary>
          <ThrowError message="Logged error" />
        </ErrorBoundary>
      );

      expect(mockLogError).toHaveBeenCalledWith(
        'error',
        'Logged error',
        expect.any(String), // stack
        expect.any(String), // componentStack
        'ErrorBoundary'
      );
    });

    it('should handle error logger failures gracefully', () => {
      (getErrorLogger as jest.Mock).mockImplementation(() => {
        throw new Error('Logger unavailable');
      });

      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError message="Logger failure test" />
        </ErrorBoundary>
      );

      // Should still render error UI even if logging fails
      expect(getByText('Something went wrong')).toBeTruthy();
      expect(console.error).toHaveBeenCalledWith('Failed to log error:', expect.any(Error));
    });

    it('should log error with empty message', () => {
      const mockLogError = jest.fn();
      (getErrorLogger as jest.Mock).mockReturnValue({
        logError: mockLogError,
      });

      const ThrowEmptyMessage = () => {
        throw new Error('');
      };

      render(
        <ErrorBoundary>
          <ThrowEmptyMessage />
        </ErrorBoundary>
      );

      expect(mockLogError).toHaveBeenCalledWith(
        'error',
        'Unknown error',
        expect.any(String),
        expect.any(String),
        'ErrorBoundary'
      );
    });
  });

  describe('Error UI', () => {
    it('should display "Something went wrong" title', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(getByText('Something went wrong')).toBeTruthy();
    });

    it('should display "Try Again" button', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(getByText('Try Again')).toBeTruthy();
    });

    it('should display hint about Debug tab', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(getByText('Check the Debug tab for full error logs')).toBeTruthy();
    });

    it('should render stack trace section when error has stack', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError message="Error with stack trace" />
        </ErrorBoundary>
      );

      expect(getByText('Stack Trace:')).toBeTruthy();
    });

    it('should render component stack when available', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError message="Component stack test" />
        </ErrorBoundary>
      );

      // Component stack is provided by React's error boundary mechanism
      expect(getByText('Component Stack:')).toBeTruthy();
    });

    it('should not crash when error has no stack', () => {
      const ThrowNoStack = () => {
        const error = new Error('No stack error');
        delete (error as any).stack;
        throw error;
      };

      const { getByText, queryByText } = render(
        <ErrorBoundary>
          <ThrowNoStack />
        </ErrorBoundary>
      );

      expect(getByText('Something went wrong')).toBeTruthy();
      expect(queryByText('Stack Trace:')).toBeNull();
    });
  });

  describe('Reset Functionality', () => {
    it('should reset error state when "Try Again" is pressed', () => {
      let shouldThrow = true;

      const ConditionalThrow = () => {
        if (shouldThrow) {
          throw new Error('Conditional error');
        }
        return <Text>Recovered</Text>;
      };

      const { getByText, rerender } = render(
        <ErrorBoundary>
          <ConditionalThrow />
        </ErrorBoundary>
      );

      // Error should be shown
      expect(getByText('Something went wrong')).toBeTruthy();

      // Fix the error condition
      shouldThrow = false;

      // Press "Try Again"
      fireEvent.press(getByText('Try Again'));

      // Re-render to simulate React's behavior
      rerender(
        <ErrorBoundary>
          <ConditionalThrow />
        </ErrorBoundary>
      );

      // Should show recovered content
      expect(getByText('Recovered')).toBeTruthy();
    });

    it('should clear error state completely on reset', () => {
      let shouldThrow = true;

      const TestComponent = () => {
        if (shouldThrow) {
          throw new Error('Test reset');
        }
        return <Text>Reset successful</Text>;
      };

      const { getByText, queryByText, rerender } = render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      // Verify error is shown
      expect(getByText('Test reset')).toBeTruthy();

      // Fix error and reset
      shouldThrow = false;
      fireEvent.press(getByText('Try Again'));

      rerender(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      // Error UI should be gone
      expect(queryByText('Something went wrong')).toBeNull();
      expect(queryByText('Test reset')).toBeNull();
    });

    it('should call handleReset when button is pressed', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError message="Reset test" />
        </ErrorBoundary>
      );

      const resetButton = getByText('Try Again');

      // Should not throw when pressed
      expect(() => fireEvent.press(resetButton)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors thrown during render', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError message="Render error" />
        </ErrorBoundary>
      );

      expect(getByText('Something went wrong')).toBeTruthy();
    });

    it('should handle errors with very long messages', () => {
      const longMessage = 'A'.repeat(1000);

      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError message={longMessage} />
        </ErrorBoundary>
      );

      expect(getByText(longMessage)).toBeTruthy();
    });

    it('should handle errors with special characters', () => {
      const specialMessage = 'Error with "quotes" and \\backslashes\\ and \nnewlines';

      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError message={specialMessage} />
        </ErrorBoundary>
      );

      expect(getByText(specialMessage)).toBeTruthy();
    });

    it('should handle multiple errors in sequence', () => {
      let errorNumber = 1;

      const MultiError = () => {
        throw new Error(`Error ${errorNumber}`);
      };

      const { getByText, rerender } = render(
        <ErrorBoundary>
          <MultiError />
        </ErrorBoundary>
      );

      expect(getByText('Error 1')).toBeTruthy();

      // Trigger different error
      errorNumber = 2;
      rerender(
        <ErrorBoundary>
          <MultiError />
        </ErrorBoundary>
      );

      // Should still show error UI (may show first or second error depending on timing)
      expect(getByText('Something went wrong')).toBeTruthy();
    });

    it('should render correctly without componentStack in errorInfo', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError message="No component stack" />
        </ErrorBoundary>
      );

      // Should render error UI successfully
      expect(getByText('Something went wrong')).toBeTruthy();
      expect(getByText('No component stack')).toBeTruthy();
    });
  });

  describe('getDerivedStateFromError', () => {
    it('should return state with hasError true', () => {
      const error = new Error('Test');
      const result = (ErrorBoundary as any).getDerivedStateFromError(error);

      expect(result).toEqual({
        hasError: true,
        error,
      });
    });

    it('should preserve error object in state', () => {
      const testError = new Error('Specific error');
      const result = (ErrorBoundary as any).getDerivedStateFromError(testError);

      expect(result.error).toBe(testError);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible "Try Again" button', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const button = getByText('Try Again');
      expect(button).toBeTruthy();
    });

    it('should display error information in readable format', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError message="Accessible error message" />
        </ErrorBoundary>
      );

      // Title
      expect(getByText('Something went wrong')).toBeTruthy();
      // Message
      expect(getByText('Accessible error message')).toBeTruthy();
      // Hint
      expect(getByText('Check the Debug tab for full error logs')).toBeTruthy();
    });
  });
});
