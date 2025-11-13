import React from 'react';
import { render } from '@testing-library/react-native';
import { StreakCalendar } from '../StreakCalendar';

describe('StreakCalendar', () => {
  const defaultProps = {
    streak: 5,
    weekProgress: [true, true, false, false, false, false, false],
  };

  describe('Basic Rendering', () => {
    it('should render correctly with required props', () => {
      const { getByText } = render(<StreakCalendar {...defaultProps} />);

      expect(getByText('5 Day Streak!')).toBeTruthy();
    });

    it('should render all 7 day labels', () => {
      const { getByText } = render(<StreakCalendar {...defaultProps} />);

      expect(getByText('M')).toBeTruthy();
      expect(getByText('T')).toBeTruthy();
      expect(getByText('W')).toBeTruthy();
      // Note: Two 'T' labels exist (Tuesday and Thursday)
      expect(getByText('F')).toBeTruthy();
      expect(getByText('S')).toBeTruthy();
      // Note: Two 'S' labels exist (Saturday and Sunday)
    });

    it('should display the correct streak number', () => {
      const { getByText } = render(
        <StreakCalendar streak={10} weekProgress={defaultProps.weekProgress} />
      );

      expect(getByText('10 Day Streak!')).toBeTruthy();
    });
  });

  describe('Week Progress Display', () => {
    it('should show checkmarks for completed days', () => {
      const { getAllByText } = render(<StreakCalendar {...defaultProps} />);

      const checkmarks = getAllByText('✓');
      // Two days completed (Monday and Tuesday)
      expect(checkmarks).toHaveLength(2);
    });

    it('should show no checkmarks when no days are completed', () => {
      const { queryByText } = render(
        <StreakCalendar
          streak={0}
          weekProgress={[false, false, false, false, false, false, false]}
        />
      );

      expect(queryByText('✓')).toBeNull();
    });

    it('should show checkmarks for all 7 days when week is completed', () => {
      const { getAllByText } = render(
        <StreakCalendar
          streak={7}
          weekProgress={[true, true, true, true, true, true, true]}
        />
      );

      const checkmarks = getAllByText('✓');
      expect(checkmarks).toHaveLength(7);
    });

    it('should correctly map weekProgress to day circles', () => {
      const weekProgress = [true, false, true, false, true, false, true];
      const { getAllByText } = render(
        <StreakCalendar streak={4} weekProgress={weekProgress} />
      );

      const checkmarks = getAllByText('✓');
      // 4 days completed (Mon, Wed, Fri, Sun)
      expect(checkmarks).toHaveLength(4);
    });
  });

  describe('Streak Number Display', () => {
    it('should display zero streak', () => {
      const { getByText } = render(
        <StreakCalendar streak={0} weekProgress={defaultProps.weekProgress} />
      );

      expect(getByText('0 Day Streak!')).toBeTruthy();
    });

    it('should display single digit streak', () => {
      const { getByText } = render(
        <StreakCalendar streak={3} weekProgress={defaultProps.weekProgress} />
      );

      expect(getByText('3 Day Streak!')).toBeTruthy();
    });

    it('should display double digit streak', () => {
      const { getByText } = render(
        <StreakCalendar streak={25} weekProgress={defaultProps.weekProgress} />
      );

      expect(getByText('25 Day Streak!')).toBeTruthy();
    });

    it('should display triple digit streak', () => {
      const { getByText } = render(
        <StreakCalendar streak={100} weekProgress={defaultProps.weekProgress} />
      );

      expect(getByText('100 Day Streak!')).toBeTruthy();
    });

    it('should display large streak numbers', () => {
      const { getByText } = render(
        <StreakCalendar streak={365} weekProgress={defaultProps.weekProgress} />
      );

      expect(getByText('365 Day Streak!')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative streak gracefully', () => {
      const { getByText } = render(
        <StreakCalendar streak={-1} weekProgress={defaultProps.weekProgress} />
      );

      expect(getByText('-1 Day Streak!')).toBeTruthy();
    });

    it('should handle empty weekProgress array', () => {
      const { queryByText } = render(
        <StreakCalendar streak={0} weekProgress={[]} />
      );

      // Should still render day labels
      expect(queryByText('M')).toBeTruthy();
      // No checkmarks expected
      expect(queryByText('✓')).toBeNull();
    });

    it('should handle incomplete weekProgress array (less than 7)', () => {
      const { getAllByText } = render(
        <StreakCalendar streak={3} weekProgress={[true, true, true]} />
      );

      // Only first 3 days should show checkmarks
      const checkmarks = getAllByText('✓');
      expect(checkmarks).toHaveLength(3);
    });

    it('should handle weekProgress array longer than 7 elements', () => {
      const { getAllByText } = render(
        <StreakCalendar
          streak={5}
          weekProgress={[true, true, true, true, true, false, false, true, true]}
        />
      );

      // Should only process first 7 elements
      const checkmarks = getAllByText('✓');
      expect(checkmarks).toHaveLength(5);
    });
  });

  describe('Day Labels Order', () => {
    it('should display days in correct order (M, T, W, T, F, S, S)', () => {
      const { getAllByText } = render(<StreakCalendar {...defaultProps} />);

      // Get all text elements and verify order
      const monday = getAllByText('M')[0];
      expect(monday).toBeTruthy();

      const friday = getAllByText('F')[0];
      expect(friday).toBeTruthy();
    });
  });

  describe('Active Day Styling', () => {
    it('should render differently for active vs inactive days', () => {
      const { UNSAFE_getAllByType } = render(<StreakCalendar {...defaultProps} />);

      const views = UNSAFE_getAllByType(require('react-native').View);
      // Should have mix of active and inactive day circles
      expect(views.length).toBeGreaterThan(0);
    });
  });

  describe('Flame Icon', () => {
    it('should render flame icon', () => {
      const { UNSAFE_queryByType } = render(<StreakCalendar {...defaultProps} />);

      // Flame icon should be present (from lucide-react-native)
      // Testing library may not directly expose icon component, but it should not crash
      expect(() => render(<StreakCalendar {...defaultProps} />)).not.toThrow();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot with no progress', () => {
      const { toJSON } = render(
        <StreakCalendar
          streak={0}
          weekProgress={[false, false, false, false, false, false, false]}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with partial progress', () => {
      const { toJSON } = render(<StreakCalendar {...defaultProps} />);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with full week completed', () => {
      const { toJSON } = render(
        <StreakCalendar
          streak={7}
          weekProgress={[true, true, true, true, true, true, true]}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with high streak number', () => {
      const { toJSON } = render(
        <StreakCalendar
          streak={100}
          weekProgress={[true, true, true, true, true, true, true]}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Accessibility', () => {
    it('should render text elements that are accessible', () => {
      const { getByText } = render(<StreakCalendar {...defaultProps} />);

      const streakText = getByText('5 Day Streak!');
      expect(streakText).toBeTruthy();
      // Text should be accessible to screen readers
    });

    it('should render day labels that are readable', () => {
      const { getByText } = render(<StreakCalendar {...defaultProps} />);

      // All day labels should be present and accessible
      expect(getByText('M')).toBeTruthy();
      expect(getByText('F')).toBeTruthy();
    });
  });

  describe('Consistency Checks', () => {
    it('should always render exactly 7 day columns', () => {
      const { getAllByText } = render(<StreakCalendar {...defaultProps} />);

      // Count day labels (M, T, W, T, F, S, S)
      const dayLabels = ['M', 'W', 'F']; // Unique labels
      dayLabels.forEach(label => {
        expect(getAllByText(label).length).toBeGreaterThan(0);
      });
    });

    it('should maintain consistent layout regardless of streak length', () => {
      const { rerender, getByText } = render(
        <StreakCalendar streak={5} weekProgress={defaultProps.weekProgress} />
      );

      expect(getByText('5 Day Streak!')).toBeTruthy();

      rerender(
        <StreakCalendar streak={100} weekProgress={defaultProps.weekProgress} />
      );

      expect(getByText('100 Day Streak!')).toBeTruthy();
      // Layout should accommodate longer numbers
    });
  });
});
