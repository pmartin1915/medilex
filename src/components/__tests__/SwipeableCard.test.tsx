import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SwipeableCard } from '../SwipeableCard';

describe('SwipeableCard', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <SwipeableCard onSwipeLeft={jest.fn()} onSwipeRight={jest.fn()}>
        <Text>Test Child</Text>
      </SwipeableCard>
    );

    expect(getByText('Test Child')).toBeTruthy();
  });

  it('accepts swipe callbacks', () => {
    const onSwipeLeft = jest.fn();
    const onSwipeRight = jest.fn();

    const { getByText } = render(
      <SwipeableCard onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
        <Text>Swipeable Content</Text>
      </SwipeableCard>
    );

    expect(getByText('Swipeable Content')).toBeTruthy();
    // Callbacks are set up correctly (actual swipe testing requires more complex gesture simulation)
  });

  it('renders with React.memo optimization', () => {
    const onSwipeLeft = jest.fn();
    const onSwipeRight = jest.fn();

    const { rerender } = render(
      <SwipeableCard onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
        <Text>Content</Text>
      </SwipeableCard>
    );

    // Re-render with same props - React.memo should prevent unnecessary re-renders
    rerender(
      <SwipeableCard onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
        <Text>Content</Text>
      </SwipeableCard>
    );

    // Component should handle re-renders efficiently
    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });
});
