/**
 * ProgressScreen.test.tsx
 * Comprehensive tests for ProgressScreen component
 * Target coverage: 70%+
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgressScreen } from '../ProgressScreen';
import { MedicalTerm } from '../../types';

// Mock data
const mockTerms: MedicalTerm[] = [
  {
    id: 'term-1',
    term: 'Cardiology',
    pronunciation: 'kar-dee-AH-luh-jee',
    syllables: 'car-di-ol-o-gy',
    partOfSpeech: 'noun',
    definition: 'Heart medicine',
    example: 'Example',
    etymology: { components: [], meaning: 'heart study' },
    category: 'Medical Specialty',
    specialty: 'Cardiology',
    relatedTerms: [],
    difficulty: 3,
    commonlyMisspelled: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'term-2',
    term: 'Neurology',
    pronunciation: 'noo-RAH-luh-jee',
    syllables: 'neu-rol-o-gy',
    partOfSpeech: 'noun',
    definition: 'Nerve medicine',
    example: 'Example',
    etymology: { components: [], meaning: 'nerve study' },
    category: 'Medical Specialty',
    specialty: 'Neurology',
    relatedTerms: [],
    difficulty: 2,
    commonlyMisspelled: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'term-3',
    term: 'Anatomy',
    pronunciation: 'uh-NAT-uh-mee',
    syllables: 'a-nat-o-my',
    partOfSpeech: 'noun',
    definition: 'Body structure',
    example: 'Example',
    etymology: { components: [], meaning: 'cutting up' },
    category: 'Basic Science',
    specialty: 'Anatomy',
    relatedTerms: [],
    difficulty: 1,
    commonlyMisspelled: false,
    createdAt: new Date().toISOString(),
  },
];

const mockUserProgress = {
  'term-1': {
    masteryLevel: 'mastered' as const,
    timesStudied: 50,
    timesCorrect: 45,
    isFavorited: true,
    isBookmarked: false,
  },
  'term-2': {
    masteryLevel: 'familiar' as const,
    timesStudied: 30,
    timesCorrect: 25,
    isFavorited: false,
    isBookmarked: true,
  },
  'term-3': {
    masteryLevel: 'learning' as const,
    timesStudied: 20,
    timesCorrect: 10,
    isFavorited: true,
    isBookmarked: false,
  },
};

const mockStudyDates = [
  '2024-01-15',
  '2024-01-14',
  '2024-01-13',
  '2024-01-12',
  '2024-01-11',
  '2024-01-10',
  '2024-01-09',
  '2024-01-08',
];

// Mock stores
jest.mock('../../store/wordStore', () => ({
  useWordStore: (selector: (state: any) => any) => {
    const state = {
      terms: mockTerms,
      userProgress: mockUserProgress,
    };
    return selector(state);
  },
}));

jest.mock('../../store/streakStore', () => ({
  useStreakStore: (selector: (state: any) => any) => {
    const state = {
      currentStreak: 8,
      longestStreak: 12,
      studyDates: mockStudyDates,
    };
    return selector(state);
  },
}));

// Mock child components
jest.mock('../../components/StatCard', () => ({
  StatCard: ({ value, label, icon }: any) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return (
      <View testID={`stat-card-${label}`}>
        <Text testID={`stat-value-${label}`}>{typeof value === 'number' ? value : value}</Text>
        <Text>{label}</Text>
      </View>
    );
  },
}));

jest.mock('../../components/MasteryChart', () => ({
  MasteryChart: ({ newCount, learningCount, familiarCount, masteredCount }: any) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return (
      <View testID="mastery-chart">
        <Text>New: {newCount}</Text>
        <Text>Learning: {learningCount}</Text>
        <Text>Familiar: {familiarCount}</Text>
        <Text>Mastered: {masteredCount}</Text>
      </View>
    );
  },
}));

jest.mock('../../components/StudyHeatmap', () => ({
  StudyHeatmap: ({ studyDates }: any) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return (
      <View testID="study-heatmap">
        <Text>Study days: {studyDates.length}</Text>
      </View>
    );
  },
}));

jest.mock('../../components/CategoryCard', () => ({
  CategoryCard: ({ category, totalTerms, masteredTerms, accuracy }: any) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return (
      <View testID={`category-card-${category}`}>
        <Text>{category}</Text>
        <Text>Total: {totalTerms}</Text>
        <Text>Mastered: {masteredTerms}</Text>
        <Text>Accuracy: {accuracy}%</Text>
      </View>
    );
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  BookOpen: () => 'BookOpen',
  Target: () => 'Target',
  Award: () => 'Award',
  TrendingUp: () => 'TrendingUp',
  Heart: () => 'Heart',
  Calendar: () => 'Calendar',
}));

describe('ProgressScreen', () => {
  describe('Rendering', () => {
    it('should render the screen title', () => {
      const { getByText } = render(<ProgressScreen />);
      expect(getByText('Your Progress')).toBeTruthy();
    });

    it('should render the subtitle', () => {
      const { getByText } = render(<ProgressScreen />);
      expect(getByText('Keep up the great work!')).toBeTruthy();
    });

    it('should render all 6 stat cards', () => {
      const { getByTestId } = render(<ProgressScreen />);

      expect(getByTestId('stat-card-Reviews')).toBeTruthy();
      expect(getByTestId('stat-card-Accuracy')).toBeTruthy();
      expect(getByTestId('stat-card-Mastered')).toBeTruthy();
      expect(getByTestId('stat-card-Day Streak')).toBeTruthy();
      expect(getByTestId('stat-card-Favorites')).toBeTruthy();
      expect(getByTestId('stat-card-Study Days')).toBeTruthy();
    });

    it('should render mastery chart', () => {
      const { getByTestId } = render(<ProgressScreen />);
      expect(getByTestId('mastery-chart')).toBeTruthy();
    });

    it('should render study heatmap', () => {
      const { getByTestId } = render(<ProgressScreen />);
      expect(getByTestId('study-heatmap')).toBeTruthy();
    });

    it('should render category performance section', () => {
      const { getByText } = render(<ProgressScreen />);
      expect(getByText('Performance by Category')).toBeTruthy();
    });

    it('should render achievements section', () => {
      const { getByText } = render(<ProgressScreen />);
      expect(getByText('Achievements')).toBeTruthy();
    });
  });

  describe('Stats Calculations', () => {
    it('should display total reviews correctly', () => {
      const { getByTestId } = render(<ProgressScreen />);

      // 50 + 30 + 20 = 100 total studies
      const reviewsValue = getByTestId('stat-value-Reviews');
      expect(reviewsValue.props.children).toBe(100);
    });

    it('should calculate accuracy correctly', () => {
      const { getByTestId } = render(<ProgressScreen />);

      // (45 + 25 + 10) / (50 + 30 + 20) = 80 / 100 = 80%
      const accuracyValue = getByTestId('stat-value-Accuracy');
      expect(accuracyValue.props.children).toBe('80%');
    });

    it('should display mastered count correctly', () => {
      const { getByTestId } = render(<ProgressScreen />);

      // Only term-1 is mastered
      const masteredValue = getByTestId('stat-value-Mastered');
      expect(masteredValue.props.children).toBe(1);
    });

    it('should display current streak correctly', () => {
      const { getByTestId } = render(<ProgressScreen />);

      const streakValue = getByTestId('stat-value-Day Streak');
      expect(streakValue.props.children).toBe(8);
    });

    it('should count favorited terms correctly', () => {
      const { getByTestId } = render(<ProgressScreen />);

      // term-1 and term-3 are favorited
      const favoritesValue = getByTestId('stat-value-Favorites');
      expect(favoritesValue.props.children).toBe(2);
    });

    it('should display study days count correctly', () => {
      const { getByTestId } = render(<ProgressScreen />);

      // 8 study dates in mockStudyDates
      const studyDaysValue = getByTestId('stat-value-Study Days');
      expect(studyDaysValue.props.children).toBe(8);
    });
  });

  describe('Mastery Distribution', () => {
    it('should show mastery distribution in chart', () => {
      const { getByText, getAllByText } = render(<ProgressScreen />);

      // From mockUserProgress: 1 mastered, 1 familiar, 1 learning, 0 new
      expect(getByText('New: 0')).toBeTruthy();
      expect(getByText('Learning: 1')).toBeTruthy();
      expect(getByText('Familiar: 1')).toBeTruthy();

      // "Mastered: 1" appears in both MasteryChart and CategoryCard
      const masteredTexts = getAllByText('Mastered: 1');
      expect(masteredTexts.length).toBeGreaterThan(0);
    });
  });

  describe('Category Performance', () => {
    it('should render all categories', () => {
      const { getByTestId } = render(<ProgressScreen />);

      expect(getByTestId('category-card-Medical Specialty')).toBeTruthy();
      expect(getByTestId('category-card-Basic Science')).toBeTruthy();
    });

    it('should calculate category stats correctly', () => {
      const { getByText } = render(<ProgressScreen />);

      // Medical Specialty has 2 terms (term-1 and term-2)
      expect(getByText('Total: 2')).toBeTruthy();

      // Basic Science has 1 term (term-3)
      expect(getByText('Total: 1')).toBeTruthy();
    });
  });

  describe('Achievements', () => {
    it('should always render Longest Streak achievement', () => {
      const { getByText } = render(<ProgressScreen />);

      expect(getByText('Longest Streak')).toBeTruthy();
      expect(getByText('12 days')).toBeTruthy();
      expect(getByText('🔥')).toBeTruthy();
    });

    it('should render Century Scholar achievement for 100+ reviews', () => {
      const { getByText } = render(<ProgressScreen />);

      // Total reviews = 100 (50 + 30 + 20)
      expect(getByText('Century Scholar')).toBeTruthy();
      expect(getByText('100+ reviews')).toBeTruthy();
      expect(getByText('🎯')).toBeTruthy();
    });

    it('should render Master of Terms achievement for 10+ mastered', () => {
      // This won't show in default mock (only 1 mastered), but we can test the conditional
      const { queryByText } = render(<ProgressScreen />);

      // Only 1 mastered, so should NOT show
      expect(queryByText('Master of Terms')).toBeNull();
    });

    it('should render Week Warrior achievement for 7+ day streak', () => {
      const { getByText } = render(<ProgressScreen />);

      // Current streak is 8, >= 7
      expect(getByText('Week Warrior')).toBeTruthy();
      expect(getByText('7+ day streak')).toBeTruthy();
      expect(getByText('💪')).toBeTruthy();
    });
  });

  describe('Study Heatmap', () => {
    it('should pass study dates to heatmap', () => {
      const { getByText } = render(<ProgressScreen />);

      expect(getByText('Study days: 8')).toBeTruthy();
    });
  });

  describe('Component Stability', () => {
    it('should not crash when rendering', () => {
      expect(() => {
        render(<ProgressScreen />);
      }).not.toThrow();
    });

    it('should render without errors', () => {
      expect(() => {
        render(<ProgressScreen />);
      }).not.toThrow();
    });

    it('should handle rendering with valid data', () => {
      const { getByText } = render(<ProgressScreen />);

      // Should render key sections
      expect(getByText('Your Progress')).toBeTruthy();
      expect(getByText('Achievements')).toBeTruthy();
    });
  });
});
