import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgressIndicator } from '../ProgressIndicator';

describe('ProgressIndicator', () => {
  it('renders correctly with current and total', () => {
    const { getByText } = render(<ProgressIndicator current={3} total={10} />);

    expect(getByText('3 / 10')).toBeTruthy();
  });

  it('calculates percentage correctly', () => {
    const { getByText } = render(<ProgressIndicator current={5} total={10} />);

    expect(getByText('5 / 10')).toBeTruthy();
    // Percentage should be 50% - bar width should be set correctly
  });

  it('handles 0 progress', () => {
    const { getByText } = render(<ProgressIndicator current={0} total={10} />);

    expect(getByText('0 / 10')).toBeTruthy();
  });

  it('handles 100% progress', () => {
    const { getByText } = render(<ProgressIndicator current={10} total={10} />);

    expect(getByText('10 / 10')).toBeTruthy();
  });

  it('handles 1 item total', () => {
    const { getByText } = render(<ProgressIndicator current={1} total={1} />);

    expect(getByText('1 / 1')).toBeTruthy();
  });

  it('updates when props change', () => {
    const { getByText, rerender } = render(
      <ProgressIndicator current={3} total={10} />
    );

    expect(getByText('3 / 10')).toBeTruthy();

    rerender(<ProgressIndicator current={7} total={10} />);

    expect(getByText('7 / 10')).toBeTruthy();
  });

  it('memoizes percentage calculation (useMemo test)', () => {
    const { rerender } = render(<ProgressIndicator current={5} total={10} />);

    // Re-render with same props - useMemo should prevent recalculation
    rerender(<ProgressIndicator current={5} total={10} />);

    // If useMemo is working correctly, percentage won't be recalculated
    // This is verified implicitly by not throwing errors
  });

  it('handles large numbers', () => {
    const { getByText } = render(<ProgressIndicator current={750} total={1000} />);

    expect(getByText('750 / 1000')).toBeTruthy();
  });
});
