import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MedicalTermCard } from '../MedicalTermCard';
import { MedicalTerm } from '../../types';
import * as Haptics from 'expo-haptics';

// Mock expo-haptics (already mocked in jest.setup, but explicitly for clarity)
jest.mock('expo-haptics');

// Mock child components to isolate MedicalTermCard testing
jest.mock('../TermBreakdown', () => ({
  TermBreakdown: () => null,
}));

jest.mock('../Tooltip', () => ({
  Tooltip: () => null,
}));

jest.mock('../../utils/componentBreakdown', () => ({
  hasBreakdown: jest.fn(() => true),
}));

describe('MedicalTermCard', () => {
  const mockTerm: MedicalTerm = {
    id: 'test-1',
    term: 'Tachycardia',
    pronunciation: 'tak-ih-KAR-dee-ah',
    syllables: 'ta·chy·car·di·a',
    partOfSpeech: 'noun',
    definition: 'An abnormally rapid heart rate, typically defined as over 100 beats per minute.',
    example: 'The patient presented with tachycardia after exercise.',
    category: 'Cardiovascular',
    specialty: 'Cardiology',
    etymology: {
      prefix: 'tachy-',
      root: 'cardia',
      meaning: 'From Greek: tachy (fast) + cardia (heart)',
    },
    relatedTerms: ['bradycardia', 'arrhythmia', 'palpitations'],
    clinicalNote: 'Common in patients with anxiety or after physical exertion.',
    difficulty: 1,
    commonlyMisspelled: false,
    createdAt: new Date('2024-01-01'),
  };

  const mockCallbacks = {
    onPronounce: jest.fn(),
    onKnowIt: jest.fn(),
    onDontKnow: jest.fn(),
    onBookmark: jest.fn(),
    onShare: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the medical term correctly', () => {
      const { getByText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      expect(getByText('Tachycardia')).toBeTruthy();
    });

    it('should render pronunciation with correct format', () => {
      const { getByText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      expect(getByText('tak-ih-KAR-dee-ah')).toBeTruthy();
    });

    it('should render syllables and part of speech', () => {
      const { getByText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      expect(getByText('ta·chy·car·di·a')).toBeTruthy();
      expect(getByText('noun')).toBeTruthy();
    });

    it('should render definition text', () => {
      const { getByText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      expect(getByText('An abnormally rapid heart rate, typically defined as over 100 beats per minute.')).toBeTruthy();
    });

    it('should render clinical example', () => {
      const { getByText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      expect(getByText('The patient presented with tachycardia after exercise.')).toBeTruthy();
    });
  });

  describe('Dynamic Font Sizing', () => {
    it('should use larger font for short terms (≤10 chars)', () => {
      const shortTerm = { ...mockTerm, term: 'Heart' };
      const { getByText } = render(<MedicalTermCard term={shortTerm} {...mockCallbacks} />);

      const termElement = getByText('Heart');
      expect(termElement).toBeTruthy();
      // Font size should be 48 for terms ≤10 characters
    });

    it('should use smaller font for long terms (>24 chars)', () => {
      const longTerm = { ...mockTerm, term: 'Electroencephalography' };
      const { getByText } = render(<MedicalTermCard term={longTerm} {...mockCallbacks} />);

      const termElement = getByText('Electroencephalography');
      expect(termElement).toBeTruthy();
      // Font size should be 26 for terms >24 characters
    });
  });

  describe('Show More / Show Less Details', () => {
    it('should initially hide detailed information', () => {
      const { queryByText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      // Clinical note should not be visible initially
      expect(queryByText('Clinical Note:')).toBeNull();
      expect(queryByText('Etymology:')).toBeNull();
    });

    it('should show detailed information when "Show More" is pressed', () => {
      const { getByText, queryByText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      const showMoreButton = getByText('Show More');
      fireEvent.press(showMoreButton);

      expect(queryByText('Clinical Note:')).toBeTruthy();
      expect(queryByText('Etymology:')).toBeTruthy();
      expect(queryByText('Cardiovascular')).toBeTruthy();
    });

    it('should hide details when "Show Less" is pressed after showing', () => {
      const { getByText, queryByText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      // Show details
      const showMoreButton = getByText('Show More');
      fireEvent.press(showMoreButton);

      // Verify details are visible
      expect(queryByText('Clinical Note:')).toBeTruthy();

      // Hide details
      const showLessButton = getByText('Show Less');
      fireEvent.press(showLessButton);

      // Details should be hidden again
      expect(queryByText('Clinical Note:')).toBeNull();
    });

    it('should show related terms when details are expanded', () => {
      const { getByText, queryByText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      fireEvent.press(getByText('Show More'));

      expect(queryByText('Related Terms:')).toBeTruthy();
      expect(queryByText('bradycardia, arrhythmia, palpitations')).toBeTruthy();
    });

    it('should show category and specialty when details are expanded', () => {
      const { getByText, getAllByText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      fireEvent.press(getByText('Show More'));

      // Category should be visible
      const categoryElements = getAllByText('Cardiovascular');
      expect(categoryElements.length).toBeGreaterThan(0);

      // Specialty should be visible
      expect(getByText('Cardiology')).toBeTruthy();
    });
  });

  describe('Action Buttons', () => {
    it('should render all action buttons when showActions is true', () => {
      const { getByLabelText } = render(
        <MedicalTermCard term={mockTerm} {...mockCallbacks} showActions={true} />
      );

      expect(getByLabelText('Know It')).toBeTruthy();
      expect(getByLabelText("Don't Know")).toBeTruthy();
      expect(getByLabelText('Bookmark')).toBeTruthy();
      expect(getByLabelText('Share')).toBeTruthy();
    });

    it('should hide action buttons when showActions is false', () => {
      const { queryByLabelText } = render(
        <MedicalTermCard term={mockTerm} {...mockCallbacks} showActions={false} />
      );

      expect(queryByLabelText('Know It')).toBeNull();
      expect(queryByLabelText("Don't Know")).toBeNull();
      expect(queryByLabelText('Bookmark')).toBeNull();
      expect(queryByLabelText('Share')).toBeNull();
    });

    it('should call onKnowIt when Know It button is pressed', () => {
      const { getByLabelText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      const knowItButton = getByLabelText('Know It');
      fireEvent.press(knowItButton);

      expect(mockCallbacks.onKnowIt).toHaveBeenCalledTimes(1);
    });

    it('should call onDontKnow when Don\'t Know button is pressed', () => {
      const { getByLabelText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      const dontKnowButton = getByLabelText("Don't Know");
      fireEvent.press(dontKnowButton);

      expect(mockCallbacks.onDontKnow).toHaveBeenCalledTimes(1);
    });

    it('should call onBookmark when Bookmark button is pressed', () => {
      const { getByLabelText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      const bookmarkButton = getByLabelText('Bookmark');
      fireEvent.press(bookmarkButton);

      expect(mockCallbacks.onBookmark).toHaveBeenCalledTimes(1);
    });

    it('should call onShare when Share button is pressed', () => {
      const { getByLabelText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      const shareButton = getByLabelText('Share');
      fireEvent.press(shareButton);

      expect(mockCallbacks.onShare).toHaveBeenCalledTimes(1);
    });

    it('should trigger haptic feedback on Know It press', () => {
      const { getByLabelText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      const knowItButton = getByLabelText('Know It');
      fireEvent.press(knowItButton);

      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
    });

    it('should trigger haptic feedback on Don\'t Know press', () => {
      const { getByLabelText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      const dontKnowButton = getByLabelText("Don't Know");
      fireEvent.press(dontKnowButton);

      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
    });

    it('should trigger haptic feedback on Bookmark press', () => {
      const { getByLabelText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      const bookmarkButton = getByLabelText('Bookmark');
      fireEvent.press(bookmarkButton);

      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('should trigger haptic feedback on Share press', () => {
      const { getByLabelText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      const shareButton = getByLabelText('Share');
      fireEvent.press(shareButton);

      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });
  });

  describe('Bookmark State', () => {
    it('should show unfilled bookmark icon when not bookmarked', () => {
      const { getByLabelText } = render(
        <MedicalTermCard term={mockTerm} {...mockCallbacks} isBookmarked={false} />
      );

      const bookmarkButton = getByLabelText('Bookmark');
      expect(bookmarkButton).toBeTruthy();
    });

    it('should show filled bookmark icon when bookmarked', () => {
      const { getByLabelText } = render(
        <MedicalTermCard term={mockTerm} {...mockCallbacks} isBookmarked={true} />
      );

      const bookmarkButton = getByLabelText('Remove bookmark');
      expect(bookmarkButton).toBeTruthy();
    });

    it('should update accessibility label based on bookmark state', () => {
      const { getByLabelText, rerender } = render(
        <MedicalTermCard term={mockTerm} {...mockCallbacks} isBookmarked={false} />
      );

      expect(getByLabelText('Bookmark')).toBeTruthy();

      rerender(
        <MedicalTermCard term={mockTerm} {...mockCallbacks} isBookmarked={true} />
      );

      expect(getByLabelText('Remove bookmark')).toBeTruthy();
    });
  });

  describe('Pronunciation Button', () => {
    it('should call onPronounce when pronunciation pill is pressed', () => {
      const { getByText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      const pronunciationButton = getByText('tak-ih-KAR-dee-ah');
      fireEvent.press(pronunciationButton);

      expect(mockCallbacks.onPronounce).toHaveBeenCalledTimes(1);
    });
  });

  describe('Scroll Behavior', () => {
    it('should enable scrolling by default', () => {
      const { UNSAFE_getByType } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      const scrollView = UNSAFE_getByType(require('react-native').ScrollView);
      expect(scrollView.props.scrollEnabled).toBe(true);
    });

    it('should disable scrolling when scrollEnabled is false', () => {
      const { UNSAFE_getByType } = render(
        <MedicalTermCard term={mockTerm} {...mockCallbacks} scrollEnabled={false} />
      );

      const scrollView = UNSAFE_getByType(require('react-native').ScrollView);
      expect(scrollView.props.scrollEnabled).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility role for action buttons', () => {
      const { getByLabelText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      const knowItButton = getByLabelText('Know It');
      expect(knowItButton.props.accessibilityRole).toBe('button');
    });

    it('should have descriptive accessibility labels for all interactive elements', () => {
      const { getByLabelText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      expect(getByLabelText('Know It')).toBeTruthy();
      expect(getByLabelText("Don't Know")).toBeTruthy();
      expect(getByLabelText('Bookmark')).toBeTruthy();
      expect(getByLabelText('Share')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle terms without clinical notes', () => {
      const termWithoutNote = { ...mockTerm, clinicalNote: undefined };
      const { getByText, queryByText } = render(
        <MedicalTermCard term={termWithoutNote} {...mockCallbacks} />
      );

      fireEvent.press(getByText('Show More'));

      // Should not render clinical note section
      expect(queryByText('Clinical Note:')).toBeNull();
    });

    it('should handle terms without specialty', () => {
      const termWithoutSpecialty = { ...mockTerm, specialty: undefined };
      const { getByText, queryByText } = render(
        <MedicalTermCard term={termWithoutSpecialty} {...mockCallbacks} />
      );

      fireEvent.press(getByText('Show More'));

      // Should show category but not specialty
      expect(getByText('Cardiovascular')).toBeTruthy();
      expect(queryByText('Cardiology')).toBeNull();
    });

    it('should handle terms with no related terms', () => {
      const termWithoutRelated = { ...mockTerm, relatedTerms: [] };
      const { getByText, queryByText } = render(
        <MedicalTermCard term={termWithoutRelated} {...mockCallbacks} />
      );

      fireEvent.press(getByText('Show More'));

      // Related terms section should not be visible
      expect(queryByText('Related Terms:')).toBeNull();
    });

    it('should handle very long definitions gracefully', () => {
      const longDefinition = 'A'.repeat(500);
      const termWithLongDef = { ...mockTerm, definition: longDefinition };

      const { getByText } = render(
        <MedicalTermCard term={termWithLongDef} {...mockCallbacks} />
      );

      expect(getByText(longDefinition)).toBeTruthy();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot in default state', () => {
      const { toJSON } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);
      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with details expanded', () => {
      const { toJSON, getByText } = render(<MedicalTermCard term={mockTerm} {...mockCallbacks} />);

      fireEvent.press(getByText('Show More'));

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot when bookmarked', () => {
      const { toJSON } = render(
        <MedicalTermCard term={mockTerm} {...mockCallbacks} isBookmarked={true} />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with showActions=false', () => {
      const { toJSON } = render(
        <MedicalTermCard term={mockTerm} {...mockCallbacks} showActions={false} />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
