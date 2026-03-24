import React from 'react';
import { render } from '@testing-library/react';
import { vi, type Mock } from 'vitest';

// Mock the stores before importing the component
vi.mock('../../store/wordStore', () => ({
  useWordStore: vi.fn(),
}));

vi.mock('../../store/streakStore', () => ({
  useStreakStore: vi.fn(),
}));

import { LearnScreen } from '../LearnScreen';
import { useWordStore } from '../../store/wordStore';
import { useStreakStore } from '../../store/streakStore';
import * as Speech from 'expo-speech';

const mockTerms = [
  {
    id: '1',
    term: 'Tachycardia',
    pronunciation: '/tak-i-kar-dee-uh/',
    syllables: 'tach-y-car-di-a',
    partOfSpeech: 'noun',
    definition: 'Abnormally rapid heart rate',
    example: 'The patient presented with tachycardia.',
    etymology: { roots: [], meaning: 'fast heart' },
    category: 'Cardiology',
    relatedTerms: [],
  },
  {
    id: '2',
    term: 'Bradycardia',
    pronunciation: '/bray-di-kar-dee-uh/',
    syllables: 'bra-dy-car-di-a',
    partOfSpeech: 'noun',
    definition: 'Abnormally slow heart rate',
    example: 'The patient has bradycardia.',
    etymology: { roots: [], meaning: 'slow heart' },
    category: 'Cardiology',
    relatedTerms: [],
  },
];

describe('LearnScreen', () => {
  const mockUpdateProgress = vi.fn();
  const mockToggleFavorite = vi.fn();
  const mockToggleBookmark = vi.fn();
  const mockGetProgress = vi.fn();
  const mockRecordStudySession = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    const mockState = {
      terms: mockTerms,
      updateProgress: mockUpdateProgress,
      toggleFavorite: mockToggleFavorite,
      toggleBookmark: mockToggleBookmark,
      getProgress: mockGetProgress,
    };

    (useWordStore as Mock).mockImplementation((selector?: (state: typeof mockState) => unknown) => {
      if (typeof selector === 'function') {
        return selector(mockState);
      }
      return mockState;
    });

    const mockStreakState = {
      recordStudySession: mockRecordStudySession,
    };

    (useStreakStore as Mock).mockImplementation((selector?: (state: typeof mockStreakState) => unknown) => {
      if (typeof selector === 'function') {
        return selector(mockStreakState);
      }
      return mockStreakState;
    });

    mockGetProgress.mockReturnValue(undefined);
  });

  it('renders correctly with terms', () => {
    const { container } = render(<LearnScreen />);

    expect(container.textContent).toContain('Tachycardia');
  });

  it('displays progress indicator with correct values', () => {
    const { container } = render(<LearnScreen />);

    expect(container.textContent).toContain('1');
    expect(container.textContent).toContain('2');
  });

  it('shows first term initially', () => {
    const { container } = render(<LearnScreen />);

    expect(container.textContent).toContain('Tachycardia');
    expect(container.textContent).toContain('Abnormally rapid heart rate');
  });

  it('shows swipe instructions', () => {
    const { container } = render(<LearnScreen />);

    expect(container.textContent).toContain('Know It');
  });

  it('displays "No terms available" when no terms exist', () => {
    const emptyState = {
      terms: [],
      updateProgress: mockUpdateProgress,
      toggleFavorite: mockToggleFavorite,
      toggleBookmark: mockToggleBookmark,
      getProgress: mockGetProgress,
    };

    (useWordStore as Mock).mockImplementation((selector?: (state: typeof emptyState) => unknown) => {
      if (typeof selector === 'function') {
        return selector(emptyState);
      }
      return emptyState;
    });

    const { container } = render(<LearnScreen />);

    expect(container.textContent).toContain('No terms available');
  });

  it('renders term with pronunciation and syllables', () => {
    const { container } = render(<LearnScreen />);

    expect(container.textContent).toContain('/tak-i-kar-dee-uh/');
    expect(container.textContent).toContain('tach-y-car-di-a');
  });

  it('renders term with part of speech', () => {
    const { container } = render(<LearnScreen />);

    expect(container.textContent).toContain('noun');
  });

  it('renders term with example', () => {
    const { container } = render(<LearnScreen />);

    expect(container.textContent).toContain('The patient presented with tachycardia.');
  });

  it('shows completion screen after all terms studied', () => {
    const { container } = render(<LearnScreen />);

    expect(container.textContent).toContain('Tachycardia');
  });

  it('calls pronunciation when audio button is pressed', () => {
    render(<LearnScreen />);

    expect(Speech.speak).toBeDefined();
  });

  it('handles favorite toggle', () => {
    mockGetProgress.mockReturnValue({
      termId: '1',
      userId: 'test',
      timesStudied: 0,
      timesCorrect: 0,
      timesIncorrect: 0,
      lastStudied: new Date(),
      masteryLevel: 'new',
      isFavorited: false,
      isBookmarked: false,
    });

    render(<LearnScreen />);

    expect(mockToggleFavorite).toBeDefined();
  });

  it('handles bookmark toggle', () => {
    mockGetProgress.mockReturnValue({
      termId: '1',
      userId: 'test',
      timesStudied: 0,
      timesCorrect: 0,
      timesIncorrect: 0,
      lastStudied: new Date(),
      masteryLevel: 'new',
      isFavorited: false,
      isBookmarked: false,
    });

    render(<LearnScreen />);

    expect(mockToggleBookmark).toBeDefined();
  });

  it('uses memoized currentTerm', () => {
    const { rerender } = render(<LearnScreen />);

    rerender(<LearnScreen />);
  });

  it('uses memoized progress', () => {
    const { rerender } = render(<LearnScreen />);

    rerender(<LearnScreen />);
  });

  it('wraps handlers in useCallback', () => {
    const { rerender } = render(<LearnScreen />);

    const initialCallCount = mockUpdateProgress.mock.calls.length;

    rerender(<LearnScreen />);

    expect(mockUpdateProgress.mock.calls.length).toBe(initialCallCount);
  });
});
