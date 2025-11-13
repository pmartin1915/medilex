import React from 'react';
import { render } from '@testing-library/react-native';
import { StatCard } from '../StatCard';
import { BookOpen } from 'lucide-react-native';

describe('StatCard', () => {
  const defaultProps = {
    icon: BookOpen,
    value: 75,
    label: 'Total Terms',
    color: '#7BAAA5',
  };

  it('should render correctly with required props', () => {
    const { getByText } = render(<StatCard {...defaultProps} />);

    expect(getByText('75')).toBeTruthy();
    expect(getByText('Total Terms')).toBeTruthy();
  });

  it('should handle zero value', () => {
    const { getByText } = render(
      <StatCard {...defaultProps} value={0} />
    );

    expect(getByText('0')).toBeTruthy();
  });

  it('should handle large numbers', () => {
    const { getByText } = render(
      <StatCard {...defaultProps} value={1234} />
    );

    expect(getByText('1234')).toBeTruthy();
  });

  it('should render with custom color', () => {
    const { getByText } = render(
      <StatCard {...defaultProps} color="#FF0000" />
    );

    // Component should render without crashing
    expect(getByText('Total Terms')).toBeTruthy();
  });

  it('should handle long labels gracefully', () => {
    const longLabel = 'This is a very long label that might wrap';
    const { getByText } = render(
      <StatCard {...defaultProps} label={longLabel} />
    );

    expect(getByText(longLabel)).toBeTruthy();
  });

  it('should render trend when provided', () => {
    const { getByText } = render(
      <StatCard {...defaultProps} trend="+15%" />
    );

    expect(getByText('+15%')).toBeTruthy();
  });

  it('should render negative trend', () => {
    const { getByText } = render(
      <StatCard {...defaultProps} trend="-5%" />
    );

    expect(getByText('-5%')).toBeTruthy();
  });

  it('should match snapshot', () => {
    const { toJSON } = render(<StatCard {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with trend', () => {
    const { toJSON } = render(
      <StatCard {...defaultProps} trend="+10%" />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
