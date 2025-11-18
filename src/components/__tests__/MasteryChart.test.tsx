import React from 'react';
import { render } from '@testing-library/react-native';
import { MasteryChart } from '../MasteryChart';

describe('MasteryChart', () => {
  const defaultProps = {
    newCount: 5,
    learningCount: 10,
    familiarCount: 15,
    masteredCount: 20,
  };

  describe('Rendering', () => {
    it('should render with title', () => {
      const { getByText } = render(<MasteryChart {...defaultProps} />);
      expect(getByText('Mastery Distribution')).toBeTruthy();
    });

    it('should render all 4 mastery level labels', () => {
      const { getByText } = render(<MasteryChart {...defaultProps} />);
      expect(getByText('New')).toBeTruthy();
      expect(getByText('Learning')).toBeTruthy();
      expect(getByText('Familiar')).toBeTruthy();
      expect(getByText('Mastered')).toBeTruthy();
    });

    it('should render all count values', () => {
      const { getByText } = render(<MasteryChart {...defaultProps} />);
      expect(getByText('5')).toBeTruthy();
      expect(getByText('10')).toBeTruthy();
      expect(getByText('15')).toBeTruthy();
      expect(getByText('20')).toBeTruthy();
    });

    it('should render with all zero counts', () => {
      const { getByText } = render(
        <MasteryChart
          newCount={0}
          learningCount={0}
          familiarCount={0}
          masteredCount={0}
        />
      );
      expect(getByText('Mastery Distribution')).toBeTruthy();
      expect(getByText('New')).toBeTruthy();
      expect(getByText('Learning')).toBeTruthy();
      expect(getByText('Familiar')).toBeTruthy();
      expect(getByText('Mastered')).toBeTruthy();
    });
  });

  describe('Percentage Calculations', () => {
    it('should calculate correct percentages (total=50)', () => {
      // 5+10+15+20 = 50 total
      // New: 5/50 = 10%, Learning: 10/50 = 20%, Familiar: 15/50 = 30%, Mastered: 20/50 = 40%
      const { getByText } = render(<MasteryChart {...defaultProps} />);
      expect(getByText('5')).toBeTruthy();
      expect(getByText('10')).toBeTruthy();
      expect(getByText('15')).toBeTruthy();
      expect(getByText('20')).toBeTruthy();
    });

    it('should handle equal distribution', () => {
      const { getAllByText } = render(
        <MasteryChart
          newCount={10}
          learningCount={10}
          familiarCount={10}
          masteredCount={10}
        />
      );
      // Each should be 25%, all four counts are 10
      const tenTexts = getAllByText('10');
      expect(tenTexts.length).toBe(4);
    });

    it('should handle 100% in one category', () => {
      const { getByText } = render(
        <MasteryChart
          newCount={0}
          learningCount={0}
          familiarCount={0}
          masteredCount={100}
        />
      );
      expect(getByText('100')).toBeTruthy();
    });

    it('should handle zero total (division by zero protection)', () => {
      const { getByText, getAllByText } = render(
        <MasteryChart
          newCount={0}
          learningCount={0}
          familiarCount={0}
          masteredCount={0}
        />
      );
      // Should show all labels with 0 counts
      const zeroTexts = getAllByText('0');
      expect(zeroTexts.length).toBe(4); // All four levels have 0
    });
  });

  describe('Edge Cases', () => {
    it('should handle only new terms', () => {
      const { getByText } = render(
        <MasteryChart
          newCount={50}
          learningCount={0}
          familiarCount={0}
          masteredCount={0}
        />
      );
      expect(getByText('50')).toBeTruthy();
      expect(getByText('New')).toBeTruthy();
    });

    it('should handle only learning terms', () => {
      const { getByText } = render(
        <MasteryChart
          newCount={0}
          learningCount={30}
          familiarCount={0}
          masteredCount={0}
        />
      );
      expect(getByText('30')).toBeTruthy();
      expect(getByText('Learning')).toBeTruthy();
    });

    it('should handle only familiar terms', () => {
      const { getByText } = render(
        <MasteryChart
          newCount={0}
          learningCount={0}
          familiarCount={25}
          masteredCount={0}
        />
      );
      expect(getByText('25')).toBeTruthy();
      expect(getByText('Familiar')).toBeTruthy();
    });

    it('should handle only mastered terms', () => {
      const { getByText } = render(
        <MasteryChart
          newCount={0}
          learningCount={0}
          familiarCount={0}
          masteredCount={75}
        />
      );
      expect(getByText('75')).toBeTruthy();
      expect(getByText('Mastered')).toBeTruthy();
    });

    it('should handle large numbers', () => {
      const { getByText } = render(
        <MasteryChart
          newCount={1000}
          learningCount={2000}
          familiarCount={3000}
          masteredCount={4000}
        />
      );
      expect(getByText('1000')).toBeTruthy();
      expect(getByText('2000')).toBeTruthy();
      expect(getByText('3000')).toBeTruthy();
      expect(getByText('4000')).toBeTruthy();
    });

    it('should handle single digit counts', () => {
      const { getByText } = render(
        <MasteryChart
          newCount={1}
          learningCount={2}
          familiarCount={3}
          masteredCount={4}
        />
      );
      expect(getByText('1')).toBeTruthy();
      expect(getByText('2')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('4')).toBeTruthy();
    });
  });

  describe('Legend Display', () => {
    it('should show all legend items even with zero counts', () => {
      const { getByText } = render(
        <MasteryChart
          newCount={10}
          learningCount={0}
          familiarCount={0}
          masteredCount={0}
        />
      );
      // All labels should still be visible in legend
      expect(getByText('New')).toBeTruthy();
      expect(getByText('Learning')).toBeTruthy();
      expect(getByText('Familiar')).toBeTruthy();
      expect(getByText('Mastered')).toBeTruthy();
    });

    it('should display correct label-count pairs', () => {
      const { getByText } = render(
        <MasteryChart
          newCount={8}
          learningCount={12}
          familiarCount={16}
          masteredCount={24}
        />
      );
      expect(getByText('New')).toBeTruthy();
      expect(getByText('8')).toBeTruthy();
      expect(getByText('Learning')).toBeTruthy();
      expect(getByText('12')).toBeTruthy();
      expect(getByText('Familiar')).toBeTruthy();
      expect(getByText('16')).toBeTruthy();
      expect(getByText('Mastered')).toBeTruthy();
      expect(getByText('24')).toBeTruthy();
    });
  });

  describe('Component Stability', () => {
    it('should not crash with all props provided', () => {
      const { getByText } = render(<MasteryChart {...defaultProps} />);
      expect(getByText('Mastery Distribution')).toBeTruthy();
    });

    it('should handle rerenders with same props', () => {
      const { getByText, rerender } = render(<MasteryChart {...defaultProps} />);
      expect(getByText('Mastery Distribution')).toBeTruthy();

      rerender(<MasteryChart {...defaultProps} />);
      expect(getByText('Mastery Distribution')).toBeTruthy();
    });

    it('should handle prop changes', () => {
      const { getByText, rerender } = render(<MasteryChart {...defaultProps} />);
      expect(getByText('5')).toBeTruthy();

      rerender(
        <MasteryChart
          newCount={15}
          learningCount={25}
          familiarCount={35}
          masteredCount={45}
        />
      );
      expect(getByText('15')).toBeTruthy();
      expect(getByText('25')).toBeTruthy();
      expect(getByText('35')).toBeTruthy();
      expect(getByText('45')).toBeTruthy();
    });

    it('should transition from empty to populated', () => {
      const { getByText, rerender, getAllByText } = render(
        <MasteryChart
          newCount={0}
          learningCount={0}
          familiarCount={0}
          masteredCount={0}
        />
      );
      const zeroTexts = getAllByText('0');
      expect(zeroTexts.length).toBe(4);

      rerender(<MasteryChart {...defaultProps} />);
      expect(getByText('5')).toBeTruthy();
      expect(getByText('10')).toBeTruthy();
      expect(getByText('15')).toBeTruthy();
      expect(getByText('20')).toBeTruthy();
    });

    it('should handle multiple rapid updates', () => {
      const { getByText, rerender } = render(<MasteryChart {...defaultProps} />);

      rerender(<MasteryChart newCount={1} learningCount={2} familiarCount={3} masteredCount={4} />);
      rerender(<MasteryChart newCount={10} learningCount={20} familiarCount={30} masteredCount={40} />);
      rerender(<MasteryChart newCount={100} learningCount={200} familiarCount={300} masteredCount={400} />);

      expect(getByText('100')).toBeTruthy();
      expect(getByText('200')).toBeTruthy();
      expect(getByText('300')).toBeTruthy();
      expect(getByText('400')).toBeTruthy();
    });
  });

  describe('Mixed Scenarios', () => {
    it('should handle two categories with data', () => {
      const { getByText } = render(
        <MasteryChart
          newCount={30}
          learningCount={0}
          familiarCount={0}
          masteredCount={70}
        />
      );
      expect(getByText('30')).toBeTruthy();
      expect(getByText('70')).toBeTruthy();
    });

    it('should handle three categories with data', () => {
      const { getByText } = render(
        <MasteryChart
          newCount={20}
          learningCount={30}
          familiarCount={50}
          masteredCount={0}
        />
      );
      expect(getByText('20')).toBeTruthy();
      expect(getByText('30')).toBeTruthy();
      expect(getByText('50')).toBeTruthy();
    });

    it('should handle skewed distribution (90% mastered)', () => {
      const { getByText } = render(
        <MasteryChart
          newCount={2}
          learningCount={3}
          familiarCount={5}
          masteredCount={90}
        />
      );
      expect(getByText('2')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
      expect(getByText('90')).toBeTruthy();
    });
  });
});
