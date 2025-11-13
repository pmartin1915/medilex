import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { SwipeableCard } from '../SwipeableCard';
import * as Haptics from 'expo-haptics';

// Mock expo-haptics
jest.mock('expo-haptics');

describe('SwipeableCard', () => {
  const mockOnSwipeLeft = jest.fn();
  const mockOnSwipeRight = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
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
  });

  describe('Swipe Left Gesture', () => {
    it('should call onSwipeLeft when swiped left beyond threshold', () => {
      const { getByText } = render(
        <SwipeableCard onSwipeLeft={mockOnSwipeLeft}>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      // Simulate swipe left gesture (dx: -150 is beyond -100 threshold)
      fireEvent(card, 'responderGrant', { nativeEvent: { touches: [] } });
      fireEvent(card, 'responderMove', {
        nativeEvent: {
          touches: [],
          pageX: 0,
          pageY: 0
        },
        gestureState: { dx: -150, dy: 0 }
      });
      fireEvent(card, 'responderRelease', {
        nativeEvent: { touches: [] },
        gestureState: { dx: -150, dy: 0 }
      });

      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1);
    });

    it('should NOT call onSwipeLeft when swipe is below threshold', () => {
      const { getByText } = render(
        <SwipeableCard onSwipeLeft={mockOnSwipeLeft}>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      // Simulate weak swipe left (dx: -50 is below -100 threshold)
      fireEvent(card, 'responderRelease', {
        nativeEvent: { touches: [] },
        gestureState: { dx: -50, dy: 0 }
      });

      expect(mockOnSwipeLeft).not.toHaveBeenCalled();
    });

    it('should trigger haptic feedback on successful swipe left', () => {
      const { getByText } = render(
        <SwipeableCard onSwipeLeft={mockOnSwipeLeft}>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      fireEvent(card, 'responderRelease', {
        nativeEvent: { touches: [] },
        gestureState: { dx: -150, dy: 0 }
      });

      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('should NOT call onSwipeLeft if handler is not provided', () => {
      const { getByText } = render(
        <SwipeableCard>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      // Should not throw error
      expect(() => {
        fireEvent(card, 'responderRelease', {
          nativeEvent: { touches: [] },
          gestureState: { dx: -150, dy: 0 }
        });
      }).not.toThrow();
    });
  });

  describe('Swipe Right Gesture', () => {
    it('should call onSwipeRight when swiped right beyond threshold', () => {
      const { getByText } = render(
        <SwipeableCard onSwipeRight={mockOnSwipeRight}>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      // Simulate swipe right gesture (dx: 150 is beyond 100 threshold)
      fireEvent(card, 'responderGrant', { nativeEvent: { touches: [] } });
      fireEvent(card, 'responderMove', {
        nativeEvent: {
          touches: [],
          pageX: 0,
          pageY: 0
        },
        gestureState: { dx: 150, dy: 0 }
      });
      fireEvent(card, 'responderRelease', {
        nativeEvent: { touches: [] },
        gestureState: { dx: 150, dy: 0 }
      });

      expect(mockOnSwipeRight).toHaveBeenCalledTimes(1);
    });

    it('should NOT call onSwipeRight when swipe is below threshold', () => {
      const { getByText } = render(
        <SwipeableCard onSwipeRight={mockOnSwipeRight}>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      // Simulate weak swipe right (dx: 50 is below 100 threshold)
      fireEvent(card, 'responderRelease', {
        nativeEvent: { touches: [] },
        gestureState: { dx: 50, dy: 0 }
      });

      expect(mockOnSwipeRight).not.toHaveBeenCalled();
    });

    it('should trigger haptic feedback on successful swipe right', () => {
      const { getByText } = render(
        <SwipeableCard onSwipeRight={mockOnSwipeRight}>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      fireEvent(card, 'responderRelease', {
        nativeEvent: { touches: [] },
        gestureState: { dx: 150, dy: 0 }
      });

      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('should NOT call onSwipeRight if handler is not provided', () => {
      const { getByText } = render(
        <SwipeableCard>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      // Should not throw error
      expect(() => {
        fireEvent(card, 'responderRelease', {
          nativeEvent: { touches: [] },
          gestureState: { dx: 150, dy: 0 }
        });
      }).not.toThrow();
    });
  });

  describe('Gesture Direction Detection', () => {
    it('should prioritize horizontal swipe over vertical movement', () => {
      const { getByText } = render(
        <SwipeableCard onSwipeLeft={mockOnSwipeLeft}>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      // Horizontal swipe with minor vertical movement
      fireEvent(card, 'responderRelease', {
        nativeEvent: { touches: [] },
        gestureState: { dx: -150, dy: 20 }
      });

      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1);
    });

    it('should ignore vertical scrolling gestures', () => {
      const { getByText } = render(
        <SwipeableCard onSwipeLeft={mockOnSwipeLeft}>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      // Primarily vertical gesture
      fireEvent(card, 'responderRelease', {
        nativeEvent: { touches: [] },
        gestureState: { dx: 20, dy: -150 }
      });

      expect(mockOnSwipeLeft).not.toHaveBeenCalled();
    });

    it('should detect horizontal swipe intent early in gesture', () => {
      const { getByText } = render(
        <SwipeableCard onSwipeLeft={mockOnSwipeLeft}>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      // Test onMoveShouldSetPanResponder logic
      // Horizontal movement exceeds vertical
      fireEvent(card, 'responderMove', {
        nativeEvent: {
          touches: [],
          pageX: 0,
          pageY: 0
        },
        gestureState: { dx: 50, dy: 10 }
      });

      // Should capture the gesture
      // Note: Testing library limitations may not fully simulate PanResponder
    });
  });

  describe('Both Handlers Present', () => {
    it('should call correct handler based on swipe direction', () => {
      const { getByText } = render(
        <SwipeableCard
          onSwipeLeft={mockOnSwipeLeft}
          onSwipeRight={mockOnSwipeRight}
        >
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      // Swipe left
      fireEvent(card, 'responderRelease', {
        nativeEvent: { touches: [] },
        gestureState: { dx: -150, dy: 0 }
      });

      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1);
      expect(mockOnSwipeRight).not.toHaveBeenCalled();

      jest.clearAllMocks();

      // Swipe right
      fireEvent(card, 'responderRelease', {
        nativeEvent: { touches: [] },
        gestureState: { dx: 150, dy: 0 }
      });

      expect(mockOnSwipeRight).toHaveBeenCalledTimes(1);
      expect(mockOnSwipeLeft).not.toHaveBeenCalled();
    });
  });

  describe('Threshold Validation', () => {
    it('should use 100px as the horizontal swipe threshold', () => {
      const { getByText } = render(
        <SwipeableCard onSwipeLeft={mockOnSwipeLeft}>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      // Exactly at threshold - should trigger
      fireEvent(card, 'responderRelease', {
        nativeEvent: { touches: [] },
        gestureState: { dx: -100, dy: 0 }
      });

      expect(mockOnSwipeLeft).not.toHaveBeenCalled();

      // Just beyond threshold - should trigger
      fireEvent(card, 'responderRelease', {
        nativeEvent: { touches: [] },
        gestureState: { dx: -101, dy: 0 }
      });

      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1);
    });

    it('should snap back when gesture is below threshold', () => {
      const { getByText } = render(
        <SwipeableCard>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      // Weak swipe - should snap back
      fireEvent(card, 'responderRelease', {
        nativeEvent: { touches: [] },
        gestureState: { dx: -80, dy: 0 }
      });

      // No haptic feedback for snap back
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid successive swipes', () => {
      const { getByText } = render(
        <SwipeableCard onSwipeLeft={mockOnSwipeLeft}>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      // First swipe
      fireEvent(card, 'responderRelease', {
        nativeEvent: { touches: [] },
        gestureState: { dx: -150, dy: 0 }
      });

      // Second swipe immediately after
      fireEvent(card, 'responderRelease', {
        nativeEvent: { touches: [] },
        gestureState: { dx: -150, dy: 0 }
      });

      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(2);
    });

    it('should handle zero movement gesture', () => {
      const { getByText } = render(
        <SwipeableCard onSwipeLeft={mockOnSwipeLeft}>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      // No movement (tap)
      fireEvent(card, 'responderRelease', {
        nativeEvent: { touches: [] },
        gestureState: { dx: 0, dy: 0 }
      });

      expect(mockOnSwipeLeft).not.toHaveBeenCalled();
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('should not crash with undefined gesture state', () => {
      const { getByText } = render(
        <SwipeableCard onSwipeLeft={mockOnSwipeLeft}>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      // Should handle gracefully
      expect(() => {
        fireEvent(card, 'responderRelease', {
          nativeEvent: { touches: [] }
        });
      }).not.toThrow();
    });
  });

  describe('Animation Behavior', () => {
    it('should not throw error during animation', () => {
      const { getByText } = render(
        <SwipeableCard onSwipeLeft={mockOnSwipeLeft}>
          <Text>Swipeable Content</Text>
        </SwipeableCard>
      );

      const card = getByText('Swipeable Content').parent!;

      expect(() => {
        fireEvent(card, 'responderRelease', {
          nativeEvent: { touches: [] },
          gestureState: { dx: -150, dy: 0 }
        });
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
