import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MedicalTerm, UserProgress } from '../types';
import { SAMPLE_TERMS, STORAGE_KEYS } from '../data/sampleTerms';
import {
  createMedilexStorageAdapter,
  ENCRYPTED_STORAGE_KEYS,
  SENSITIVE_FIELDS,
} from '../utils/encryptedStorage';

interface WordState {
  terms: MedicalTerm[];
  userProgress: Record<string, UserProgress>;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;

  loadTerms: () => Promise<void>;
  getTermById: (id: string) => MedicalTerm | undefined;
  searchTerms: (query: string) => MedicalTerm[];
  updateProgress: (termId: string, correct: boolean) => void;
  toggleFavorite: (termId: string) => void;
  toggleBookmark: (termId: string) => void;
  getProgress: (termId: string) => UserProgress | undefined;
  setHasHydrated: (state: boolean) => void;
}

/** Persisted subset of WordState (excludes functions, loading state, and hydration flag) */
type PersistedWordState = Pick<WordState, 'terms' | 'userProgress'>;

const createDefaultProgress = (termId: string): UserProgress => ({
  termId,
  userId: 'default_user',
  timesStudied: 0,
  timesCorrect: 0,
  timesIncorrect: 0,
  lastStudied: new Date(),
  masteryLevel: 'new',
  isFavorited: false,
  isBookmarked: false,
});

const calculateMasteryLevel = (
  progress: UserProgress,
  lastCorrect: boolean
): UserProgress['masteryLevel'] => {
  const accuracy =
    progress.timesStudied > 0
      ? progress.timesCorrect / progress.timesStudied
      : 0;

  if (accuracy >= 0.9 && progress.timesStudied >= 5) return 'mastered';
  if (accuracy >= 0.7 && progress.timesStudied >= 3) return 'familiar';
  if (progress.timesStudied >= 1) return 'learning';
  return 'new';
};

/**
 * Migrates legacy unencrypted data from old storage keys to new encrypted store.
 * This runs once on first load after the migration.
 */
async function migrateLegacyData(): Promise<{
  terms: MedicalTerm[] | null;
  userProgress: Record<string, UserProgress> | null;
}> {
  try {
    // Check for legacy data
    const legacyTermsJson = await AsyncStorage.getItem(STORAGE_KEYS.TERMS);
    const legacyProgressJson = await AsyncStorage.getItem(
      STORAGE_KEYS.USER_PROGRESS
    );

    const result: {
      terms: MedicalTerm[] | null;
      userProgress: Record<string, UserProgress> | null;
    } = {
      terms: null,
      userProgress: null,
    };

    if (legacyTermsJson) {
      result.terms = JSON.parse(legacyTermsJson);
    }

    if (legacyProgressJson) {
      result.userProgress = JSON.parse(legacyProgressJson);
    }

    // If we found legacy data, clear the old keys after migration
    if (legacyTermsJson || legacyProgressJson) {
      // Don't remove legacy keys immediately - let the new store hydrate first
      // We'll clean up on the next app load if migration succeeded
      console.log('[wordStore] Legacy data found, will migrate to encrypted storage');
    }

    return result;
  } catch (error) {
    console.error('[wordStore] Migration error:', error);
    return { terms: null, userProgress: null };
  }
}

/**
 * Cleans up legacy storage keys after successful migration.
 * Called after the store has hydrated successfully.
 */
async function cleanupLegacyKeys(): Promise<void> {
  try {
    const legacyTermsJson = await AsyncStorage.getItem(STORAGE_KEYS.TERMS);
    const legacyProgressJson = await AsyncStorage.getItem(
      STORAGE_KEYS.USER_PROGRESS
    );

    if (legacyTermsJson || legacyProgressJson) {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TERMS,
        STORAGE_KEYS.USER_PROGRESS,
      ]);
      console.log('[wordStore] Legacy storage keys cleaned up');
    }
  } catch (error) {
    console.error('[wordStore] Cleanup error:', error);
  }
}

export const useWordStore = create<WordState>()(
  persist(
    (set, get) => ({
      terms: [],
      userProgress: {},
      isLoading: false,
      error: null,
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      loadTerms: async () => {
        try {
          set({ isLoading: true, error: null });

          const { terms: currentTerms, userProgress: currentProgress } = get();

          // If store is empty after hydration, check for legacy data or use defaults
          if (currentTerms.length === 0) {
            const legacyData = await migrateLegacyData();

            const terms = legacyData.terms || SAMPLE_TERMS;
            const userProgress = legacyData.userProgress || {};

            set({ terms, userProgress, isLoading: false });

            // If we migrated data, clean up legacy keys
            if (legacyData.terms || legacyData.userProgress) {
              // Delay cleanup to ensure persist has saved
              setTimeout(() => cleanupLegacyKeys(), 1000);
            }
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          set({ error: 'Failed to load terms', isLoading: false });
          console.error('Load terms error:', error);
        }
      },

      getTermById: (id) => get().terms.find((term) => term.id === id),

      searchTerms: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().terms.filter(
          (term) =>
            term.term.toLowerCase().includes(lowerQuery) ||
            term.definition.toLowerCase().includes(lowerQuery)
        );
      },

      updateProgress: (termId, correct) => {
        const { userProgress } = get();
        const current = userProgress[termId] || createDefaultProgress(termId);

        const updated: UserProgress = {
          ...current,
          timesStudied: current.timesStudied + 1,
          timesCorrect: correct ? current.timesCorrect + 1 : current.timesCorrect,
          timesIncorrect: !correct
            ? current.timesIncorrect + 1
            : current.timesIncorrect,
          lastStudied: new Date(),
          masteryLevel: calculateMasteryLevel(current, correct),
        };

        set({ userProgress: { ...userProgress, [termId]: updated } });
      },

      toggleFavorite: (termId) => {
        const { userProgress } = get();
        const current = userProgress[termId] || createDefaultProgress(termId);

        const updated = {
          ...current,
          isFavorited: !current.isFavorited,
        };

        set({ userProgress: { ...userProgress, [termId]: updated } });
      },

      toggleBookmark: (termId) => {
        const { userProgress } = get();
        const current = userProgress[termId] || createDefaultProgress(termId);

        const updated = {
          ...current,
          isBookmarked: !current.isBookmarked,
        };

        set({ userProgress: { ...userProgress, [termId]: updated } });
      },

      getProgress: (termId) => get().userProgress[termId],
    }),
    {
      name: ENCRYPTED_STORAGE_KEYS.WORD_STORE,
      storage: createMedilexStorageAdapter(
        ENCRYPTED_STORAGE_KEYS.WORD_STORE,
        [...SENSITIVE_FIELDS.WORD_STORE]
      ) as PersistStorage<PersistedWordState>,
      partialize: (state): PersistedWordState => ({
        terms: state.terms,
        userProgress: state.userProgress,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
