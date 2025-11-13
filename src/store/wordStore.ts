import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MedicalTerm, UserProgress } from '../types';
import { SAMPLE_TERMS, STORAGE_KEYS } from '../data/sampleTerms';
import { dataValidator } from '../utils/dataValidator';

interface WordState {
  terms: MedicalTerm[];
  userProgress: Record<string, UserProgress>;
  isLoading: boolean;
  error: string | null;
  
  loadTerms: () => Promise<void>;
  getTermById: (id: string) => MedicalTerm | undefined;
  searchTerms: (query: string) => MedicalTerm[];
  updateProgress: (termId: string, correct: boolean) => Promise<void>;
  toggleFavorite: (termId: string) => Promise<void>;
  toggleBookmark: (termId: string) => Promise<void>;
  getProgress: (termId: string) => UserProgress | undefined;
}

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
  // Calculate with updated counts
  const totalStudied = progress.timesStudied + 1;
  const totalCorrect = lastCorrect ? progress.timesCorrect + 1 : progress.timesCorrect;
  const accuracy = totalStudied > 0 ? totalCorrect / totalStudied : 0;
  
  if (accuracy >= 0.9 && totalStudied >= 5) return 'mastered';
  if (accuracy >= 0.7 && totalStudied >= 3) return 'familiar';
  if (totalStudied >= 1) return 'learning';
  return 'new';
};

export const useWordStore = create<WordState>((set, get) => ({
  terms: [],
  userProgress: {},
  isLoading: false,
  error: null,
  
  loadTerms: async () => {
    try {
      set({ isLoading: true, error: null });

      // Try to load terms from storage
      let terms = SAMPLE_TERMS;
      let userProgress = {};

      try {
        const termsJson = await AsyncStorage.getItem(STORAGE_KEYS.TERMS);
        
        if (termsJson) {
          // Validate JSON before parsing
          try {
            terms = JSON.parse(termsJson);
          } catch (parseError) {
            console.error('Failed to parse terms JSON, using defaults:', parseError);
            // Reset to default terms if corrupted
            await AsyncStorage.setItem(STORAGE_KEYS.TERMS, JSON.stringify(SAMPLE_TERMS));
            terms = SAMPLE_TERMS;
          }
        } else {
          // First time load - save default terms
          await AsyncStorage.setItem(STORAGE_KEYS.TERMS, JSON.stringify(SAMPLE_TERMS));
        }

        // Validate terms structure
        const validationResult = dataValidator.validateTerms(terms);
        dataValidator.logValidationResults(validationResult, 'WordStore.loadTerms');

        // Check if data is usable
        if (!dataValidator.isDataUsable(terms)) {
          console.error('Terms validation failed, resetting to defaults');
          await AsyncStorage.setItem(STORAGE_KEYS.TERMS, JSON.stringify(SAMPLE_TERMS));
          terms = SAMPLE_TERMS;
          set({
            error: 'Data was corrupted and has been reset. Check Debug tab for details.',
            isLoading: false,
            terms: SAMPLE_TERMS,
            userProgress: {}
          });
          return;
        }
      } catch (storageError: any) {
        console.error('AsyncStorage error loading terms:', storageError);
        // Use default terms if storage fails
        terms = SAMPLE_TERMS;
        set({
          error: 'Storage unavailable. Using default terms.',
          isLoading: false,
          terms: SAMPLE_TERMS,
          userProgress: {}
        });
        return;
      }

      // Load user progress
      try {
        const progressJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
        if (progressJson) {
          try {
            userProgress = JSON.parse(progressJson);
          } catch (parseError) {
            console.error('Failed to parse progress JSON, resetting:', parseError);
            userProgress = {};
            await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify({}));
          }
        }
      } catch (progressError) {
        console.error('Failed to load progress:', progressError);
        userProgress = {};
      }

      set({ terms, userProgress, isLoading: false, error: null });
    } catch (error: any) {
      console.error('Critical error loading terms:', error);
      set({ 
        error: 'Failed to load app data. Please restart the app.',
        isLoading: false,
        terms: SAMPLE_TERMS,
        userProgress: {}
      });
    }
  },
  
  getTermById: (id) => get().terms.find(term => term.id === id),
  
  searchTerms: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().terms.filter(term =>
      term.term.toLowerCase().includes(lowerQuery) ||
      term.definition.toLowerCase().includes(lowerQuery)
    );
  },
  
  updateProgress: async (termId, correct) => {
    const { userProgress } = get();
    const current = userProgress[termId] || createDefaultProgress(termId);
    
    // Calculate mastery level before updating counts
    const masteryLevel = calculateMasteryLevel(current, correct);
    
    const updated: UserProgress = {
      ...current,
      timesStudied: current.timesStudied + 1,
      timesCorrect: correct ? current.timesCorrect + 1 : current.timesCorrect,
      timesIncorrect: !correct ? current.timesIncorrect + 1 : current.timesIncorrect,
      lastStudied: new Date(),
      masteryLevel,
    };
    
    const newProgress = { ...userProgress, [termId]: updated };
    
    // Update state immediately for responsive UI
    set({ userProgress: newProgress });
    
    // Save to storage asynchronously
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROGRESS,
        JSON.stringify(newProgress)
      );
    } catch (error: any) {
      console.error('Failed to save progress:', error);
      // Check if quota exceeded
      if (error?.message?.includes('quota') || error?.message?.includes('QuotaExceededError')) {
        // Try to clear old error logs to free space
        try {
          await AsyncStorage.removeItem('@vocab_app:error_logs');
          // Retry save
          await AsyncStorage.setItem(
            STORAGE_KEYS.USER_PROGRESS,
            JSON.stringify(newProgress)
          );
        } catch (retryError) {
          console.error('Failed to save progress after clearing logs:', retryError);
          set({ error: 'Storage full. Progress may not be saved.' });
        }
      } else {
        set({ error: 'Failed to save progress. Please check storage permissions.' });
      }
    }
  },
  
  toggleFavorite: async (termId) => {
    const { userProgress } = get();
    const current = userProgress[termId] || createDefaultProgress(termId);
    
    const updated = {
      ...current,
      isFavorited: !current.isFavorited,
    };
    
    const newProgress = { ...userProgress, [termId]: updated };
    
    // Update state immediately
    set({ userProgress: newProgress });
    
    // Save to storage asynchronously
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROGRESS,
        JSON.stringify(newProgress)
      );
    } catch (error: any) {
      console.error('Failed to save favorite:', error);
      // Revert state on error
      set({ userProgress });
      set({ error: 'Failed to save favorite. Please try again.' });
    }
  },
  
  toggleBookmark: async (termId) => {
    const { userProgress } = get();
    const current = userProgress[termId] || createDefaultProgress(termId);
    
    const updated = {
      ...current,
      isBookmarked: !current.isBookmarked,
    };
    
    const newProgress = { ...userProgress, [termId]: updated };
    
    // Update state immediately
    set({ userProgress: newProgress });
    
    // Save to storage asynchronously
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROGRESS,
        JSON.stringify(newProgress)
      );
    } catch (error: any) {
      console.error('Failed to save bookmark:', error);
      // Revert state on error
      set({ userProgress });
      set({ error: 'Failed to save bookmark. Please try again.' });
    }
  },
  
  getProgress: (termId) => get().userProgress[termId],
}));
