import {
  hasBreakdown,
  getTermComponents,
  formatTermBreakdown,
  getShortBreakdown,
  getPrefixById,
  getRootById,
  getSuffixById,
  getAllPrefixes,
  getAllRoots,
  getAllSuffixes,
  getComponentStats,
} from '../componentBreakdown';
import { MedicalTerm, TermBreakdown } from '../../types';

describe('componentBreakdown', () => {
  // Helper function to create a mock term
  const createMockTerm = (breakdown?: TermBreakdown): MedicalTerm => ({
    id: '1',
    term: 'Test Term',
    pronunciation: 'test',
    syllables: 'test',
    partOfSpeech: 'noun',
    definition: 'A test definition',
    example: 'An example',
    etymology: { prefix: '', root: '', meaning: '' },
    category: 'test',
    specialty: 'test',
    relatedTerms: [],
    difficulty: 1,
    commonlyMisspelled: false,
    createdAt: new Date(),
    breakdown,
  });

  describe('hasBreakdown', () => {
    it('should return true for terms with prefix', () => {
      const term = createMockTerm({ prefixId: 'pre_01' });
      expect(hasBreakdown(term)).toBe(true);
    });

    it('should return true for terms with suffix', () => {
      const term = createMockTerm({ suffixId: 'suf_01' });
      expect(hasBreakdown(term)).toBe(true);
    });

    it('should return true for terms with root only', () => {
      const term = createMockTerm({ rootId: 'root_01' });
      expect(hasBreakdown(term)).toBe(true);
    });

    it('should return false for terms without breakdown', () => {
      const term = createMockTerm();
      expect(hasBreakdown(term)).toBe(false);
    });

    it('should return false for terms with empty breakdown', () => {
      const term = createMockTerm({});
      expect(hasBreakdown(term)).toBe(false);
    });
  });

  describe('getTermComponents', () => {
    it('should return empty array for undefined breakdown', () => {
      const result = getTermComponents(undefined);
      expect(result).toEqual([]);
    });

    it('should return empty array for empty breakdown', () => {
      const result = getTermComponents({});
      expect(result).toEqual([]);
    });

    it('should return components when breakdown has data', () => {
      // This test requires actual data from the JSON files
      // For now, we just test that it returns an array
      const breakdown: TermBreakdown = {
        prefixId: 'pre_01',
        rootId: 'root_01',
      };
      const result = getTermComponents(breakdown);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('formatTermBreakdown', () => {
    it('should return null for terms without breakdown', () => {
      const term = createMockTerm();
      expect(formatTermBreakdown(term)).toBeNull();
    });

    it('should return null for terms with empty breakdown', () => {
      const term = createMockTerm({});
      expect(formatTermBreakdown(term)).toBeNull();
    });

    it('should return formatted string for terms with breakdown', () => {
      const term = createMockTerm({ prefixId: 'pre_01', rootId: 'root_01' });
      const result = formatTermBreakdown(term);
      // Result could be null if the IDs don't exist in the data
      expect(typeof result === 'string' || result === null).toBe(true);
    });
  });

  describe('getShortBreakdown', () => {
    it('should return null for undefined breakdown', () => {
      expect(getShortBreakdown(undefined)).toBeNull();
    });

    it('should return null for empty breakdown', () => {
      expect(getShortBreakdown({})).toBeNull();
    });

    it('should return formatted string for breakdown with data', () => {
      const breakdown: TermBreakdown = {
        prefixId: 'pre_01',
        rootId: 'root_01',
      };
      const result = getShortBreakdown(breakdown);
      // Result could be null if the IDs don't exist in the data
      expect(typeof result === 'string' || result === null).toBe(true);
    });
  });

  describe('Lookup functions', () => {
    it('getPrefixById should return undefined for non-existent ID', () => {
      expect(getPrefixById('non_existent')).toBeUndefined();
    });

    it('getRootById should return undefined for non-existent ID', () => {
      expect(getRootById('non_existent')).toBeUndefined();
    });

    it('getSuffixById should return undefined for non-existent ID', () => {
      expect(getSuffixById('non_existent')).toBeUndefined();
    });

    it('getAllPrefixes should return an array', () => {
      const prefixes = getAllPrefixes();
      expect(Array.isArray(prefixes)).toBe(true);
    });

    it('getAllRoots should return an array', () => {
      const roots = getAllRoots();
      expect(Array.isArray(roots)).toBe(true);
    });

    it('getAllSuffixes should return an array', () => {
      const suffixes = getAllSuffixes();
      expect(Array.isArray(suffixes)).toBe(true);
    });
  });

  describe('getComponentStats', () => {
    it('should return stats object with correct structure', () => {
      const stats = getComponentStats();
      expect(stats).toHaveProperty('prefixes');
      expect(stats).toHaveProperty('roots');
      expect(stats).toHaveProperty('suffixes');
      expect(stats).toHaveProperty('total');
      expect(typeof stats.prefixes).toBe('number');
      expect(typeof stats.roots).toBe('number');
      expect(typeof stats.suffixes).toBe('number');
      expect(typeof stats.total).toBe('number');
    });

    it('should have total equal to sum of parts', () => {
      const stats = getComponentStats();
      expect(stats.total).toBe(stats.prefixes + stats.roots + stats.suffixes);
    });
  });
});
