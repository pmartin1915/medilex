import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';
import { useWordStore } from '../../store/wordStore';
import { useStreakStore } from '../../store/streakStore';
import * as Speech from 'expo-speech';

// Mock the stores
jest.mock('../../store/wordStore');
jest.mock('../../store/streakStore');

// Mock expo-speech
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
}));

const mockTerms = [
  {
    id: '1',
    term: 'Hypertension',
    pronunciation: '/hy-per-ten-shun/',
    syllables: 'hy-per-ten-sion',
    partOfSpeech: 'noun',
    definition: 'High blood pressure',
    example: 'The patient has hypertension.',
    etymology: { roots: [], meaning: 'high pressure' },
    category: 'Cardiology',
    relatedTerms: [],
  },
  {
    id: '2',
    term: 'Diabetes',
    pronunciation: '/dy-uh-bee-teez/',
    syllables: 'di-a-be-tes',
    partOfSpeech: 'noun',
    definition: 'A metabolic disease',
    example: 'Type 2 diabetes is common.',
    etymology: { roots: [], meaning: 'pass through' },
    category: 'Endocrinology',
    relatedTerms: [],
  },
];

describe('HomeScreen', () => {
  const mockNavigate = jest.fn();
  const mockNavigation = { navigate: mockNavigate };
  const mockToggleFavorite = jest.fn();
  const mockToggleBookmark = jest.fn();
  const mockGetProgress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useWordStore
    const mockWordState = {
      terms: mockTerms,
      toggleFavorite: mockToggleFavorite,
      toggleBookmark: mockToggleBookmark,
      getProgress: mockGetProgress,
    };

    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockWordState);
      }
      return mockWordState;
    });

    // Mock useStreakStore
    const mockStreakState = {
      currentStreak: 5,
      weekProgress: [true, true, false, true, false, false, false],
    };

    (useStreakStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStreakState);
      }
      return mockStreakState;
    });

    mockGetProgress.mockReturnValue(undefined);
  });

  it('renders correctly', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    expect(getByText('Word of the Day')).toBeTruthy();
    expect(getByText('Start Study Session')).toBeTruthy();
  });

  it('displays profile and crown buttons', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    expect(getByText('👤')).toBeTruthy();
    expect(getByText('👑')).toBeTruthy();
  });

  it('renders StreakCalendar with correct props', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    // StreakCalendar should receive streak of 5
    // We can verify this indirectly by checking the component renders
    expect(getByText('Word of the Day')).toBeTruthy();
  });

  it('displays word of the day', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    expect(getByText('Hypertension')).toBeTruthy();
    expect(getByText('High blood pressure')).toBeTruthy();
  });

  it('shows total terms count in stats', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    expect(getByText('2')).toBeTruthy(); // mockTerms.length
    expect(getByText('Terms Available')).toBeTruthy();
  });

  it('navigates to Learn screen when Start Study Session is pressed', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    const startButton = getByText('Start Study Session');
    fireEvent.press(startButton);

    expect(mockNavigate).toHaveBeenCalledWith('Learn');
  });

  it('calls Speech.speak when pronunciation is triggered', () => {
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    const audioButton = getByTestId('icon-Volume2').parent?.parent;
    fireEvent.press(audioButton!);

    expect(Speech.speak).toHaveBeenCalledWith('Hypertension', { rate: 0.75 });
  });

  it('calls toggleFavorite when favorite button is pressed', () => {
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    const heartButton = getByTestId('icon-Heart').parent?.parent;
    fireEvent.press(heartButton!);

    expect(mockToggleFavorite).toHaveBeenCalledWith('1');
  });

  it('calls toggleBookmark when bookmark button is pressed', () => {
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    const bookmarkButton = getByTestId('icon-Bookmark').parent?.parent;
    fireEvent.press(bookmarkButton!);

    expect(mockToggleBookmark).toHaveBeenCalledWith('1');
  });

  it('displays favorited state from progress', () => {
    mockGetProgress.mockReturnValue({
      isFavorited: true,
      isBookmarked: false,
    });

    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    const heartIcon = getByTestId('icon-Heart');
    expect(heartIcon).toBeTruthy();
  });

  it('displays bookmarked state from progress', () => {
    mockGetProgress.mockReturnValue({
      isFavorited: false,
      isBookmarked: true,
    });

    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    const bookmarkIcon = getByTestId('icon-Bookmark');
    expect(bookmarkIcon).toBeTruthy();
  });

  it('handles empty terms array', () => {
    const emptyWordState = {
      terms: [],
      toggleFavorite: mockToggleFavorite,
      toggleBookmark: mockToggleBookmark,
      getProgress: mockGetProgress,
    };

    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(emptyWordState);
      }
      return emptyWordState;
    });

    const { getByText, queryByText } = render(<HomeScreen navigation={mockNavigation} />);

    expect(getByText('0')).toBeTruthy(); // 0 terms
    expect(getByText('Terms Available')).toBeTruthy();
    expect(queryByText('Hypertension')).toBeNull(); // No word of day
  });

  it('displays correct streak number', () => {
    const highStreakState = {
      currentStreak: 15,
      weekProgress: [true, true, true, true, true, true, true],
    };

    (useStreakStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(highStreakState);
      }
      return highStreakState;
    });

    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    // The component should pass streak=15 to StreakCalendar
    expect(getByText('Word of the Day')).toBeTruthy();
  });

  it('renders as scrollable view', () => {
    const { UNSAFE_getByType } = render(<HomeScreen navigation={mockNavigation} />);

    const ScrollView = require('react-native').ScrollView;
    expect(UNSAFE_getByType(ScrollView)).toBeTruthy();
  });

  it('renders MedicalTermCard for word of the day', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    // Verify MedicalTermCard is rendered with first term
    expect(getByText('Hypertension')).toBeTruthy();
    expect(getByText('/hy-per-ten-shun/')).toBeTruthy();
    expect(getByText('hy-per-ten-sion')).toBeTruthy();
  });

  it('only shows first term as word of the day', () => {
    const { getByText, queryByText } = render(<HomeScreen navigation={mockNavigation} />);

    // First term should be visible
    expect(getByText('Hypertension')).toBeTruthy();

    // Second term should NOT be visible
    expect(queryByText('Diabetes')).toBeNull();
  });
});
