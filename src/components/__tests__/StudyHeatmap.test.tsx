import React from 'react';
import { render } from '@testing-library/react-native';
import { StudyHeatmap } from '../StudyHeatmap';

describe('StudyHeatmap', () => {
  // Helper to generate date strings in ISO format
  const getDateString = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };

  describe('Rendering', () => {
    it('should render with title and subtitle', () => {
      const { getByText } = render(<StudyHeatmap studyDates={[]} />);
      expect(getByText('Study Activity')).toBeTruthy();
      expect(getByText('Last 12 weeks')).toBeTruthy();
    });

    it('should render day labels', () => {
      const { getByText, getAllByText } = render(<StudyHeatmap studyDates={[]} />);
      // 'S' appears twice (Sunday and Saturday)
      const sLabels = getAllByText('S');
      expect(sLabels.length).toBe(2);
      expect(getByText('M')).toBeTruthy();
      // 'T' appears twice (Tuesday and Thursday)
      const tLabels = getAllByText('T');
      expect(tLabels.length).toBe(2);
      expect(getByText('W')).toBeTruthy();
      expect(getByText('F')).toBeTruthy();
    });

    it('should render legend with Less and More', () => {
      const { getByText } = render(<StudyHeatmap studyDates={[]} />);
      expect(getByText('Less')).toBeTruthy();
      expect(getByText('More')).toBeTruthy();
    });

    it('should render with empty studyDates array', () => {
      const { getByText } = render(<StudyHeatmap studyDates={[]} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should render with single study date', () => {
      const today = getDateString(0);
      const { getByText } = render(<StudyHeatmap studyDates={[today]} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should render with multiple study dates', () => {
      const dates = [
        getDateString(0),
        getDateString(1),
        getDateString(2),
      ];
      const { getByText } = render(<StudyHeatmap studyDates={dates} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });
  });

  describe('Date Handling', () => {
    it('should handle today as a study date', () => {
      const today = getDateString(0);
      const { getByText } = render(<StudyHeatmap studyDates={[today]} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle yesterday as a study date', () => {
      const yesterday = getDateString(1);
      const { getByText } = render(<StudyHeatmap studyDates={[yesterday]} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle dates from last week', () => {
      const lastWeek = [
        getDateString(7),
        getDateString(8),
        getDateString(9),
      ];
      const { getByText } = render(<StudyHeatmap studyDates={lastWeek} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle dates from 12 weeks ago', () => {
      const dates = [
        getDateString(80),
        getDateString(81),
        getDateString(82),
      ];
      const { getByText } = render(<StudyHeatmap studyDates={dates} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle consecutive study dates (streak)', () => {
      const streak = [
        getDateString(0),
        getDateString(1),
        getDateString(2),
        getDateString(3),
        getDateString(4),
        getDateString(5),
        getDateString(6),
      ];
      const { getByText } = render(<StudyHeatmap studyDates={streak} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle all dates in the 12-week period', () => {
      const allDates = Array.from({ length: 84 }, (_, i) => getDateString(i));
      const { getByText } = render(<StudyHeatmap studyDates={allDates} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty array', () => {
      const { getByText } = render(<StudyHeatmap studyDates={[]} />);
      expect(getByText('Study Activity')).toBeTruthy();
      expect(getByText('Less')).toBeTruthy();
      expect(getByText('More')).toBeTruthy();
    });

    it('should handle dates outside the 12-week window (future)', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      const { getByText } = render(<StudyHeatmap studyDates={[futureDateStr]} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle dates outside the 12-week window (far past)', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 200);
      const oldDateStr = oldDate.toISOString().split('T')[0];

      const { getByText } = render(<StudyHeatmap studyDates={[oldDateStr]} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle duplicate dates', () => {
      const today = getDateString(0);
      const { getByText } = render(<StudyHeatmap studyDates={[today, today, today]} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle dates in random order', () => {
      const dates = [
        getDateString(20),
        getDateString(5),
        getDateString(40),
        getDateString(10),
        getDateString(30),
      ];
      const { getByText } = render(<StudyHeatmap studyDates={dates} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle invalid date format gracefully', () => {
      const { getByText } = render(<StudyHeatmap studyDates={['invalid-date', 'not-a-date']} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle very large array of dates', () => {
      const manyDates = Array.from({ length: 1000 }, (_, i) => getDateString(i % 84));
      const { getByText } = render(<StudyHeatmap studyDates={manyDates} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });
  });

  describe('Specific Patterns', () => {
    it('should handle weekly pattern (every 7 days)', () => {
      const weeklyDates = [
        getDateString(0),
        getDateString(7),
        getDateString(14),
        getDateString(21),
        getDateString(28),
      ];
      const { getByText } = render(<StudyHeatmap studyDates={weeklyDates} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle bi-weekly pattern', () => {
      const biWeeklyDates = [
        getDateString(0),
        getDateString(14),
        getDateString(28),
        getDateString(42),
        getDateString(56),
      ];
      const { getByText } = render(<StudyHeatmap studyDates={biWeeklyDates} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle weekday-only pattern', () => {
      const weekdayDates: string[] = [];
      for (let i = 0; i < 84; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayOfWeek = date.getDay();
        // Only weekdays (1-5)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          weekdayDates.push(date.toISOString().split('T')[0]);
        }
      }
      const { getByText } = render(<StudyHeatmap studyDates={weekdayDates} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle weekend-only pattern', () => {
      const weekendDates: string[] = [];
      for (let i = 0; i < 84; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayOfWeek = date.getDay();
        // Only weekends (0, 6)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          weekendDates.push(date.toISOString().split('T')[0]);
        }
      }
      const { getByText } = render(<StudyHeatmap studyDates={weekendDates} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle sparse activity (1 day per month)', () => {
      const sparseDates = [
        getDateString(0),
        getDateString(30),
        getDateString(60),
      ];
      const { getByText } = render(<StudyHeatmap studyDates={sparseDates} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });
  });

  describe('Component Stability', () => {
    it('should not crash with all props provided', () => {
      const { getByText } = render(<StudyHeatmap studyDates={[]} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle rerenders with same props', () => {
      const dates = [getDateString(0), getDateString(1)];
      const { getByText, rerender } = render(<StudyHeatmap studyDates={dates} />);
      expect(getByText('Study Activity')).toBeTruthy();

      rerender(<StudyHeatmap studyDates={dates} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle prop changes', () => {
      const { getByText, rerender } = render(<StudyHeatmap studyDates={[]} />);
      expect(getByText('Study Activity')).toBeTruthy();

      const newDates = [getDateString(0), getDateString(1), getDateString(2)];
      rerender(<StudyHeatmap studyDates={newDates} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle transition from empty to populated', () => {
      const { getByText, rerender } = render(<StudyHeatmap studyDates={[]} />);
      expect(getByText('Study Activity')).toBeTruthy();

      const populatedDates = Array.from({ length: 30 }, (_, i) => getDateString(i));
      rerender(<StudyHeatmap studyDates={populatedDates} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle transition from populated to empty', () => {
      const populatedDates = Array.from({ length: 30 }, (_, i) => getDateString(i));
      const { getByText, rerender } = render(<StudyHeatmap studyDates={populatedDates} />);
      expect(getByText('Study Activity')).toBeTruthy();

      rerender(<StudyHeatmap studyDates={[]} />);
      expect(getByText('Study Activity')).toBeTruthy();
    });

    it('should handle multiple rapid updates', () => {
      const { getByText, rerender } = render(<StudyHeatmap studyDates={[]} />);

      rerender(<StudyHeatmap studyDates={[getDateString(0)]} />);
      rerender(<StudyHeatmap studyDates={[getDateString(0), getDateString(1)]} />);
      rerender(<StudyHeatmap studyDates={[getDateString(0), getDateString(1), getDateString(2)]} />);

      expect(getByText('Study Activity')).toBeTruthy();
    });
  });
});
