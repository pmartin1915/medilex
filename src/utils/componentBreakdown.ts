import { MedicalPrefix, MedicalRoot, MedicalSuffix, MedicalTerm, TermBreakdown } from '../types';
import prefixesData from '../data/prefixes.json';
import rootsData from '../data/roots.json';
import suffixesData from '../data/suffixes.json';

// Type assertions for imported JSON
const prefixes = prefixesData as MedicalPrefix[];
const roots = rootsData as MedicalRoot[];
const suffixes = suffixesData as MedicalSuffix[];

// Create lookup maps for O(1) access
const prefixMap = new Map<string, MedicalPrefix>(
  prefixes.map(p => [p.id, p])
);

const rootMap = new Map<string, MedicalRoot>(
  roots.map(r => [r.id, r])
);

const suffixMap = new Map<string, MedicalSuffix>(
  suffixes.map(s => [s.id, s])
);

/**
 * Get a prefix by ID
 */
export const getPrefixById = (id: string): MedicalPrefix | undefined => {
  return prefixMap.get(id);
};

/**
 * Get a root by ID
 */
export const getRootById = (id: string): MedicalRoot | undefined => {
  return rootMap.get(id);
};

/**
 * Get a suffix by ID
 */
export const getSuffixById = (id: string): MedicalSuffix | undefined => {
  return suffixMap.get(id);
};

/**
 * Get all prefixes
 */
export const getAllPrefixes = (): MedicalPrefix[] => prefixes;

/**
 * Get all roots
 */
export const getAllRoots = (): MedicalRoot[] => roots;

/**
 * Get all suffixes
 */
export const getAllSuffixes = (): MedicalSuffix[] => suffixes;

/**
 * Interface for a term component part
 */
export interface TermComponent {
  type: 'prefix' | 'root' | 'suffix';
  component: string;
  meaning: string;
  etymology?: string;
}

/**
 * Get the components of a term as an array
 */
export const getTermComponents = (breakdown?: TermBreakdown): TermComponent[] => {
  if (!breakdown) return [];

  const components: TermComponent[] = [];

  // Add prefix if exists
  if (breakdown.prefixId) {
    const prefix = getPrefixById(breakdown.prefixId);
    if (prefix) {
      components.push({
        type: 'prefix',
        component: prefix.component,
        meaning: prefix.meaning,
        etymology: prefix.etymology,
      });
    }
  }

  // Add root (required)
  const root = getRootById(breakdown.rootId);
  if (root) {
    components.push({
      type: 'root',
      component: root.component,
      meaning: root.meaning,
      etymology: root.etymology,
    });
  }

  // Add suffix if exists
  if (breakdown.suffixId) {
    const suffix = getSuffixById(breakdown.suffixId);
    if (suffix) {
      components.push({
        type: 'suffix',
        component: suffix.component,
        meaning: suffix.meaning,
        etymology: suffix.etymology,
      });
    }
  }

  return components;
};

/**
 * Format term breakdown as human-readable text
 * Example: "brady (slow) + card (heart) + ia (condition) = slow heart condition"
 */
export const formatTermBreakdown = (
  term: MedicalTerm
): string | null => {
  if (!term.breakdown) return null;

  const components = getTermComponents(term.breakdown);
  if (components.length === 0) return null;

  const parts = components.map(c => `${c.component} (${c.meaning})`).join(' + ');
  return `${parts} = ${term.definition}`;
};

/**
 * Get a short breakdown without definition
 * Example: "brady- (slow) + card (heart) + -ia (condition)"
 */
export const getShortBreakdown = (breakdown?: TermBreakdown): string | null => {
  if (!breakdown) return null;

  const components = getTermComponents(breakdown);
  if (components.length === 0) return null;

  return components.map(c => `${c.component} (${c.meaning})`).join(' + ');
};

/**
 * Check if a term has component breakdown data
 */
export const hasBreakdown = (term: MedicalTerm): boolean => {
  return !!term.breakdown && !!term.breakdown.rootId;
};

/**
 * Get component count for statistics
 */
export const getComponentStats = () => {
  return {
    prefixes: prefixes.length,
    roots: roots.length,
    suffixes: suffixes.length,
    total: prefixes.length + roots.length + suffixes.length,
  };
};
