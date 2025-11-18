import React from 'react';
import { render } from '@testing-library/react-native';
import { StreakCalendar } from '../StreakCalendar';

describe('StreakCalendar', () => {
  it('renders correctly with zero streak', () => {
    const { getByText } = render(
      <StreakCalendar streak={0} weekProgress={[false, false, false, false, false, false, false]} />
    );

    expect(getByText('0 Day Streak!')).toBeTruthy();
  });

  it('displays streak number correctly', () => {
    const { getByText } = render(
      <StreakCalendar streak={7} weekProgress={[true, true, true, true, true, true, true]} />
    );

    expect(getByText('7 Day Streak!')).toBeTruthy();
  });

  it('displays all 7 day labels', () => {
    const { getByText } = render(
      <StreakCalendar streak={0} weekProgress={[false, false, false, false, false, false, false]} />
    );

    expect(getByText('M')).toBeTruthy();
    expect(getByText('T')).toBeTruthy();
    expect(getByText('W')).toBeTruthy();
    // Note: There are two 'T's (Tuesday and Thursday) and two 'S's (Saturday and Sunday)
    expect(getByText('F')).toBeTruthy();
    expect(getByText('S')).toBeTruthy();
  });

  it('shows checkmarks for completed days', () => {
    const { getAllByText } = render(
      <StreakCalendar
        streak={3}
        weekProgress={[true, true, true, false, false, false, false]}
      />
    );

    const checkmarks = getAllByText('✓');
    expect(checkmarks.length).toBe(3);
  });

  it('shows no checkmarks when no days completed', () => {
    const { queryByText } = render(
      <StreakCalendar
        streak={0}
        weekProgress={[false, false, false, false, false, false, false]}
      />
    );

    expect(queryByText('✓')).toBeNull();
  });

  it('shows checkmarks for all days when week is complete', () => {
    const { getAllByText } = render(
      <StreakCalendar
        streak={7}
        weekProgress={[true, true, true, true, true, true, true]}
      />
    );

    const checkmarks = getAllByText('✓');
    expect(checkmarks.length).toBe(7);
  });

  it('shows checkmarks only for specific completed days', () => {
    const { getAllByText } = render(
      <StreakCalendar
        streak={4}
        weekProgress={[true, false, true, false, true, false, true]}
      />
    );

    const checkmarks = getAllByText('✓');
    expect(checkmarks.length).toBe(4); // M, W, F, S
  });

  it('displays flame icon', () => {
    const { getByTestId } = render(
      <StreakCalendar streak={5} weekProgress={[true, true, true, true, true, false, false]} />
    );

    expect(getByTestId('icon-Flame')).toBeTruthy();
  });

  it('handles large streak numbers', () => {
    const { getByText } = render(
      <StreakCalendar streak={365} weekProgress={[true, true, true, true, true, true, true]} />
    );

    expect(getByText('365 Day Streak!')).toBeTruthy();
  });

  it('handles single day progress', () => {
    const { getAllByText } = render(
      <StreakCalendar
        streak={1}
        weekProgress={[false, false, false, false, false, false, true]}
      />
    );

    const checkmarks = getAllByText('✓');
    expect(checkmarks.length).toBe(1);
    expect(getByText('1 Day Streak!')).toBeTruthy();
  });

  it('handles midweek progress pattern', () => {
    const { getAllByText } = render(
      <StreakCalendar
        streak={2}
        weekProgress={[false, false, false, true, true, false, false]}
      />
    );

    const checkmarks = getAllByText('✓');
    expect(checkmarks.length).toBe(2); // Thursday and Friday
  });

  it('handles weekend-only progress', () => {
    const { getAllByText } = render(
      <StreakCalendar
        streak={2}
        weekProgress={[false, false, false, false, false, true, true]}
      />
    );

    const checkmarks = getAllByText('✓');
    expect(checkmarks.length).toBe(2); // Saturday and Sunday
  });

  it('renders with empty weekProgress array', () => {
    const { queryByText } = render(
      <StreakCalendar streak={0} weekProgress={[]} />
    );

    expect(queryByText('✓')).toBeNull();
    expect(queryByText('0 Day Streak!')).toBeTruthy();
  });

  it('displays correct text format for streak', () => {
    const { getByText } = render(
      <StreakCalendar streak={15} weekProgress={[true, true, true, true, true, false, false]} />
    );

    // Verify exact text format
    expect(getByText('15 Day Streak!')).toBeTruthy();
  });
});
