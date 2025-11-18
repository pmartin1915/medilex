import { renderHook, act } from '@testing-library/react-native';
import { useWordStore } from '../wordStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('wordStore', () => {
  beforeEach(() => {
    // Clear AsyncStorage before each test
    AsyncStorage.clear();
    // Reset store state
    useWordStore.setState({
      terms: [],
      userProgress: {},
      isLoading: false,
      error: null,
    });
  });

  describe('loadTerms', () => {
    it('loads sample terms on first load', async () => {
      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      expect(result.current.terms.length).toBeGreaterThan(0);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('loads terms from AsyncStorage if available', async () => {
      const mockTerms = [
        {
          id: '1',
          term: 'Test Term',
          definition: 'Test Definition',
          category: 'Test',
          pronunciation: '/test/',
          syllables: 'test',
          partOfSpeech: 'noun',
          etymology: { roots: [], meaning: 'test' },
          example: 'Test example',
          relatedTerms: [],
        },
      ];

      await AsyncStorage.setItem(
        '@vocab_app:terms',
        JSON.stringify(mockTerms)
      );

      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      expect(result.current.terms).toEqual(mockTerms);
    });

    it('handles loading errors gracefully', async () => {
      // Force an error by mocking AsyncStorage.getItem to throw
      jest
        .spyOn(AsyncStorage, 'getItem')
        .mockRejectedValueOnce(new Error('Storage error'));

      const { result } = renderHook(() => useWordStore());

      await act(async () => {
        await result.current.loadTerms();
      });

      // Should still have sample terms loaded as fallback
      expect(result.current.terms.length).toBeGreaterThan(0);
    });
  });

  describe('searchTerms', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useWordStore());
      await act(async () => {
        await result.current.loadTerms();
      });
    });

    it('returns all terms for empty query', () => {
      const { result } = renderHook(() => useWordStore());
      const searchResults = result.current.searchTerms('');

      expect(searchResults.length).toBe(result.current.terms.length);
    });

    it('filters terms by term name', () => {
      const { result } = renderHook(() => useWordStore());
      const searchResults = result.current.searchTerms('tachy');

      expect(searchResults.length).toBeGreaterThan(0);
      expect(
        searchResults.some((term) => term.term.toLowerCase().includes('tachy'))
      ).toBe(true);
    });

    it('filters terms by definition', () => {
      const { result } = renderHook(() => useWordStore());
      const searchResults = result.current.searchTerms('heart');

      expect(searchResults.length).toBeGreaterThan(0);
    });

    it('is case insensitive', () => {
      const { result } = renderHook(() => useWordStore());
      const lowerResults = result.current.searchTerms('heart');
      const upperResults = result.current.searchTerms('HEART');
      const mixedResults = result.current.searchTerms('HeArT');

      expect(lowerResults.length).toBe(upperResults.length);
      expect(lowerResults.length).toBe(mixedResults.length);
    });
  });

  describe('getTermById', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useWordStore());
      await act(async () => {
        await result.current.loadTerms();
      });
    });

    it('returns term when ID exists', () => {
      const { result } = renderHook(() => useWordStore());
      const firstTermId = result.current.terms[0]?.id;

      if (firstTermId) {
        const term = result.current.getTermById(firstTermId);
        expect(term).toBeTruthy();
        expect(term?.id).toBe(firstTermId);
      }
    });

    it('returns undefined when ID does not exist', () => {
      const { result } = renderHook(() => useWordStore());
      const term = result.current.getTermById('nonexistent-id');

      expect(term).toBeUndefined();
    });
  });

  describe('updateProgress', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useWordStore());
      await act(async () => {
        await result.current.loadTerms();
      });
    });

    it('creates progress entry for new term', async () => {
      const { result } = renderHook(() => useWordStore());
      const termId = result.current.terms[0]?.id;

      if (termId) {
        await act(async () => {
          await result.current.updateProgress(termId, true);
        });

        const progress = result.current.getProgress(termId);
        expect(progress).toBeTruthy();
        expect(progress?.timesStudied).toBe(1);
        expect(progress?.timesCorrect).toBe(1);
        expect(progress?.timesIncorrect).toBe(0);
      }
    });

    it('increments correct count when answer is correct', async () => {
      const { result } = renderHook(() => useWordStore());
      const termId = result.current.terms[0]?.id;

      if (termId) {
        await act(async () => {
          await result.current.updateProgress(termId, true);
          await result.current.updateProgress(termId, true);
        });

        const progress = result.current.getProgress(termId);
        expect(progress?.timesCorrect).toBe(2);
        expect(progress?.timesStudied).toBe(2);
      }
    });

    it('increments incorrect count when answer is incorrect', async () => {
      const { result } = renderHook(() => useWordStore());
      const termId = result.current.terms[0]?.id;

      if (termId) {
        await act(async () => {
          await result.current.updateProgress(termId, false);
        });

        const progress = result.current.getProgress(termId);
        expect(progress?.timesIncorrect).toBe(1);
        expect(progress?.timesCorrect).toBe(0);
        expect(progress?.timesStudied).toBe(1);
      }
    });

    it('updates mastery level based on accuracy', async () => {
      const { result } = renderHook(() => useWordStore());
      const termId = result.current.terms[0]?.id;

      if (termId) {
        // Answer correctly multiple times to increase mastery
        await act(async () => {
          for (let i = 0; i < 5; i++) {
            await result.current.updateProgress(termId, true);
          }
        });

        const progress = result.current.getProgress(termId);
        expect(progress?.masteryLevel).toBe('mastered');
      }
    });
  });

  describe('toggleFavorite', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useWordStore());
      await act(async () => {
        await result.current.loadTerms();
      });
    });

    it('toggles favorite status from false to true', async () => {
      const { result } = renderHook(() => useWordStore());
      const termId = result.current.terms[0]?.id;

      if (termId) {
        await act(async () => {
          await result.current.toggleFavorite(termId);
        });

        const progress = result.current.getProgress(termId);
        expect(progress?.isFavorited).toBe(true);
      }
    });

    it('toggles favorite status from true to false', async () => {
      const { result } = renderHook(() => useWordStore());
      const termId = result.current.terms[0]?.id;

      if (termId) {
        await act(async () => {
          await result.current.toggleFavorite(termId);
          await result.current.toggleFavorite(termId);
        });

        const progress = result.current.getProgress(termId);
        expect(progress?.isFavorited).toBe(false);
      }
    });
  });

  describe('toggleBookmark', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useWordStore());
      await act(async () => {
        await result.current.loadTerms();
      });
    });

    it('toggles bookmark status from false to true', async () => {
      const { result } = renderHook(() => useWordStore());
      const termId = result.current.terms[0]?.id;

      if (termId) {
        await act(async () => {
          await result.current.toggleBookmark(termId);
        });

        const progress = result.current.getProgress(termId);
        expect(progress?.isBookmarked).toBe(true);
      }
    });

    it('toggles bookmark status from true to false', async () => {
      const { result } = renderHook(() => useWordStore());
      const termId = result.current.terms[0]?.id;

      if (termId) {
        await act(async () => {
          await result.current.toggleBookmark(termId);
          await result.current.toggleBookmark(termId);
        });

        const progress = result.current.getProgress(termId);
        expect(progress?.isBookmarked).toBe(false);
      }
    });
  });
});
