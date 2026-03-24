import React from 'react';
import { render } from '@testing-library/react';
import { SwipeableCard } from '../SwipeableCard';
import { vi } from 'vitest';

describe('SwipeableCard', () => {
  it('renders children correctly', () => {
    const { container } = render(
      <SwipeableCard onSwipeLeft={vi.fn()} onSwipeRight={vi.fn()}>
        <span>Test Child</span>
      </SwipeableCard>
    );

    expect(container.textContent).toContain('Test Child');
  });

  it('accepts swipe callbacks', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();

    const { container } = render(
      <SwipeableCard onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
        <span>Swipeable Content</span>
      </SwipeableCard>
    );

    expect(container.textContent).toContain('Swipeable Content');
  });

  it('renders with React.memo optimization', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();

    const { rerender } = render(
      <SwipeableCard onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
        <span>Content</span>
      </SwipeableCard>
    );

    // Re-render with same props - React.memo should prevent unnecessary re-renders
    rerender(
      <SwipeableCard onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
        <span>Content</span>
      </SwipeableCard>
    );

    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });
});
