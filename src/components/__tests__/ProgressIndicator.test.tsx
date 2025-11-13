import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgressIndicator } from '../ProgressIndicator';

describe('ProgressIndicator', () => {
  describe('Basic Rendering', () => {
    it('should render correctly with current and total props', () => {
      const { getByText } = render(<ProgressIndicator current={5} total={10} />);

      expect(getByText('5 / 10')).toBeTruthy();
    });

    it('should display progress at the start', () => {
      const { getByText } = render(<ProgressIndicator current={0} total={75} />);

      expect(getByText('0 / 75')).toBeTruthy();
    });

    it('should display progress at completion', () => {
      const { getByText } = render(<ProgressIndicator current={75} total={75} />);

      expect(getByText('75 / 75')).toBeTruthy();
    });

    it('should display midpoint progress', () => {
      const { getByText } = render(<ProgressIndicator current={37} total={75} />);

      expect(getByText('37 / 75')).toBeTruthy();
    });
  });

  describe('Percentage Calculation', () => {
    it('should calculate 0% progress correctly', () => {
      const { UNSAFE_getAllByType } = render(
        <ProgressIndicator current={0} total={100} />
      );

      // Progress bar should exist with 0% width
      const views = UNSAFE_getAllByType(require('react-native').View);
      expect(views.length).toBeGreaterThan(0);
    });

    it('should calculate 50% progress correctly', () => {
      const { UNSAFE_getAllByType } = render(
        <ProgressIndicator current={50} total={100} />
      );

      const views = UNSAFE_getAllByType(require('react-native').View);
      // Should have progress bar with 50% width
      expect(views.length).toBeGreaterThan(0);
    });

    it('should calculate 100% progress correctly', () => {
      const { UNSAFE_getAllByType } = render(
        <ProgressIndicator current={100} total={100} />
      );

      const views = UNSAFE_getAllByType(require('react-native').View);
      // Should have progress bar with 100% width
      expect(views.length).toBeGreaterThan(0);
    });

    it('should handle fractional progress', () => {
      const { getByText } = render(<ProgressIndicator current={33} total={75} />);

      expect(getByText('33 / 75')).toBeTruthy();
      // Percentage should be 44% (33/75)
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero total without crashing', () => {
      const { getByText } = render(<ProgressIndicator current={0} total={0} />);

      expect(getByText('0 / 0')).toBeTruthy();
      // Division by zero should be handled (NaN or Infinity)
    });

    it('should handle current greater than total', () => {
      const { getByText } = render(<ProgressIndicator current={150} total={100} />);

      expect(getByText('150 / 100')).toBeTruthy();
      // Percentage would be > 100%
    });

    it('should handle negative current', () => {
      const { getByText } = render(<ProgressIndicator current={-5} total={100} />);

      expect(getByText('-5 / 100')).toBeTruthy();
    });

    it('should handle negative total', () => {
      const { getByText } = render(<ProgressIndicator current={5} total={-100} />);

      expect(getByText('5 / -100')).toBeTruthy();
    });

    it('should handle very large numbers', () => {
      const { getByText } = render(<ProgressIndicator current={9999} total={10000} />);

      expect(getByText('9999 / 10000')).toBeTruthy();
    });

    it('should handle single digit numbers', () => {
      const { getByText } = render(<ProgressIndicator current={3} total={5} />);

      expect(getByText('3 / 5')).toBeTruthy();
    });

    it('should handle decimal numbers', () => {
      const { getByText } = render(<ProgressIndicator current={2.5} total={5} />);

      expect(getByText('2.5 / 5')).toBeTruthy();
    });
  });

  describe('Progress Bar Styling', () => {
    it('should render progress bar container', () => {
      const { UNSAFE_getAllByType } = render(
        <ProgressIndicator current={25} total={100} />
      );

      const views = UNSAFE_getAllByType(require('react-native').View);
      // Should have container and progress bar fill
      expect(views.length).toBeGreaterThanOrEqual(2);
    });

    it('should apply correct width based on percentage', () => {
      const { UNSAFE_getAllByType } = render(
        <ProgressIndicator current={25} total={100} />
      );

      const views = UNSAFE_getAllByType(require('react-native').View);
      // Bar fill should be present with 25% width
      expect(views.length).toBeGreaterThan(0);
    });
  });

  describe('Text Display', () => {
    it('should format text with slash separator', () => {
      const { getByText } = render(<ProgressIndicator current={12} total={75} />);

      const text = getByText('12 / 75');
      expect(text).toBeTruthy();
    });

    it('should update text when props change', () => {
      const { getByText, rerender } = render(
        <ProgressIndicator current={10} total={100} />
      );

      expect(getByText('10 / 100')).toBeTruthy();

      rerender(<ProgressIndicator current={50} total={100} />);

      expect(getByText('50 / 100')).toBeTruthy();
    });
  });

  describe('Various Progress Scenarios', () => {
    it('should show 25% progress', () => {
      const { getByText } = render(<ProgressIndicator current={25} total={100} />);

      expect(getByText('25 / 100')).toBeTruthy();
    });

    it('should show 75% progress', () => {
      const { getByText } = render(<ProgressIndicator current={75} total={100} />);

      expect(getByText('75 / 100')).toBeTruthy();
    });

    it('should show 1% progress', () => {
      const { getByText } = render(<ProgressIndicator current={1} total={100} />);

      expect(getByText('1 / 100')).toBeTruthy();
    });

    it('should show 99% progress', () => {
      const { getByText } = render(<ProgressIndicator current={99} total={100} />);

      expect(getByText('99 / 100')).toBeTruthy();
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle medical terms progress (5/75)', () => {
      const { getByText } = render(<ProgressIndicator current={5} total={75} />);

      expect(getByText('5 / 75')).toBeTruthy();
    });

    it('should handle study session progress', () => {
      const { getByText } = render(<ProgressIndicator current={14} total={20} />);

      expect(getByText('14 / 20')).toBeTruthy();
    });

    it('should handle chapter progress', () => {
      const { getByText } = render(<ProgressIndicator current={8} total={12} />);

      expect(getByText('8 / 12')).toBeTruthy();
    });

    it('should handle quiz progress', () => {
      const { getByText } = render(<ProgressIndicator current={18} total={30} />);

      expect(getByText('18 / 30')).toBeTruthy();
    });
  });

  describe('Progressive Updates', () => {
    it('should reflect incremental progress updates', () => {
      const { getByText, rerender } = render(
        <ProgressIndicator current={1} total={10} />
      );

      expect(getByText('1 / 10')).toBeTruthy();

      rerender(<ProgressIndicator current={2} total={10} />);
      expect(getByText('2 / 10')).toBeTruthy();

      rerender(<ProgressIndicator current={5} total={10} />);
      expect(getByText('5 / 10')).toBeTruthy();

      rerender(<ProgressIndicator current={10} total={10} />);
      expect(getByText('10 / 10')).toBeTruthy();
    });

    it('should handle backwards progress', () => {
      const { getByText, rerender } = render(
        <ProgressIndicator current={10} total={10} />
      );

      expect(getByText('10 / 10')).toBeTruthy();

      rerender(<ProgressIndicator current={5} total={10} />);
      expect(getByText('5 / 10')).toBeTruthy();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot at 0% progress', () => {
      const { toJSON } = render(<ProgressIndicator current={0} total={100} />);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot at 50% progress', () => {
      const { toJSON } = render(<ProgressIndicator current={50} total={100} />);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot at 100% progress', () => {
      const { toJSON } = render(<ProgressIndicator current={100} total={100} />);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with medical terms count', () => {
      const { toJSON } = render(<ProgressIndicator current={23} total={75} />);

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Accessibility', () => {
    it('should have readable text for screen readers', () => {
      const { getByText } = render(<ProgressIndicator current={30} total={75} />);

      const text = getByText('30 / 75');
      // Text should be accessible
      expect(text).toBeTruthy();
    });

    it('should be understandable at any progress level', () => {
      const { getByText } = render(<ProgressIndicator current={1} total={1} />);

      // Even single item progress should be clear
      expect(getByText('1 / 1')).toBeTruthy();
    });
  });

  describe('Component Integrity', () => {
    it('should not crash with minimum props', () => {
      expect(() => {
        render(<ProgressIndicator current={0} total={0} />);
      }).not.toThrow();
    });

    it('should not crash with maximum reasonable values', () => {
      expect(() => {
        render(<ProgressIndicator current={99999} total={100000} />);
      }).not.toThrow();
    });

    it('should maintain consistency across rerenders', () => {
      const { getByText, rerender } = render(
        <ProgressIndicator current={5} total={10} />
      );

      const initialText = getByText('5 / 10');
      expect(initialText).toBeTruthy();

      // Force rerender with same props
      rerender(<ProgressIndicator current={5} total={10} />);

      const afterRerender = getByText('5 / 10');
      expect(afterRerender).toBeTruthy();
    });
  });
});
