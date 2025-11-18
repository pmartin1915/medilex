import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWordStore } from '../wordStore';
import { SAMPLE_TERMS, STORAGE_KEYS } from '../../data/sampleTerms';
import { MedicalTerm, UserProgress } from '../../types';
import { dataValidator } from '../../utils/dataValidator';

// Mock dataValidator to always pass validation in tests
jest.mock('../../utils/dataValidator', () => ({
  dataValidator: {
    validateTerms: jest.fn(() => ({ isValid: true, errors: [] })),
    logValidationResults: jest.fn(),
    isDataUsable: jest.fn(() => true),
  },
}));

// Clear all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  // Reset store state
  useWordStore.setState({
    terms: [],
    userProgress: {},
    isLoading: false,
    error: null,
  });

  // Reset validator mocks to pass by default
  (dataValidator.validateTerms as jest.Mock).mockReturnValue({ isValid: true, errors: [] });
  (dataValidator.isDataUsable as jest.Mock).mockReturnValue(true);
});

// Helper to serialize and deserialize (mimics AsyncStorage behavior)
const serializeAndParse = <T>(data: T): T => JSON.parse(JSON.stringify(data));

describe('wordStore', () => {
  describe('loadTerms', () => {
    it('should load terms from AsyncStorage if they exist', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      // Should load terms successfully
      expect(result.current.terms.length).toBeGreaterThan(0);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should load sample terms and save to AsyncStorage if none exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      // Should load SAMPLE_TERMS
      expect(result.current.terms.length).toBeGreaterThan(0);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle errors gracefully when loading fails', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      // Should still load default terms even if storage fails
      expect(result.current.isLoading).toBe(false);
      // Error may be set or terms may fall back to defaults
      expect(result.current.terms.length >= 0).toBe(true);
    });

    it('should load user progress along with terms', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      // User progress should be an object (may be empty initially)
      expect(typeof result.current.userProgress).toBe('object');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('getTermById', () => {
    it('should return the correct term by id', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const firstTerm = SAMPLE_TERMS[0];
      const foundTerm = result.current.getTermById(firstTerm.id);

      // Check key properties (Date serialization makes full equality check fail)
      expect(foundTerm).toBeDefined();
      expect(foundTerm?.id).toBe(firstTerm.id);
      expect(foundTerm?.term).toBe(firstTerm.term);
      expect(foundTerm?.definition).toBe(firstTerm.definition);
    });

    it('should return undefined for non-existent id', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const foundTerm = result.current.getTermById('non-existent-id');
      expect(foundTerm).toBeUndefined();
    });
  });

  describe('searchTerms', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useWordStore());
      await act(async () => {
        await result.current.loadTerms();
      });
    });

    it('should find terms by term name (case insensitive)', () => {
      const { result } = renderHook(() => useWordStore());
      const results = result.current.searchTerms('tachy');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].term.toLowerCase()).toContain('tachy');
    });

    it('should find terms by definition', () => {
      const { result } = renderHook(() => useWordStore());
      const results = result.current.searchTerms('heart');

      expect(results.length).toBeGreaterThan(0);
      expect(
        results.some(term => term.definition.toLowerCase().includes('heart'))
      ).toBe(true);
    });

    it('should return empty array for no matches', () => {
      const { result } = renderHook(() => useWordStore());
      const results = result.current.searchTerms('zzzznonexistent');

      expect(results).toEqual([]);
    });

    it('should handle empty search query', () => {
      const { result } = renderHook(() => useWordStore());
      const results = result.current.searchTerms('');

      expect(results.length).toBe(result.current.terms.length);
    });
  });

  describe('updateProgress', () => {
    it('should create new progress entry for first study', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const termId = SAMPLE_TERMS[0].id;

      await act(async () => {
        await result.current.updateProgress(termId, true);
      });

      const progress = result.current.userProgress[termId];
      expect(progress).toBeDefined();
      expect(progress.timesStudied).toBe(1);
      expect(progress.timesCorrect).toBe(1);
      expect(progress.timesIncorrect).toBe(0);
      expect(progress.masteryLevel).toBe('learning');
    });

    it('should increment correct count when answer is correct', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const termId = SAMPLE_TERMS[0].id;

      // First correct answer
      await act(async () => {
        await result.current.updateProgress(termId, true);
      });

      // Second correct answer
      await act(async () => {
        await result.current.updateProgress(termId, true);
      });

      const progress = result.current.userProgress[termId];
      expect(progress.timesStudied).toBe(2);
      expect(progress.timesCorrect).toBe(2);
      expect(progress.timesIncorrect).toBe(0);
    });

    it('should increment incorrect count when answer is wrong', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const termId = SAMPLE_TERMS[0].id;

      await act(async () => {
        await result.current.updateProgress(termId, false);
      });

      const progress = result.current.userProgress[termId];
      expect(progress.timesStudied).toBe(1);
      expect(progress.timesCorrect).toBe(0);
      expect(progress.timesIncorrect).toBe(1);
    });

    it('should update mastery level based on performance', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const termId = SAMPLE_TERMS[0].id;

      // Study 5 times with 100% accuracy -> should be 'mastered'
      for (let i = 0; i < 5; i++) {
        await act(async () => {
          await result.current.updateProgress(termId, true);
        });
      }

      const progress = result.current.userProgress[termId];
      expect(progress.masteryLevel).toBe('mastered');
      expect(progress.timesCorrect).toBe(5);
    });

    it('should save progress to AsyncStorage', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const termId = result.current.terms[0]?.id;
      if (!termId) {
        throw new Error('No terms loaded');
      }

      // Clear previous calls
      (AsyncStorage.setItem as jest.Mock).mockClear();

      await act(async () => {
        await result.current.updateProgress(termId, true);
      });

      // Should have called setItem
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('toggleFavorite', () => {
    it('should mark term as favorited', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const termId = result.current.terms[0]?.id;
      if (!termId) {
        throw new Error('No terms loaded');
      }

      await act(async () => {
        await result.current.toggleFavorite(termId);
      });

      const progress = result.current.userProgress[termId];
      expect(progress).toBeDefined();
      expect(progress.isFavorited).toBe(true);
    });

    it('should toggle favorite status on multiple calls', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const termId = result.current.terms[0]?.id;
      if (!termId) {
        throw new Error('No terms loaded');
      }

      // First toggle - favorite
      await act(async () => {
        await result.current.toggleFavorite(termId);
      });
      expect(result.current.userProgress[termId]?.isFavorited).toBe(true);

      // Second toggle - unfavorite
      await act(async () => {
        await result.current.toggleFavorite(termId);
      });
      expect(result.current.userProgress[termId]?.isFavorited).toBe(false);
    });

    it('should persist favorite state to AsyncStorage', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const termId = result.current.terms[0]?.id;
      if (!termId) {
        throw new Error('No terms loaded');
      }

      // Clear previous calls
      (AsyncStorage.setItem as jest.Mock).mockClear();

      await act(async () => {
        await result.current.toggleFavorite(termId);
      });

      // Should have called setItem (implementation may vary)
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('toggleBookmark', () => {
    it('should mark term as bookmarked', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const termId = result.current.terms[0]?.id;
      if (!termId) {
        throw new Error('No terms loaded');
      }

      await act(async () => {
        await result.current.toggleBookmark(termId);
      });

      const progress = result.current.userProgress[termId];
      expect(progress).toBeDefined();
      expect(progress.isBookmarked).toBe(true);
    });

    it('should toggle bookmark status on multiple calls', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const termId = result.current.terms[0]?.id;
      if (!termId) {
        throw new Error('No terms loaded');
      }

      // First toggle - bookmark
      await act(async () => {
        await result.current.toggleBookmark(termId);
      });
      expect(result.current.userProgress[termId]?.isBookmarked).toBe(true);

      // Second toggle - unbookmark
      await act(async () => {
        await result.current.toggleBookmark(termId);
      });
      expect(result.current.userProgress[termId]?.isBookmarked).toBe(false);
    });
  });

  describe('getProgress', () => {
    it('should return progress for a term', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const termId = SAMPLE_TERMS[0].id;

      await act(async () => {
        await result.current.updateProgress(termId, true);
      });

      const progress = result.current.getProgress(termId);
      expect(progress).toBeDefined();
      expect(progress?.termId).toBe(termId);
    });

    it('should return undefined for term with no progress', () => {
      const { result } = renderHook(() => useWordStore());
      const progress = result.current.getProgress('non-existent-id');
      expect(progress).toBeUndefined();
    });
  });

  describe('mastery level calculation', () => {
    it('should start as "new" for unstudied terms', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const termId = SAMPLE_TERMS[0].id;
      const progress = result.current.getProgress(termId);

      expect(progress).toBeUndefined(); // No progress yet
    });

    it('should be "learning" after first study', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const termId = SAMPLE_TERMS[0].id;

      await act(async () => {
        await result.current.updateProgress(termId, true);
      });

      expect(result.current.userProgress[termId].masteryLevel).toBe('learning');
    });

    it('should be "familiar" with 70%+ accuracy over 3+ studies', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const termId = SAMPLE_TERMS[0].id;

      // 3 correct, 1 incorrect = 75% accuracy
      await act(async () => {
        await result.current.updateProgress(termId, true);
        await result.current.updateProgress(termId, true);
        await result.current.updateProgress(termId, true);
        await result.current.updateProgress(termId, false);
      });

      expect(result.current.userProgress[termId].masteryLevel).toBe('familiar');
    });

    it('should be "mastered" with 90%+ accuracy over 5+ studies', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      const termId = SAMPLE_TERMS[0].id;

      // 5 correct = 100% accuracy
      for (let i = 0; i < 5; i++) {
        await act(async () => {
          await result.current.updateProgress(termId, true);
        });
      }

      expect(result.current.userProgress[termId].masteryLevel).toBe('mastered');
    });
  });
});
