import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LearnScreen } from '../LearnScreen';
import { useWordStore } from '../../store/wordStore';
import { useStreakStore } from '../../store/streakStore';
import { SAMPLE_TERMS } from '../../data/sampleTerms';

jest.mock('../../store/wordStore');
jest.mock('../../store/streakStore');
jest.mock('expo-speech');

describe('LearnScreen', () => {
  const mockUpdateProgress = jest.fn();
  const mockRecordStudySession = jest.fn();
  const mockToggleBookmark = jest.fn();
  const mockGetProgress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        terms: SAMPLE_TERMS.slice(0, 3),
        updateProgress: mockUpdateProgress,
        toggleFavorite: jest.fn(),
        toggleBookmark: mockToggleBookmark,
        getProgress: mockGetProgress,
      };
      return selector ? selector(state) : state;
    });
    
    (useStreakStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        recordStudySession: mockRecordStudySession,
      };
      return selector ? selector(state) : state;
    });
  });

  it('should render progress indicator', () => {
    const { getByText } = render(<LearnScreen />);
    expect(getByText('1 / 3')).toBeTruthy();
  });

  it('should display first term', () => {
    const { getByText } = render(<LearnScreen />);
    expect(getByText(SAMPLE_TERMS[0].term)).toBeTruthy();
  });

  it('should call updateProgress when Know It is pressed', async () => {
    const { getByLabelText } = render(<LearnScreen />);
    const knowItButton = getByLabelText('Know It');
    
    fireEvent.press(knowItButton);
    
    await waitFor(() => {
      expect(mockUpdateProgress).toHaveBeenCalledWith(SAMPLE_TERMS[0].id, true);
    });
  });

  it('should call updateProgress when Don\'t Know is pressed', async () => {
    const { getByLabelText } = render(<LearnScreen />);
    const dontKnowButton = getByLabelText("Don't Know");
    
    fireEvent.press(dontKnowButton);
    
    await waitFor(() => {
      expect(mockUpdateProgress).toHaveBeenCalledWith(SAMPLE_TERMS[0].id, false);
    });
  });

  it('should advance to next card after Know It', async () => {
    const { getByLabelText, getByText } = render(<LearnScreen />);
    const knowItButton = getByLabelText('Know It');
    
    fireEvent.press(knowItButton);
    
    await waitFor(() => {
      expect(getByText('2 / 3')).toBeTruthy();
    });
  });

  it('should call toggleBookmark when bookmark is pressed', async () => {
    const { getByLabelText } = render(<LearnScreen />);
    const bookmarkButton = getByLabelText('Bookmark');
    
    fireEvent.press(bookmarkButton);
    
    await waitFor(() => {
      expect(mockToggleBookmark).toHaveBeenCalledWith(SAMPLE_TERMS[0].id);
    });
  });

  it('should show completion screen after last card', async () => {
    const { getByLabelText, getByText } = render(<LearnScreen />);
    
    // Complete all 3 cards
    for (let i = 0; i < 3; i++) {
      const knowItButton = getByLabelText('Know It');
      fireEvent.press(knowItButton);
      await waitFor(() => {}, { timeout: 100 });
    }
    
    await waitFor(() => {
      expect(getByText('Session Complete!')).toBeTruthy();
    });
  });

  it('should record study session on completion', async () => {
    const { getByLabelText } = render(<LearnScreen />);
    
    // Complete all 3 cards
    for (let i = 0; i < 3; i++) {
      const knowItButton = getByLabelText('Know It');
      fireEvent.press(knowItButton);
      await waitFor(() => {}, { timeout: 100 });
    }
    
    await waitFor(() => {
      expect(mockRecordStudySession).toHaveBeenCalled();
    });
  });

  it('should restart session when Study Again is pressed', async () => {
    const { getByLabelText, getByText } = render(<LearnScreen />);
    
    // Complete session
    for (let i = 0; i < 3; i++) {
      const knowItButton = getByLabelText('Know It');
      fireEvent.press(knowItButton);
      await waitFor(() => {}, { timeout: 100 });
    }
    
    await waitFor(() => {
      expect(getByText('Session Complete!')).toBeTruthy();
    });
    
    const restartButton = getByText('Study Again');
    fireEvent.press(restartButton);
    
    await waitFor(() => {
      expect(getByText('1 / 3')).toBeTruthy();
    });
  });

  it('should handle empty terms gracefully', () => {
    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        terms: [],
        updateProgress: mockUpdateProgress,
        toggleFavorite: jest.fn(),
        toggleBookmark: mockToggleBookmark,
        getProgress: mockGetProgress,
      };
      return selector ? selector(state) : state;
    });

    const { getByText } = render(<LearnScreen />);
    expect(getByText('No Terms Available')).toBeTruthy();
  });
});
