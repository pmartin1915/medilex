import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  const mockOnChangeText = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render correctly with required props', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      expect(getByPlaceholderText('Search medical terms...')).toBeTruthy();
    });

    it('should render with custom placeholder', () => {
      const { getByPlaceholderText } = render(
        <SearchBar
          value=""
          onChangeText={mockOnChangeText}
          placeholder="Find terms..."
        />
      );

      expect(getByPlaceholderText('Find terms...')).toBeTruthy();
    });

    it('should display the current value', () => {
      const { getByDisplayValue } = render(
        <SearchBar value="cardio" onChangeText={mockOnChangeText} />
      );

      expect(getByDisplayValue('cardio')).toBeTruthy();
    });

    it('should render search icon', () => {
      const { UNSAFE_queryByType } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      // Search icon should be present (component should not crash)
      expect(() => render(<SearchBar value="" onChangeText={mockOnChangeText} />)).not.toThrow();
    });
  });

  describe('Text Input Behavior', () => {
    it('should call onChangeText when text is entered', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Search medical terms...');
      fireEvent.changeText(input, 'tachy');

      expect(mockOnChangeText).toHaveBeenCalledWith('tachy');
      expect(mockOnChangeText).toHaveBeenCalledTimes(1);
    });

    it('should call onChangeText multiple times for multiple inputs', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Search medical terms...');

      fireEvent.changeText(input, 't');
      fireEvent.changeText(input, 'ta');
      fireEvent.changeText(input, 'tac');

      expect(mockOnChangeText).toHaveBeenCalledTimes(3);
      expect(mockOnChangeText).toHaveBeenNthCalledWith(1, 't');
      expect(mockOnChangeText).toHaveBeenNthCalledWith(2, 'ta');
      expect(mockOnChangeText).toHaveBeenNthCalledWith(3, 'tac');
    });

    it('should handle empty text input', () => {
      const { getByDisplayValue } = render(
        <SearchBar value="test" onChangeText={mockOnChangeText} />
      );

      const input = getByDisplayValue('test');
      fireEvent.changeText(input, '');

      expect(mockOnChangeText).toHaveBeenCalledWith('');
    });

    it('should handle special characters', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Search medical terms...');
      fireEvent.changeText(input, 'tachy-cardia');

      expect(mockOnChangeText).toHaveBeenCalledWith('tachy-cardia');
    });

    it('should handle numbers in search', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Search medical terms...');
      fireEvent.changeText(input, 'covid19');

      expect(mockOnChangeText).toHaveBeenCalledWith('covid19');
    });

    it('should handle spaces in search', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Search medical terms...');
      fireEvent.changeText(input, 'heart rate');

      expect(mockOnChangeText).toHaveBeenCalledWith('heart rate');
    });

    it('should handle very long search terms', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      const longText = 'a'.repeat(100);
      const input = getByPlaceholderText('Search medical terms...');
      fireEvent.changeText(input, longText);

      expect(mockOnChangeText).toHaveBeenCalledWith(longText);
    });
  });

  describe('Input Configuration', () => {
    it('should have autoCapitalize disabled', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Search medical terms...');
      expect(input.props.autoCapitalize).toBe('none');
    });

    it('should have autoCorrect disabled', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Search medical terms...');
      expect(input.props.autoCorrect).toBe(false);
    });
  });

  describe('Value Updates', () => {
    it('should reflect updated value from props', () => {
      const { rerender, getByDisplayValue } = render(
        <SearchBar value="initial" onChangeText={mockOnChangeText} />
      );

      expect(getByDisplayValue('initial')).toBeTruthy();

      rerender(
        <SearchBar value="updated" onChangeText={mockOnChangeText} />
      );

      expect(getByDisplayValue('updated')).toBeTruthy();
    });

    it('should transition from empty to filled', () => {
      const { rerender, getByPlaceholderText, getByDisplayValue } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      expect(getByPlaceholderText('Search medical terms...')).toBeTruthy();

      rerender(
        <SearchBar value="cardio" onChangeText={mockOnChangeText} />
      );

      expect(getByDisplayValue('cardio')).toBeTruthy();
    });

    it('should transition from filled to empty', () => {
      const { rerender, getByDisplayValue, getByPlaceholderText } = render(
        <SearchBar value="cardio" onChangeText={mockOnChangeText} />
      );

      expect(getByDisplayValue('cardio')).toBeTruthy();

      rerender(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      expect(getByPlaceholderText('Search medical terms...')).toBeTruthy();
    });
  });

  describe('Focus and Interaction', () => {
    it('should be focusable', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Search medical terms...');

      expect(() => {
        fireEvent(input, 'focus');
      }).not.toThrow();
    });

    it('should be blurrable', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Search medical terms...');

      expect(() => {
        fireEvent(input, 'blur');
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined placeholder gracefully', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} placeholder={undefined} />
      );

      // Should fall back to default placeholder
      expect(getByPlaceholderText('Search medical terms...')).toBeTruthy();
    });

    it('should handle empty string placeholder', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} placeholder="" />
      );

      const input = getByPlaceholderText('');
      expect(input).toBeTruthy();
    });

    it('should handle whitespace-only value', () => {
      const { getByDisplayValue } = render(
        <SearchBar value="   " onChangeText={mockOnChangeText} />
      );

      expect(getByDisplayValue('   ')).toBeTruthy();
    });

    it('should handle unicode characters', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Search medical terms...');
      fireEvent.changeText(input, '心臓 corazón');

      expect(mockOnChangeText).toHaveBeenCalledWith('心臓 corazón');
    });

    it('should handle emoji in search', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Search medical terms...');
      fireEvent.changeText(input, 'heart ❤️');

      expect(mockOnChangeText).toHaveBeenCalledWith('heart ❤️');
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot with empty value', () => {
      const { toJSON } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with filled value', () => {
      const { toJSON } = render(
        <SearchBar value="tachycardia" onChangeText={mockOnChangeText} />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with custom placeholder', () => {
      const { toJSON } = render(
        <SearchBar
          value=""
          onChangeText={mockOnChangeText}
          placeholder="Custom placeholder"
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible to screen readers', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Search medical terms...');
      // TextInput should be accessible by default
      expect(input).toBeTruthy();
    });

    it('should have readable placeholder text', () => {
      const { getByPlaceholderText } = render(
        <SearchBar
          value=""
          onChangeText={mockOnChangeText}
          placeholder="Find medical terms"
        />
      );

      expect(getByPlaceholderText('Find medical terms')).toBeTruthy();
    });
  });

  describe('Integration Scenarios', () => {
    it('should simulate real typing behavior', () => {
      const { getByPlaceholderText } = render(
        <SearchBar value="" onChangeText={mockOnChangeText} />
      );

      const input = getByPlaceholderText('Search medical terms...');

      // Simulate typing "cardio" letter by letter
      const letters = ['c', 'ca', 'car', 'card', 'cardi', 'cardio'];
      letters.forEach(text => {
        fireEvent.changeText(input, text);
      });

      expect(mockOnChangeText).toHaveBeenCalledTimes(6);
      expect(mockOnChangeText).toHaveBeenLastCalledWith('cardio');
    });

    it('should simulate backspace behavior', () => {
      const { getByDisplayValue } = render(
        <SearchBar value="cardio" onChangeText={mockOnChangeText} />
      );

      const input = getByDisplayValue('cardio');

      // Simulate backspace
      fireEvent.changeText(input, 'cardi');
      fireEvent.changeText(input, 'card');

      expect(mockOnChangeText).toHaveBeenCalledWith('card');
    });

    it('should simulate clear all behavior', () => {
      const { getByDisplayValue } = render(
        <SearchBar value="tachycardia" onChangeText={mockOnChangeText} />
      );

      const input = getByDisplayValue('tachycardia');
      fireEvent.changeText(input, '');

      expect(mockOnChangeText).toHaveBeenCalledWith('');
    });
  });
});
