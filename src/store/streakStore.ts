import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../data/sampleTerms';
import {
  createMedilexStorageAdapter,
  ENCRYPTED_STORAGE_KEYS,
  SENSITIVE_FIELDS,
} from '../utils/encryptedStorage';

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  studyDates: string[];
  weekProgress: boolean[];
  _hasHydrated: boolean;

  loadStreak: () => Promise<void>;
  recordStudySession: () => void;
  setHasHydrated: (state: boolean) => void;
}

/** Persisted subset of StreakState (excludes functions and hydration flag) */
type PersistedStreakState = Pick<
  StreakState,
  'currentStreak' | 'longestStreak' | 'studyDates' | 'weekProgress'
>;

const calculateStreak = (dates: string[]): number => {
  if (dates.length === 0) return 0;

  const sorted = [...dates].sort().reverse();
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const dateStr of sorted) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

const calculateWeekProgress = (dates: string[]): boolean[] => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  const progress = [false, false, false, false, false, false, false];

  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(monday);
    checkDate.setDate(monday.getDate() + i);
    const dateStr = checkDate.toISOString().split('T')[0];

    if (dates.includes(dateStr)) {
      progress[i] = true;
    }
  }

  return progress;
};

/**
 * Migrates legacy unencrypted streak data from old storage key.
 */
async function migrateLegacyStreakData(): Promise<{
  currentStreak: number;
  longestStreak: number;
  studyDates: string[];
  weekProgress: boolean[];
} | null> {
  try {
    const legacyStreakJson = await AsyncStorage.getItem(STORAGE_KEYS.STREAK_DATA);

    if (legacyStreakJson) {
      const data = JSON.parse(legacyStreakJson);
      console.log('[streakStore] Legacy streak data found, will migrate to encrypted storage');
      return data;
    }

    return null;
  } catch (error) {
    console.error('[streakStore] Migration error:', error);
    return null;
  }
}

/**
 * Cleans up legacy streak storage key after migration.
 */
async function cleanupLegacyStreakKey(): Promise<void> {
  try {
    const legacyStreakJson = await AsyncStorage.getItem(STORAGE_KEYS.STREAK_DATA);

    if (legacyStreakJson) {
      await AsyncStorage.removeItem(STORAGE_KEYS.STREAK_DATA);
      console.log('[streakStore] Legacy storage key cleaned up');
    }
  } catch (error) {
    console.error('[streakStore] Cleanup error:', error);
  }
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      studyDates: [],
      weekProgress: [false, false, false, false, false, false, false],
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      loadStreak: async () => {
        try {
          const { studyDates } = get();

          // If store is empty after hydration, check for legacy data
          if (studyDates.length === 0) {
            const legacyData = await migrateLegacyStreakData();

            if (legacyData) {
              set(legacyData);
              // Delay cleanup to ensure persist has saved
              setTimeout(() => cleanupLegacyStreakKey(), 1000);
            }
          }
        } catch (error) {
          console.error('Load streak error:', error);
        }
      },

      recordStudySession: () => {
        const today = new Date().toISOString().split('T')[0];
        const { studyDates, longestStreak } = get();

        if (studyDates.includes(today)) return;

        const newDates = [...studyDates, today].slice(-90);
        const newStreak = calculateStreak(newDates);
        const newLongest = Math.max(longestStreak, newStreak);
        const weekProgress = calculateWeekProgress(newDates);

        set({
          currentStreak: newStreak,
          longestStreak: newLongest,
          studyDates: newDates,
          weekProgress,
        });
      },
    }),
    {
      name: ENCRYPTED_STORAGE_KEYS.STREAK_STORE,
      storage: createMedilexStorageAdapter(
        ENCRYPTED_STORAGE_KEYS.STREAK_STORE,
        [...SENSITIVE_FIELDS.STREAK_STORE]
      ) as PersistStorage<PersistedStreakState>,
      partialize: (state): PersistedStreakState => ({
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        studyDates: state.studyDates,
        weekProgress: state.weekProgress,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
