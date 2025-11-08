import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../data/sampleTerms';

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  studyDates: string[];
  weekProgress: boolean[];
  
  loadStreak: () => Promise<void>;
  recordStudySession: () => Promise<void>;
}

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

export const useStreakStore = create<StreakState>((set, get) => ({
  currentStreak: 0,
  longestStreak: 0,
  studyDates: [],
  weekProgress: [false, false, false, false, false, false, false],
  
  loadStreak: async () => {
    try {
      const streakJson = await AsyncStorage.getItem(STORAGE_KEYS.STREAK_DATA);
      if (streakJson) {
        const data = JSON.parse(streakJson);
        set(data);
      }
    } catch (error) {
      console.error('Load streak error:', error);
    }
  },
  
  recordStudySession: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { studyDates, currentStreak, longestStreak } = get();
      
      if (studyDates.includes(today)) return;
      
      const newDates = [...studyDates, today].slice(-90);
      const newStreak = calculateStreak(newDates);
      const newLongest = Math.max(longestStreak, newStreak);
      const weekProgress = calculateWeekProgress(newDates);
      
      const streakData = {
        currentStreak: newStreak,
        longestStreak: newLongest,
        studyDates: newDates,
        weekProgress,
      };
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.STREAK_DATA,
        JSON.stringify(streakData)
      );
      
      set(streakData);
    } catch (error) {
      console.error('Record study session error:', error);
    }
  },
}));
