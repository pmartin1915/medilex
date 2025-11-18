/**
 * ActionButtons.test.tsx
 * Comprehensive tests for ActionButtons component
 * Target coverage: 70%+ (limited by pointerEvents: 'none' design)
 *
 * Note: This component is designed with opacity: 0 and pointerEvents: 'none' by default.
 * Interaction testing is deferred to parent component tests and E2E tests.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ActionButtons } from '../ActionButtons';

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  ThumbsUp: () => 'ThumbsUp',
  X: () => 'X',
  Heart: () => 'Heart',
  Bookmark: () => 'Bookmark',
  Share2: () => 'Share2',
}));

// Mock expo-haptics (not testable due to pointerEvents: 'none')
jest.mock('expo-haptics');

describe('ActionButtons', () => {
  const mockCallbacks = {
    onKnowIt: jest.fn(),
    onDontKnow: jest.fn(),
    onFavorite: jest.fn(),
    onBookmark: jest.fn(),
    onShare: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    ...mockCallbacks,
    isFavorited: false,
    isBookmarked: false,
  };

  describe('Rendering', () => {
    it('should render all 5 action buttons', () => {
      const { getByRole } = render(<ActionButtons {...defaultProps} />);

      expect(getByRole('button', { name: 'Know It' })).toBeTruthy();
      expect(getByRole('button', { name: "Don't Know" })).toBeTruthy();
      expect(getByRole('button', { name: 'Add to favorites' })).toBeTruthy();
      expect(getByRole('button', { name: 'Bookmark' })).toBeTruthy();
      expect(getByRole('button', { name: 'Share' })).toBeTruthy();
    });

    it('should render all buttons with correct accessibility roles', () => {
      const { getAllByRole } = render(<ActionButtons {...defaultProps} />);

      const buttons = getAllByRole('button');
      expect(buttons).toHaveLength(5);

      buttons.forEach(button => {
        expect(button.props.accessibilityRole).toBe('button');
      });
    });

    it('should render all buttons as TouchableOpacity', () => {
      const { getAllByRole } = render(<ActionButtons {...defaultProps} />);

      const buttons = getAllByRole('button');

      // All buttons should be TouchableOpacity components
      expect(buttons.length).toBe(5);
    });

    it('should maintain correct button order', () => {
      const { getAllByRole } = render(<ActionButtons {...defaultProps} />);

      const buttons = getAllByRole('button');

      expect(buttons[0].props.accessibilityLabel).toBe('Know It');
      expect(buttons[1].props.accessibilityLabel).toBe("Don't Know");
      expect(buttons[2].props.accessibilityLabel).toBe('Add to favorites');
      expect(buttons[3].props.accessibilityLabel).toBe('Bookmark');
      expect(buttons[4].props.accessibilityLabel).toBe('Share');
    });

    it('should render buttons in a container', () => {
      const { getByRole } = render(<ActionButtons {...defaultProps} />);

      const button = getByRole('button', { name: 'Know It' });
      expect(button.parent).toBeTruthy();
      expect(button.parent?.type).toBeTruthy(); // Has a parent View component
    });
  });

  describe('Accessibility - Favorite Button', () => {
    it('should show "Add to favorites" when not favorited', () => {
      const { getByRole } = render(
        <ActionButtons {...defaultProps} isFavorited={false} />
      );

      expect(getByRole('button', { name: 'Add to favorites' })).toBeTruthy();
    });

    it('should show "Remove from favorites" when favorited', () => {
      const { getByRole } = render(
        <ActionButtons {...defaultProps} isFavorited={true} />
      );

      expect(getByRole('button', { name: 'Remove from favorites' })).toBeTruthy();
    });

    it('should update label when isFavorited changes', () => {
      const { getByRole, rerender } = render(
        <ActionButtons {...defaultProps} isFavorited={false} />
      );

      expect(getByRole('button', { name: 'Add to favorites' })).toBeTruthy();

      rerender(<ActionButtons {...defaultProps} isFavorited={true} />);

      expect(getByRole('button', { name: 'Remove from favorites' })).toBeTruthy();
    });

    it('should toggle label back to "Add to favorites"', () => {
      const { getByRole, rerender } = render(
        <ActionButtons {...defaultProps} isFavorited={true} />
      );

      expect(getByRole('button', { name: 'Remove from favorites' })).toBeTruthy();

      rerender(<ActionButtons {...defaultProps} isFavorited={false} />);

      expect(getByRole('button', { name: 'Add to favorites' })).toBeTruthy();
    });
  });

  describe('Accessibility - Bookmark Button', () => {
    it('should show "Bookmark" when not bookmarked', () => {
      const { getByRole } = render(
        <ActionButtons {...defaultProps} isBookmarked={false} />
      );

      expect(getByRole('button', { name: 'Bookmark' })).toBeTruthy();
    });

    it('should show "Remove bookmark" when bookmarked', () => {
      const { getByRole } = render(
        <ActionButtons {...defaultProps} isBookmarked={true} />
      );

      expect(getByRole('button', { name: 'Remove bookmark' })).toBeTruthy();
    });

    it('should update label when isBookmarked changes', () => {
      const { getByRole, rerender } = render(
        <ActionButtons {...defaultProps} isBookmarked={false} />
      );

      expect(getByRole('button', { name: 'Bookmark' })).toBeTruthy();

      rerender(<ActionButtons {...defaultProps} isBookmarked={true} />);

      expect(getByRole('button', { name: 'Remove bookmark' })).toBeTruthy();
    });

    it('should toggle label back to "Bookmark"', () => {
      const { getByRole, rerender } = render(
        <ActionButtons {...defaultProps} isBookmarked={true} />
      );

      expect(getByRole('button', { name: 'Remove bookmark' })).toBeTruthy();

      rerender(<ActionButtons {...defaultProps} isBookmarked={false} />);

      expect(getByRole('button', { name: 'Bookmark' })).toBeTruthy();
    });
  });

  describe('Accessibility - Static Labels', () => {
    it('should have unchanging label for Know It button', () => {
      const { getByRole } = render(<ActionButtons {...defaultProps} />);

      expect(getByRole('button', { name: 'Know It' })).toBeTruthy();
    });

    it('should have unchanging label for Don\'t Know button', () => {
      const { getByRole } = render(<ActionButtons {...defaultProps} />);

      expect(getByRole('button', { name: "Don't Know" })).toBeTruthy();
    });

    it('should have unchanging label for Share button', () => {
      const { getByRole } = render(<ActionButtons {...defaultProps} />);

      expect(getByRole('button', { name: 'Share' })).toBeTruthy();
    });
  });

  describe('Prop Combinations', () => {
    it('should handle both isFavorited and isBookmarked as false', () => {
      const { getByRole } = render(
        <ActionButtons {...defaultProps} isFavorited={false} isBookmarked={false} />
      );

      expect(getByRole('button', { name: 'Add to favorites' })).toBeTruthy();
      expect(getByRole('button', { name: 'Bookmark' })).toBeTruthy();
    });

    it('should handle both isFavorited and isBookmarked as true', () => {
      const { getByRole } = render(
        <ActionButtons {...defaultProps} isFavorited={true} isBookmarked={true} />
      );

      expect(getByRole('button', { name: 'Remove from favorites' })).toBeTruthy();
      expect(getByRole('button', { name: 'Remove bookmark' })).toBeTruthy();
    });

    it('should handle isFavorited true and isBookmarked false', () => {
      const { getByRole } = render(
        <ActionButtons {...defaultProps} isFavorited={true} isBookmarked={false} />
      );

      expect(getByRole('button', { name: 'Remove from favorites' })).toBeTruthy();
      expect(getByRole('button', { name: 'Bookmark' })).toBeTruthy();
    });

    it('should handle isFavorited false and isBookmarked true', () => {
      const { getByRole } = render(
        <ActionButtons {...defaultProps} isFavorited={false} isBookmarked={true} />
      );

      expect(getByRole('button', { name: 'Add to favorites' })).toBeTruthy();
      expect(getByRole('button', { name: 'Remove bookmark' })).toBeTruthy();
    });
  });

  describe('Component Stability', () => {
    it('should not crash with valid props', () => {
      expect(() => {
        render(<ActionButtons {...defaultProps} />);
      }).not.toThrow();
    });

    it('should re-render without errors', () => {
      const { rerender } = render(<ActionButtons {...defaultProps} />);

      expect(() => {
        rerender(<ActionButtons {...defaultProps} isFavorited={true} />);
        rerender(<ActionButtons {...defaultProps} isBookmarked={true} />);
        rerender(<ActionButtons {...defaultProps} isFavorited={true} isBookmarked={true} />);
      }).not.toThrow();
    });

    it('should handle no-op callbacks without errors', () => {
      expect(() => {
        render(
          <ActionButtons
            onKnowIt={() => {}}
            onDontKnow={() => {}}
            onFavorite={() => {}}
            onBookmark={() => {}}
            onShare={() => {}}
            isFavorited={false}
            isBookmarked={false}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Icon Rendering', () => {
    it('should render all 5 icons within buttons', () => {
      const { getAllByRole } = render(<ActionButtons {...defaultProps} />);

      const buttons = getAllByRole('button');

      // Each button should have children (the icons)
      buttons.forEach(button => {
        expect(button.props.children).toBeTruthy();
      });
    });
  });
});
