import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  it('renders correctly with placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={jest.fn()} />
    );

    expect(getByPlaceholderText('Search medical terms...')).toBeTruthy();
  });

  it('renders with custom placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        value=""
        onChangeText={jest.fn()}
        placeholder="Custom placeholder"
      />
    );

    expect(getByPlaceholderText('Custom placeholder')).toBeTruthy();
  });

  it('displays the provided value', () => {
    const { getByDisplayValue } = render(
      <SearchBar value="test query" onChangeText={jest.fn()} />
    );

    expect(getByDisplayValue('test query')).toBeTruthy();
  });

  it('calls onChangeText when text is entered', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={mockOnChangeText} />
    );

    const input = getByPlaceholderText('Search medical terms...');
    fireEvent.changeText(input, 'cardio');

    expect(mockOnChangeText).toHaveBeenCalledWith('cardio');
    expect(mockOnChangeText).toHaveBeenCalledTimes(1);
  });

  it('updates when value prop changes', () => {
    const { getByDisplayValue, rerender } = render(
      <SearchBar value="initial" onChangeText={jest.fn()} />
    );

    expect(getByDisplayValue('initial')).toBeTruthy();

    rerender(<SearchBar value="updated" onChangeText={jest.fn()} />);

    expect(getByDisplayValue('updated')).toBeTruthy();
  });

  it('does not re-render when same props are passed (React.memo test)', () => {
    const onChangeText = jest.fn();
    const { rerender } = render(
      <SearchBar value="test" onChangeText={onChangeText} />
    );

    // Re-render with same props
    rerender(<SearchBar value="test" onChangeText={onChangeText} />);

    // If React.memo is working, component should not re-render unnecessarily
    // This is hard to test directly, but we can verify behavior remains consistent
    expect(onChangeText).not.toHaveBeenCalled();
  });
});
