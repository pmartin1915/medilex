// Medical term component types
export interface MedicalPrefix {
  id: string;
  component: string;
  meaning: string;
  category: string;
  etymology: string;
  examples: string[];
}

export interface MedicalRoot {
  id: string;
  component: string;
  meaning: string;
  bodySystem: string;
  etymology: string;
  examples: string[];
}

export interface MedicalSuffix {
  id: string;
  component: string;
  meaning: string;
  category: string;
  etymology: string;
  examples: string[];
}

// Component breakdown structure
export interface TermBreakdown {
  prefixId?: string | null;
  rootId: string;
  suffixId?: string | null;
}

// Legacy etymology interface (for backward compatibility)
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
  // Component breakdown (new feature)
  breakdown?: TermBreakdown;
  clinicalNote?: string;
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
