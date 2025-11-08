import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MedicalTerm, UserProgress } from '../types';
import { SAMPLE_TERMS, STORAGE_KEYS } from '../data/sampleTerms';

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
  const accuracy = progress.timesStudied > 0
    ? progress.timesCorrect / progress.timesStudied
    : 0;
  
  if (accuracy >= 0.9 && progress.timesStudied >= 5) return 'mastered';
  if (accuracy >= 0.7 && progress.timesStudied >= 3) return 'familiar';
  if (progress.timesStudied >= 1) return 'learning';
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
      
      const termsJson = await AsyncStorage.getItem(STORAGE_KEYS.TERMS);
      const terms = termsJson ? JSON.parse(termsJson) : SAMPLE_TERMS;
      
      if (!termsJson) {
        await AsyncStorage.setItem(STORAGE_KEYS.TERMS, JSON.stringify(SAMPLE_TERMS));
      }
      
      const progressJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      const userProgress = progressJson ? JSON.parse(progressJson) : {};
      
      set({ terms, userProgress, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load terms', isLoading: false });
      console.error('Load terms error:', error);
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
    try {
      const { userProgress } = get();
      const current = userProgress[termId] || createDefaultProgress(termId);
      
      const updated: UserProgress = {
        ...current,
        timesStudied: current.timesStudied + 1,
        timesCorrect: correct ? current.timesCorrect + 1 : current.timesCorrect,
        timesIncorrect: !correct ? current.timesIncorrect + 1 : current.timesIncorrect,
        lastStudied: new Date(),
        masteryLevel: calculateMasteryLevel(current, correct),
      };
      
      const newProgress = { ...userProgress, [termId]: updated };
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROGRESS,
        JSON.stringify(newProgress)
      );
      
      set({ userProgress: newProgress });
    } catch (error) {
      console.error('Update progress error:', error);
    }
  },
  
  toggleFavorite: async (termId) => {
    try {
      const { userProgress } = get();
      const current = userProgress[termId] || createDefaultProgress(termId);
      
      const updated = {
        ...current,
        isFavorited: !current.isFavorited,
      };
      
      const newProgress = { ...userProgress, [termId]: updated };
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROGRESS,
        JSON.stringify(newProgress)
      );
      
      set({ userProgress: newProgress });
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  },
  
  toggleBookmark: async (termId) => {
    try {
      const { userProgress } = get();
      const current = userProgress[termId] || createDefaultProgress(termId);
      
      const updated = {
        ...current,
        isBookmarked: !current.isBookmarked,
      };
      
      const newProgress = { ...userProgress, [termId]: updated };
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROGRESS,
        JSON.stringify(newProgress)
      );
      
      set({ userProgress: newProgress });
    } catch (error) {
      console.error('Toggle bookmark error:', error);
    }
  },
  
  getProgress: (termId) => get().userProgress[termId],
}));
