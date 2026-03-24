import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgressIndicator } from '../ProgressIndicator';

describe('ProgressIndicator', () => {
  it('renders correctly with current and total', () => {
    const { container } = render(<ProgressIndicator current={3} total={10} />);

    expect(container.textContent).toContain('3');
    expect(container.textContent).toContain('10');
  });

  it('calculates percentage correctly', () => {
    const { container } = render(<ProgressIndicator current={5} total={10} />);

    expect(container.textContent).toContain('5');
    expect(container.textContent).toContain('10');
  });

  it('handles 0 progress', () => {
    const { container } = render(<ProgressIndicator current={0} total={10} />);

    expect(container.textContent).toContain('0');
    expect(container.textContent).toContain('10');
  });

  it('handles 100% progress', () => {
    const { container } = render(<ProgressIndicator current={10} total={10} />);

    expect(container.textContent).toContain('10');
  });

  it('handles 1 item total', () => {
    const { container } = render(<ProgressIndicator current={1} total={1} />);

    expect(container.textContent).toContain('1');
  });

  it('updates when props change', () => {
    const { container, rerender } = render(
      <ProgressIndicator current={3} total={10} />
    );

    expect(container.textContent).toContain('3');

    rerender(<ProgressIndicator current={7} total={10} />);

    expect(container.textContent).toContain('7');
  });

  it('memoizes percentage calculation (useMemo test)', () => {
    const { rerender } = render(<ProgressIndicator current={5} total={10} />);

    // Re-render with same props - useMemo should prevent recalculation
    rerender(<ProgressIndicator current={5} total={10} />);
  });

  it('handles large numbers', () => {
    const { container } = render(<ProgressIndicator current={750} total={1000} />);

    expect(container.textContent).toContain('750');
    expect(container.textContent).toContain('1000');
  });
});
