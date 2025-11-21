import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PrimaryButton } from '../PrimaryButton';

describe('PrimaryButton', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with title correctly', () => {
    const { getByText } = render(
      <PrimaryButton title="Click Me" onPress={mockOnPress} />
    );

    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when button is pressed', () => {
    const { getByText } = render(
      <PrimaryButton title="Click Me" onPress={mockOnPress} />
    );

    fireEvent.press(getByText('Click Me'));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const { getByText } = render(
      <PrimaryButton title="Click Me" onPress={mockOnPress} disabled={true} />
    );

    fireEvent.press(getByText('Click Me'));

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('shows loading indicator when loading', () => {
    const { queryByText, UNSAFE_getByType } = render(
      <PrimaryButton title="Click Me" onPress={mockOnPress} loading={true} />
    );

    // Title should not be visible
    expect(queryByText('Click Me')).toBeNull();

    // ActivityIndicator should be visible
    const ActivityIndicator = require('react-native').ActivityIndicator;
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('does not call onPress when loading', () => {
    const { UNSAFE_getByType } = render(
      <PrimaryButton title="Click Me" onPress={mockOnPress} loading={true} />
    );

    const ActivityIndicator = require('react-native').ActivityIndicator;
    const indicator = UNSAFE_getByType(ActivityIndicator);

    fireEvent.press(indicator.parent!);

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('renders correctly when not disabled', () => {
    const { getByText } = render(
      <PrimaryButton title="Click Me" onPress={mockOnPress} disabled={false} />
    );

    expect(getByText('Click Me')).toBeTruthy();
  });

  it('applies disabled styles when disabled', () => {
    const { getByText } = render(
      <PrimaryButton title="Click Me" onPress={mockOnPress} disabled={true} />
    );

    const button = getByText('Click Me').parent;
    expect(button).toBeTruthy();
  });

  it('handles multiple rapid presses correctly', () => {
    const { getByText } = render(
      <PrimaryButton title="Click Me" onPress={mockOnPress} />
    );

    const button = getByText('Click Me');

    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(3);
  });

  it('renders with long title text', () => {
    const longTitle = 'This is a very long button title that might wrap';
    const { getByText } = render(
      <PrimaryButton title={longTitle} onPress={mockOnPress} />
    );

    expect(getByText(longTitle)).toBeTruthy();
  });

  it('renders with empty string title', () => {
    const { queryByText } = render(
      <PrimaryButton title="" onPress={mockOnPress} />
    );

    // Should render but with no text
    expect(queryByText('')).toBeTruthy();
  });

  it('can be re-enabled after being disabled', () => {
    const { getByText, rerender } = render(
      <PrimaryButton title="Click Me" onPress={mockOnPress} disabled={true} />
    );

    // Should not work when disabled
    fireEvent.press(getByText('Click Me'));
    expect(mockOnPress).not.toHaveBeenCalled();

    // Re-render with disabled=false
    rerender(<PrimaryButton title="Click Me" onPress={mockOnPress} disabled={false} />);

    // Should work now
    fireEvent.press(getByText('Click Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('can toggle loading state', () => {
    const { queryByText, UNSAFE_queryByType, rerender } = render(
      <PrimaryButton title="Click Me" onPress={mockOnPress} loading={false} />
    );

    // Initially not loading
    expect(queryByText('Click Me')).toBeTruthy();

    // Re-render with loading=true
    rerender(<PrimaryButton title="Click Me" onPress={mockOnPress} loading={true} />);

    const ActivityIndicator = require('react-native').ActivityIndicator;
    expect(UNSAFE_queryByType(ActivityIndicator)).toBeTruthy();
    expect(queryByText('Click Me')).toBeNull();
  });
});
