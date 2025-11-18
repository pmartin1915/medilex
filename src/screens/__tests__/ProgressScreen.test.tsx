import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgressScreen } from '../ProgressScreen';
import { useWordStore } from '../../store/wordStore';
import { useStreakStore } from '../../store/streakStore';

// Mock the stores
jest.mock('../../store/wordStore');
jest.mock('../../store/streakStore');

describe('ProgressScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with title and subtitle', () => {
    const mockWordState = {
      terms: [],
      userProgress: {},
    };

    const mockStreakState = {
      currentStreak: 0,
      longestStreak: 0,
    };

    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockWordState);
      }
      return mockWordState;
    });

    (useStreakStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStreakState);
      }
      return mockStreakState;
    });

    const { getByText } = render(<ProgressScreen />);

    expect(getByText('Your Progress')).toBeTruthy();
    expect(getByText('Keep up the great work!')).toBeTruthy();
  });

  it('displays zero stats when no progress', () => {
    const mockWordState = {
      terms: [],
      userProgress: {},
    };

    const mockStreakState = {
      currentStreak: 0,
      longestStreak: 0,
    };

    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockWordState);
      }
      return mockWordState;
    });

    (useStreakStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStreakState);
      }
      return mockStreakState;
    });

    const { getByText } = render(<ProgressScreen />);

    expect(getByText('0')).toBeTruthy(); // Terms Studied
    expect(getByText('0%')).toBeTruthy(); // Accuracy
    expect(getByText('0 days')).toBeTruthy(); // Longest Streak
  });

  it('calculates and displays total studied correctly', () => {
    const mockWordState = {
      terms: [],
      userProgress: {
        '1': { timesStudied: 5, timesCorrect: 4, masteryLevel: 'learning' as const, timesIncorrect: 1 },
        '2': { timesStudied: 10, timesCorrect: 8, masteryLevel: 'familiar' as const, timesIncorrect: 2 },
        '3': { timesStudied: 3, timesCorrect: 2, masteryLevel: 'new' as const, timesIncorrect: 1 },
      },
    };

    const mockStreakState = {
      currentStreak: 5,
      longestStreak: 10,
    };

    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockWordState);
      }
      return mockWordState;
    });

    (useStreakStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStreakState);
      }
      return mockStreakState;
    });

    const { getByText } = render(<ProgressScreen />);

    expect(getByText('18')).toBeTruthy(); // 5 + 10 + 3
    expect(getByText('Terms Studied')).toBeTruthy();
  });

  it('calculates and displays accuracy percentage correctly', () => {
    const mockWordState = {
      terms: [],
      userProgress: {
        '1': { timesStudied: 10, timesCorrect: 8, masteryLevel: 'learning' as const, timesIncorrect: 2 },
        '2': { timesStudied: 10, timesCorrect: 2, masteryLevel: 'new' as const, timesIncorrect: 8 },
      },
    };

    const mockStreakState = {
      currentStreak: 5,
      longestStreak: 10,
    };

    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockWordState);
      }
      return mockWordState;
    });

    (useStreakStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStreakState);
      }
      return mockStreakState;
    });

    const { getByText } = render(<ProgressScreen />);

    // 10 correct out of 20 studied = 50%
    expect(getByText('50%')).toBeTruthy();
    expect(getByText('Accuracy')).toBeTruthy();
  });

  it('displays mastered terms count correctly', () => {
    const mockWordState = {
      terms: [],
      userProgress: {
        '1': { timesStudied: 10, timesCorrect: 10, masteryLevel: 'mastered' as const, timesIncorrect: 0 },
        '2': { timesStudied: 10, timesCorrect: 8, masteryLevel: 'familiar' as const, timesIncorrect: 2 },
        '3': { timesStudied: 15, timesCorrect: 15, masteryLevel: 'mastered' as const, timesIncorrect: 0 },
      },
    };

    const mockStreakState = {
      currentStreak: 5,
      longestStreak: 10,
    };

    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockWordState);
      }
      return mockWordState;
    });

    (useStreakStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStreakState);
      }
      return mockStreakState;
    });

    const { getByText } = render(<ProgressScreen />);

    expect(getByText('2')).toBeTruthy(); // 2 mastered terms
    expect(getByText('Mastered')).toBeTruthy();
  });

  it('displays current streak correctly', () => {
    const mockWordState = {
      terms: [],
      userProgress: {},
    };

    const mockStreakState = {
      currentStreak: 7,
      longestStreak: 15,
    };

    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockWordState);
      }
      return mockWordState;
    });

    (useStreakStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStreakState);
      }
      return mockStreakState;
    });

    const { getByText } = render(<ProgressScreen />);

    expect(getByText('7')).toBeTruthy();
    expect(getByText('Day Streak')).toBeTruthy();
  });

  it('displays longest streak in achievements section', () => {
    const mockWordState = {
      terms: [],
      userProgress: {},
    };

    const mockStreakState = {
      currentStreak: 5,
      longestStreak: 25,
    };

    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockWordState);
      }
      return mockWordState;
    });

    (useStreakStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStreakState);
      }
      return mockStreakState;
    });

    const { getByText } = render(<ProgressScreen />);

    expect(getByText('Longest Streak')).toBeTruthy();
    expect(getByText('25 days')).toBeTruthy();
    expect(getByText('🔥')).toBeTruthy();
  });

  it('displays all stat labels correctly', () => {
    const mockWordState = {
      terms: [],
      userProgress: {},
    };

    const mockStreakState = {
      currentStreak: 0,
      longestStreak: 0,
    };

    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockWordState);
      }
      return mockWordState;
    });

    (useStreakStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStreakState);
      }
      return mockStreakState;
    });

    const { getByText } = render(<ProgressScreen />);

    expect(getByText('Terms Studied')).toBeTruthy();
    expect(getByText('Accuracy')).toBeTruthy();
    expect(getByText('Mastered')).toBeTruthy();
    expect(getByText('Day Streak')).toBeTruthy();
  });

  it('displays achievements section title', () => {
    const mockWordState = {
      terms: [],
      userProgress: {},
    };

    const mockStreakState = {
      currentStreak: 0,
      longestStreak: 0,
    };

    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockWordState);
      }
      return mockWordState;
    });

    (useStreakStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStreakState);
      }
      return mockStreakState;
    });

    const { getByText } = render(<ProgressScreen />);

    expect(getByText('Achievements')).toBeTruthy();
  });

  it('renders as scrollable view', () => {
    const mockWordState = {
      terms: [],
      userProgress: {},
    };

    const mockStreakState = {
      currentStreak: 0,
      longestStreak: 0,
    };

    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockWordState);
      }
      return mockWordState;
    });

    (useStreakStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStreakState);
      }
      return mockStreakState;
    });

    const { UNSAFE_getByType } = render(<ProgressScreen />);

    const ScrollView = require('react-native').ScrollView;
    expect(UNSAFE_getByType(ScrollView)).toBeTruthy();
  });

  it('handles 100% accuracy correctly', () => {
    const mockWordState = {
      terms: [],
      userProgress: {
        '1': { timesStudied: 10, timesCorrect: 10, masteryLevel: 'mastered' as const, timesIncorrect: 0 },
        '2': { timesStudied: 5, timesCorrect: 5, masteryLevel: 'mastered' as const, timesIncorrect: 0 },
      },
    };

    const mockStreakState = {
      currentStreak: 5,
      longestStreak: 10,
    };

    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockWordState);
      }
      return mockWordState;
    });

    (useStreakStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStreakState);
      }
      return mockStreakState;
    });

    const { getByText } = render(<ProgressScreen />);

    expect(getByText('100%')).toBeTruthy();
  });

  it('counts only mastered terms, not familiar or learning', () => {
    const mockWordState = {
      terms: [],
      userProgress: {
        '1': { timesStudied: 10, timesCorrect: 10, masteryLevel: 'mastered' as const, timesIncorrect: 0 },
        '2': { timesStudied: 8, timesCorrect: 7, masteryLevel: 'familiar' as const, timesIncorrect: 1 },
        '3': { timesStudied: 5, timesCorrect: 3, masteryLevel: 'learning' as const, timesIncorrect: 2 },
        '4': { timesStudied: 2, timesCorrect: 1, masteryLevel: 'new' as const, timesIncorrect: 1 },
      },
    };

    const mockStreakState = {
      currentStreak: 5,
      longestStreak: 10,
    };

    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockWordState);
      }
      return mockWordState;
    });

    (useStreakStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStreakState);
      }
      return mockStreakState;
    });

    const { getByText } = render(<ProgressScreen />);

    // Should show 1 mastered term (only term '1')
    expect(getByText('1')).toBeTruthy();
    expect(getByText('Mastered')).toBeTruthy();
  });
});
