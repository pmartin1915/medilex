import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { SwipeableCard } from '../SwipeableCard';
import * as Haptics from 'expo-haptics';

// Mock expo-haptics
jest.mock('expo-haptics');

/**
 * NOTE ON GESTURE TESTING:
 *
 * PanResponder gesture simulation in Jest/RTL is extremely complex due to:
 * - Internal state machine of PanResponder
 * - Animated.Value interactions
 * - Event lifecycle dependencies
 *
 * Full gesture integration testing is covered by:
 * - Maestro E2E tests (Phase 2) - Real device/emulator testing
 * - Manual QA (Phase 8) - Real user interaction testing
 *
 * Unit tests here focus on:
 * - Component rendering
 * - Props handling
 * - Component structure
 */

describe('SwipeableCard', () => {
  const mockOnSwipeLeft = jest.fn();
  const mockOnSwipeRight = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering & Structure', () => {
    it('should render children correctly', () => {
      const { getByText } = render(
        <SwipeableCard>
          <Text>Test Content</Text>
        </SwipeableCard>
      );

      expect(getByText('Test Content')).toBeTruthy();
    });

    it('should render multiple children', () => {
      const { getByText } = render(
        <SwipeableCard>
          <View>
            <Text>First Child</Text>
            <Text>Second Child</Text>
          </View>
        </SwipeableCard>
      );

      expect(getByText('First Child')).toBeTruthy();
      expect(getByText('Second Child')).toBeTruthy();
    });

    it('should accept onSwipeLeft prop without error', () => {
      expect(() => {
        render(
          <SwipeableCard onSwipeLeft={mockOnSwipeLeft}>
            <Text>Content</Text>
          </SwipeableCard>
        );
      }).not.toThrow();
    });

    it('should accept onSwipeRight prop without error', () => {
      expect(() => {
        render(
          <SwipeableCard onSwipeRight={mockOnSwipeRight}>
            <Text>Content</Text>
          </SwipeableCard>
        );
      }).not.toThrow();
    });

    it('should accept both onSwipeLeft and onSwipeRight props', () => {
      expect(() => {
        render(
          <SwipeableCard
            onSwipeLeft={mockOnSwipeLeft}
            onSwipeRight={mockOnSwipeRight}
          >
            <Text>Content</Text>
          </SwipeableCard>
        );
      }).not.toThrow();
    });

    it('should work without any swipe handlers', () => {
      expect(() => {
        render(
          <SwipeableCard>
            <Text>Content</Text>
          </SwipeableCard>
        );
      }).not.toThrow();
    });
  });

  describe('Props Validation', () => {
    it('should render with complex child components', () => {
      const { getByText } = render(
        <SwipeableCard>
          <View>
            <Text>Title</Text>
            <View>
              <Text>Nested Content</Text>
            </View>
          </View>
        </SwipeableCard>
      );

      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Nested Content')).toBeTruthy();
    });

    it('should accept and store callback references', () => {
      const leftHandler = jest.fn();
      const rightHandler = jest.fn();

      const { rerender } = render(
        <SwipeableCard
          onSwipeLeft={leftHandler}
          onSwipeRight={rightHandler}
        >
          <Text>Content</Text>
        </SwipeableCard>
      );

      // Verify component doesn't crash with callbacks
      expect(() => {
        rerender(
          <SwipeableCard
            onSwipeLeft={leftHandler}
            onSwipeRight={rightHandler}
          >
            <Text>Updated Content</Text>
          </SwipeableCard>
        );
      }).not.toThrow();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot with default props', () => {
      const { toJSON } = render(
        <SwipeableCard>
          <Text>Test Content</Text>
        </SwipeableCard>
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with both swipe handlers', () => {
      const { toJSON } = render(
        <SwipeableCard
          onSwipeLeft={mockOnSwipeLeft}
          onSwipeRight={mockOnSwipeRight}
        >
          <Text>Test Content</Text>
        </SwipeableCard>
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
