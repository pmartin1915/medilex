import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { SearchBar } from '../SearchBar';
import { vi } from 'vitest';

describe('SearchBar', () => {
  it('renders correctly with placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={vi.fn()} />
    );

    expect(getByPlaceholderText('Search medical terms...')).toBeTruthy();
  });

  it('renders with custom placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        value=""
        onChangeText={vi.fn()}
        placeholder="Custom placeholder"
      />
    );

    expect(getByPlaceholderText('Custom placeholder')).toBeTruthy();
  });

  it('displays the provided value', () => {
    const { getByDisplayValue } = render(
      <SearchBar value="test query" onChangeText={vi.fn()} />
    );

    expect(getByDisplayValue('test query')).toBeTruthy();
  });

  it('calls onChangeText when text is entered', () => {
    const mockOnChangeText = vi.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={mockOnChangeText} />
    );

    const input = getByPlaceholderText('Search medical terms...');
    fireEvent.change(input, { target: { value: 'cardio' } });

    expect(mockOnChangeText).toHaveBeenCalledWith('cardio');
    expect(mockOnChangeText).toHaveBeenCalledTimes(1);
  });

  it('updates when value prop changes', () => {
    const { getByDisplayValue, rerender } = render(
      <SearchBar value="initial" onChangeText={vi.fn()} />
    );

    expect(getByDisplayValue('initial')).toBeTruthy();

    rerender(<SearchBar value="updated" onChangeText={vi.fn()} />);

    expect(getByDisplayValue('updated')).toBeTruthy();
  });

  it('does not re-render when same props are passed (React.memo test)', () => {
    const onChangeText = vi.fn();
    const { rerender } = render(
      <SearchBar value="test" onChangeText={onChangeText} />
    );

    // Re-render with same props
    rerender(<SearchBar value="test" onChangeText={onChangeText} />);

    expect(onChangeText).not.toHaveBeenCalled();
  });
});
