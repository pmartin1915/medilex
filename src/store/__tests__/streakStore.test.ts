import { renderHook, act } from '@testing-library/react-native';
import { useStreakStore } from '../streakStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('streakStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    // Reset store state
    useStreakStore.setState({
      currentStreak: 0,
      longestStreak: 0,
      studyDates: [],
      weekProgress: [false, false, false, false, false, false, false],
    });
  });

  describe('loadStreak', () => {
    it('loads streak data from AsyncStorage', async () => {
      const mockStreakData = {
        currentStreak: 5,
        longestStreak: 10,
        studyDates: ['2025-01-01', '2025-01-02'],
        weekProgress: [true, true, false, false, false, false, false],
      };

      await AsyncStorage.setItem(
        '@vocab_app:streak_data',
        JSON.stringify(mockStreakData)
      );

      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.loadStreak();
      });

      expect(result.current.currentStreak).toBe(5);
      expect(result.current.longestStreak).toBe(10);
      expect(result.current.studyDates).toEqual(['2025-01-01', '2025-01-02']);
      expect(result.current.weekProgress).toEqual([true, true, false, false, false, false, false]);
    });

    it('handles no saved streak data gracefully', async () => {
      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.loadStreak();
      });

      expect(result.current.currentStreak).toBe(0);
      expect(result.current.longestStreak).toBe(0);
      expect(result.current.studyDates).toEqual([]);
    });

    it('handles corrupted data gracefully', async () => {
      await AsyncStorage.setItem('@vocab_app:streak_data', 'invalid json');

      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.loadStreak();
      });

      // Should not throw and maintain initial state
      expect(result.current.currentStreak).toBe(0);
    });
  });

  describe('recordStudySession', () => {
    it('records a study session for today', async () => {
      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.recordStudySession();
      });

      const today = new Date().toISOString().split('T')[0];

      expect(result.current.studyDates).toContain(today);
      expect(result.current.currentStreak).toBeGreaterThanOrEqual(1);
    });

    it('does not record duplicate sessions for same day', async () => {
      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.recordStudySession();
        await result.current.recordStudySession();
      });

      const today = new Date().toISOString().split('T')[0];
      const todayCount = result.current.studyDates.filter(d => d === today).length;

      expect(todayCount).toBe(1);
    });

    it('updates current streak correctly', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      useStreakStore.setState({
        studyDates: [yesterdayStr],
        currentStreak: 1,
        longestStreak: 1,
        weekProgress: [false, false, false, false, false, false, false],
      });

      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.recordStudySession();
      });

      expect(result.current.currentStreak).toBe(2);
    });

    it('updates longest streak when current exceeds it', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      useStreakStore.setState({
        studyDates: [yesterdayStr],
        currentStreak: 1,
        longestStreak: 1,
        weekProgress: [false, false, false, false, false, false, false],
      });

      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.recordStudySession();
      });

      expect(result.current.longestStreak).toBe(2);
    });

    it('does not decrease longest streak', async () => {
      useStreakStore.setState({
        studyDates: [],
        currentStreak: 0,
        longestStreak: 10,
        weekProgress: [false, false, false, false, false, false, false],
      });

      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.recordStudySession();
      });

      expect(result.current.longestStreak).toBe(10);
    });

    it('saves streak data to AsyncStorage', async () => {
      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.recordStudySession();
      });

      const saved = await AsyncStorage.getItem('@vocab_app:streak_data');
      expect(saved).toBeTruthy();

      const parsed = JSON.parse(saved!);
      expect(parsed).toHaveProperty('currentStreak');
      expect(parsed).toHaveProperty('longestStreak');
      expect(parsed).toHaveProperty('studyDates');
      expect(parsed).toHaveProperty('weekProgress');
    });

    it('updates week progress correctly', async () => {
      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.recordStudySession();
      });

      // Week progress should have at least one true value for today
      const hasProgress = result.current.weekProgress.some(day => day === true);
      expect(hasProgress).toBe(true);
    });

    it('limits study dates to 90 days', async () => {
      const oldDates = Array.from({ length: 100 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (100 - i));
        return date.toISOString().split('T')[0];
      });

      useStreakStore.setState({
        studyDates: oldDates,
        currentStreak: 0,
        longestStreak: 0,
        weekProgress: [false, false, false, false, false, false, false],
      });

      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.recordStudySession();
      });

      expect(result.current.studyDates.length).toBeLessThanOrEqual(90);
    });

    it('resets streak when days are skipped', async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];

      useStreakStore.setState({
        studyDates: [twoDaysAgoStr],
        currentStreak: 1,
        longestStreak: 5,
        weekProgress: [false, false, false, false, false, false, false],
      });

      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.recordStudySession();
      });

      // Streak should reset to 1 because we skipped yesterday
      expect(result.current.currentStreak).toBe(1);
      expect(result.current.longestStreak).toBe(5); // Longest should not decrease
    });
  });

  describe('initial state', () => {
    it('has correct initial values', () => {
      const { result } = renderHook(() => useStreakStore());

      expect(result.current.currentStreak).toBe(0);
      expect(result.current.longestStreak).toBe(0);
      expect(result.current.studyDates).toEqual([]);
      expect(result.current.weekProgress).toEqual([false, false, false, false, false, false, false]);
    });
  });

  describe('week progress calculation', () => {
    it('marks correct days of current week', async () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      monday.setHours(0, 0, 0, 0);

      const mondayStr = monday.toISOString().split('T')[0];
      const tuesdayStr = new Date(monday.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      useStreakStore.setState({
        studyDates: [mondayStr, tuesdayStr],
        currentStreak: 0,
        longestStreak: 0,
        weekProgress: [false, false, false, false, false, false, false],
      });

      const { result } = renderHook(() => useStreakStore());

      await act(async () => {
        await result.current.recordStudySession();
      });

      // Monday and Tuesday should be marked
      expect(result.current.weekProgress[0]).toBe(true); // Monday
      expect(result.current.weekProgress[1]).toBe(true); // Tuesday
    });
  });
});
