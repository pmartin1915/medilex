export interface Etymology {
  prefix?: string;
  root: string;
  suffix?: string;
  meaning: string;
}

export interface MedicalTerm {
  id: string;
  term: string;
  pronunciation: string;
  syllables: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  etymology: Etymology;
  category: string;
  specialty?: string;
  relatedTerms: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  commonlyMisspelled: boolean;
  createdAt: Date;
}

export interface UserProgress {
  termId: string;
  userId: string;
  timesStudied: number;
  timesCorrect: number;
  timesIncorrect: number;
  lastStudied: Date;
  masteryLevel: 'new' | 'learning' | 'familiar' | 'mastered';
  isFavorited: boolean;
  isBookmarked: boolean;
}
