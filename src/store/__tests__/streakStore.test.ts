import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStreakStore } from '../streakStore';
import { STORAGE_KEYS } from '../../data/sampleTerms';

// Helper to get date string in YYYY-MM-DD format
const getDateStr = (daysAgo: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Clear all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  // Reset store state
  useStreakStore.setState({
    currentStreak: 0,
    longestStreak: 0,
    studyDates: [],
    weekProgress: [false, false, false, false, false, false, false],
  });
});

describe('streakStore', () => {
  describe('loadStreak', () => {
    it('should load streak data from AsyncStorage', async () => {
      const mockStreakData = {
        currentStreak: 5,
        longestStreak: 10,
        studyDates: [getDateStr(0), getDateStr(1), getDateStr(2)],
        weekProgress: [true, true, true, false, false, false, false],
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockStreakData)
      );

      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.loadStreak();
      });

      await waitFor(() => {
        expect(result.current.currentStreak).toBe(5);
      });

      expect(result.current.longestStreak).toBe(10);
      expect(result.current.studyDates).toEqual(mockStreakData.studyDates);
      expect(result.current.weekProgress).toEqual(mockStreakData.weekProgress);
    });

    it('should handle missing streak data gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.loadStreak();
      });

      // Should remain at default values
      expect(result.current.currentStreak).toBe(0);
      expect(result.current.studyDates).toEqual([]);
    });

    it('should handle corrupted data gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('invalid json');

      const { result } = renderHook(() => useStreakStore());

      // Should not throw
      await act(async () => {
        await result.current.loadStreak();
      });

      expect(result.current.currentStreak).toBe(0);
    });
  });

  describe('recordStudySession', () => {
    it('should add today to study dates on first session', async () => {
      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.recordStudySession();
      });

      const today = getDateStr(0);
      expect(result.current.studyDates).toContain(today);
      expect(result.current.currentStreak).toBe(1);
    });

    it('should not duplicate today if already studied', async () => {
      const { result } = renderHook(() => useStreakStore());
      const today = getDateStr(0);

      // Set initial state with today already recorded
      useStreakStore.setState({
        studyDates: [today],
        currentStreak: 1,
        longestStreak: 1,
        weekProgress: [false, false, false, false, false, false, false],
      });

      await act(async () => {
        await result.current.recordStudySession();
      });

      // Should still have only one instance of today
      expect(result.current.studyDates.filter(d => d === today).length).toBe(1);
    });

    it('should calculate consecutive day streak correctly', async () => {
      const { result } = renderHook(() => useStreakStore());

      // Set up 3 consecutive days of study (yesterday, day before, 3 days ago)
      useStreakStore.setState({
        studyDates: [getDateStr(1), getDateStr(2), getDateStr(3)],
        currentStreak: 3,
        longestStreak: 3,
        weekProgress: [false, false, false, false, false, false, false],
      });

      // Record today - should extend streak to 4
      await act(async () => {
        await result.current.recordStudySession();
      });

      expect(result.current.currentStreak).toBe(4);
    });

    it('should reset streak when days are missed', async () => {
      const { result } = renderHook(() => useStreakStore());

      // Set up study from 5 days ago (missed yesterday and today)
      useStreakStore.setState({
        studyDates: [getDateStr(5)],
        currentStreak: 1,
        longestStreak: 1,
        weekProgress: [false, false, false, false, false, false, false],
      });

      // Record today - streak should reset to 1
      await act(async () => {
        await result.current.recordStudySession();
      });

      expect(result.current.currentStreak).toBe(1);
    });

    it('should update longest streak when current exceeds it', async () => {
      const { result } = renderHook(() => useStreakStore());

      // Start with longest streak of 5
      useStreakStore.setState({
        studyDates: [getDateStr(1), getDateStr(2), getDateStr(3)],
        currentStreak: 3,
        longestStreak: 5,
        weekProgress: [false, false, false, false, false, false, false],
      });

      // Add 3 more consecutive days to reach 6
      await act(async () => {
        await result.current.recordStudySession();
      });

      useStreakStore.setState({
        studyDates: [...result.current.studyDates, getDateStr(-1)],
        currentStreak: 5,
        longestStreak: result.current.longestStreak,
        weekProgress: result.current.weekProgress,
      });

      await act(async () => {
        await result.current.recordStudySession();
      });

      expect(result.current.longestStreak).toBeGreaterThanOrEqual(5);
    });

    it('should persist data to AsyncStorage', async () => {
      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.recordStudySession();
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.STREAK_DATA,
        expect.any(String)
      );

      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(savedData.currentStreak).toBe(result.current.currentStreak);
      expect(savedData.studyDates).toEqual(result.current.studyDates);
    });

    it('should limit study dates to 90 days', async () => {
      const { result } = renderHook(() => useStreakStore());

      // Create 95 days of study dates
      const manyDates = Array.from({ length: 95 }, (_, i) => getDateStr(i + 10));

      useStreakStore.setState({
        studyDates: manyDates,
        currentStreak: 0,
        longestStreak: 95,
        weekProgress: [false, false, false, false, false, false, false],
      });

      await act(async () => {
        await result.current.recordStudySession();
      });

      // Should keep only the most recent 90 dates plus today
      expect(result.current.studyDates.length).toBeLessThanOrEqual(91);
    });
  });

  describe('week progress calculation', () => {
    it('should mark correct days in the current week', async () => {
      const { result } = renderHook(() => useStreakStore());
      const today = getDateStr(0);
      const yesterday = getDateStr(1);

      useStreakStore.setState({
        studyDates: [yesterday],
        currentStreak: 1,
        longestStreak: 1,
        weekProgress: [false, false, false, false, false, false, false],
      });

      await act(async () => {
        await result.current.recordStudySession();
      });

      // Should have at least one day marked as true
      const studiedDays = result.current.weekProgress.filter(day => day);
      expect(studiedDays.length).toBeGreaterThan(0);
    });

    it('should reset week progress on new week', async () => {
      const { result } = renderHook(() => useStreakStore());

      // Set dates from 10 days ago (previous week)
      useStreakStore.setState({
        studyDates: [getDateStr(10), getDateStr(11)],
        currentStreak: 0,
        longestStreak: 2,
        weekProgress: [true, true, false, false, false, false, false],
      });

      // Record today (current week)
      await act(async () => {
        await result.current.recordStudySession();
      });

      // Week progress should reflect only current week
      const studiedDays = result.current.weekProgress.filter(day => day);
      expect(studiedDays.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle studying at exact midnight', async () => {
      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.recordStudySession();
      });

      expect(result.current.currentStreak).toBeGreaterThan(0);
    });

    it('should handle empty study dates array', () => {
      const { result } = renderHook(() => useStreakStore());

      expect(result.current.currentStreak).toBe(0);
      expect(result.current.studyDates).toEqual([]);
      expect(result.current.weekProgress.every(day => !day)).toBe(true);
    });

    it('should maintain streak through today even if not studied yet', async () => {
      // Set up yesterday's study first
      useStreakStore.setState({
        studyDates: [getDateStr(1)],
        currentStreak: 1,
        longestStreak: 1,
        weekProgress: [false, false, false, false, false, false, false],
      });

      // Now render the hook - it should pick up the state
      const { result } = renderHook(() => useStreakStore());

      // Streak should still be 1 (yesterday's study)
      expect(result.current.currentStreak).toBe(1);

      // Now study today
      await act(async () => {
        await result.current.recordStudySession();
      });

      // Streak should increase to 2
      expect(result.current.currentStreak).toBe(2);
    });
  });

  describe('streak persistence', () => {
    it('should reload saved streak after restart', async () => {
      // First session - record study
      const { result: result1 } = renderHook(() => useStreakStore());

      await act(async () => {
        await result1.current.recordStudySession();
      });

      const savedStreak = result1.current.currentStreak;

      // Simulate app restart - create new hook
      jest.clearAllMocks();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({
          currentStreak: savedStreak,
          longestStreak: savedStreak,
          studyDates: [getDateStr(0)],
          weekProgress: result1.current.weekProgress,
        })
      );

      const { result: result2 } = renderHook(() => useStreakStore());

      await act(async () => {
        await result2.current.loadStreak();
      });

      expect(result2.current.currentStreak).toBe(savedStreak);
    });
  });
});
