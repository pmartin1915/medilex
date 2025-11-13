import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';
import { useWordStore } from '../../store/wordStore';
import { useStreakStore } from '../../store/streakStore';
import { SAMPLE_TERMS } from '../../data/sampleTerms';

const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate };

jest.mock('../../store/wordStore');
jest.mock('../../store/streakStore');

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        terms: SAMPLE_TERMS.slice(0, 5),
        userProgress: {},
        toggleFavorite: jest.fn(),
        toggleBookmark: jest.fn(),
        getProgress: jest.fn(() => undefined),
      };
      return selector ? selector(state) : state;
    });
    
    (useStreakStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        currentStreak: 3,
        weekProgress: [true, true, true, false, false, false, false],
      };
      return selector ? selector(state) : state;
    });
  });

  it('should render greeting message', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    const greeting = getByText(/Good (morning|afternoon|evening)/);
    expect(greeting).toBeTruthy();
  });

  it('should render motivation text', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    expect(getByText('Ready to expand your medical vocabulary?')).toBeTruthy();
  });

  it('should display total terms stat', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    expect(getByText('Total Terms')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
  });

  it('should navigate to Learn screen when Study All is pressed', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    const studyAllButton = getByText('Study All');
    fireEvent.press(studyAllButton);
    expect(mockNavigate).toHaveBeenCalledWith('Learn');
  });

  it('should display word of the day', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    expect(getByText('Word of the Day')).toBeTruthy();
    expect(getByText(SAMPLE_TERMS[0].term)).toBeTruthy();
  });

  it('should navigate to Learn when Start Study Session is pressed', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    const startButton = getByText('Start Study Session');
    fireEvent.press(startButton);
    expect(mockNavigate).toHaveBeenCalledWith('Learn');
  });
});
