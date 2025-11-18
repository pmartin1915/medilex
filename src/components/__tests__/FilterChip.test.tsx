import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FilterChip } from '../FilterChip';

describe('FilterChip', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with label text', () => {
      const { getByText } = render(
        <FilterChip label="Test Label" isActive={false} onPress={mockOnPress} />
      );
      expect(getByText('Test Label')).toBeTruthy();
    });

    it('should render when inactive (default state)', () => {
      const { getByText } = render(
        <FilterChip label="Inactive" isActive={false} onPress={mockOnPress} />
      );
      const chip = getByText('Inactive');
      expect(chip).toBeTruthy();
    });

    it('should render when active', () => {
      const { getByText } = render(
        <FilterChip label="Active" isActive={true} onPress={mockOnPress} />
      );
      const chip = getByText('Active');
      expect(chip).toBeTruthy();
    });

    it('should handle empty label gracefully', () => {
      const { getByText } = render(
        <FilterChip label="" isActive={false} onPress={mockOnPress} />
      );
      expect(getByText('')).toBeTruthy();
    });

    it('should handle long labels', () => {
      const longLabel = 'This is a very long label that might wrap';
      const { getByText } = render(
        <FilterChip label={longLabel} isActive={false} onPress={mockOnPress} />
      );
      expect(getByText(longLabel)).toBeTruthy();
    });
  });

  describe('Interaction', () => {
    it('should call onPress when pressed', () => {
      const { getByText } = render(
        <FilterChip label="Press Me" isActive={false} onPress={mockOnPress} />
      );
      const chip = getByText('Press Me');
      fireEvent.press(chip);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should call onPress when active chip is pressed', () => {
      const { getByText } = render(
        <FilterChip label="Active Chip" isActive={true} onPress={mockOnPress} />
      );
      const chip = getByText('Active Chip');
      fireEvent.press(chip);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should call onPress multiple times', () => {
      const { getByText } = render(
        <FilterChip label="Multi Press" isActive={false} onPress={mockOnPress} />
      );
      const chip = getByText('Multi Press');
      fireEvent.press(chip);
      fireEvent.press(chip);
      fireEvent.press(chip);
      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });
  });

  describe('State Changes', () => {
    it('should handle isActive prop change from false to true', () => {
      const { getByText, rerender } = render(
        <FilterChip label="Toggle" isActive={false} onPress={mockOnPress} />
      );
      expect(getByText('Toggle')).toBeTruthy();

      rerender(<FilterChip label="Toggle" isActive={true} onPress={mockOnPress} />);
      expect(getByText('Toggle')).toBeTruthy();
    });

    it('should handle isActive prop change from true to false', () => {
      const { getByText, rerender } = render(
        <FilterChip label="Toggle" isActive={true} onPress={mockOnPress} />
      );
      expect(getByText('Toggle')).toBeTruthy();

      rerender(<FilterChip label="Toggle" isActive={false} onPress={mockOnPress} />);
      expect(getByText('Toggle')).toBeTruthy();
    });

    it('should handle label change while maintaining state', () => {
      const { getByText, rerender } = render(
        <FilterChip label="Label 1" isActive={true} onPress={mockOnPress} />
      );
      expect(getByText('Label 1')).toBeTruthy();

      rerender(<FilterChip label="Label 2" isActive={true} onPress={mockOnPress} />);
      expect(getByText('Label 2')).toBeTruthy();
    });
  });

  describe('Component Stability', () => {
    it('should not crash with all props provided', () => {
      const { getByText } = render(
        <FilterChip label="Stable" isActive={false} onPress={mockOnPress} />
      );
      expect(getByText('Stable')).toBeTruthy();
    });

    it('should maintain state after multiple rerenders', () => {
      const { getByText, rerender } = render(
        <FilterChip label="Stable" isActive={false} onPress={mockOnPress} />
      );

      rerender(<FilterChip label="Stable" isActive={true} onPress={mockOnPress} />);
      rerender(<FilterChip label="Stable" isActive={false} onPress={mockOnPress} />);
      rerender(<FilterChip label="Stable" isActive={true} onPress={mockOnPress} />);

      expect(getByText('Stable')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in label', () => {
      const specialLabel = '!@#$%^&*()';
      const { getByText } = render(
        <FilterChip label={specialLabel} isActive={false} onPress={mockOnPress} />
      );
      expect(getByText(specialLabel)).toBeTruthy();
    });

    it('should handle numeric strings as labels', () => {
      const { getByText } = render(
        <FilterChip label="12345" isActive={false} onPress={mockOnPress} />
      );
      expect(getByText('12345')).toBeTruthy();
    });

    it('should handle unicode characters', () => {
      const unicodeLabel = '医学词汇';
      const { getByText } = render(
        <FilterChip label={unicodeLabel} isActive={false} onPress={mockOnPress} />
      );
      expect(getByText(unicodeLabel)).toBeTruthy();
    });
  });
});
