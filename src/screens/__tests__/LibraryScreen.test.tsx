import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LibraryScreen } from '../LibraryScreen';
import { useWordStore } from '../../store/wordStore';

// Mock the store
jest.mock('../../store/wordStore');

const mockTerms = [
  {
    id: '1',
    term: 'Hypertension',
    pronunciation: '/hy-per-ten-shun/',
    syllables: 'hy-per-ten-sion',
    partOfSpeech: 'noun',
    definition: 'High blood pressure',
    example: 'The patient has hypertension.',
    etymology: { roots: [], meaning: 'high pressure' },
    category: 'Cardiology',
    relatedTerms: [],
  },
  {
    id: '2',
    term: 'Diabetes',
    pronunciation: '/dy-uh-bee-teez/',
    syllables: 'di-a-be-tes',
    partOfSpeech: 'noun',
    definition: 'A metabolic disease with high blood sugar',
    example: 'Type 2 diabetes is common.',
    etymology: { roots: [], meaning: 'pass through' },
    category: 'Endocrinology',
    relatedTerms: [],
  },
  {
    id: '3',
    term: 'Pneumonia',
    pronunciation: '/noo-moh-nyuh/',
    syllables: 'pneu-mo-nia',
    partOfSpeech: 'noun',
    definition: 'Inflammation of the lungs',
    example: 'Bacterial pneumonia requires antibiotics.',
    etymology: { roots: [], meaning: 'lung inflammation' },
    category: 'Pulmonology',
    relatedTerms: [],
  },
];

describe('LibraryScreen', () => {
  const mockSearchTerms = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useWordStore - must handle selectors
    const mockState = {
      terms: mockTerms,
      searchTerms: mockSearchTerms,
    };

    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockState);
      }
      return mockState;
    });

    // Default search returns filtered results
    mockSearchTerms.mockImplementation((query: string) => {
      if (!query) return mockTerms;
      return mockTerms.filter(term =>
        term.term.toLowerCase().includes(query.toLowerCase())
      );
    });
  });

  it('renders correctly with title and term count', () => {
    const { getByText } = render(<LibraryScreen />);

    expect(getByText('Medical Library')).toBeTruthy();
    expect(getByText('3 terms')).toBeTruthy();
  });

  it('displays all terms initially', () => {
    const { getByText } = render(<LibraryScreen />);

    expect(getByText('Hypertension')).toBeTruthy();
    expect(getByText('Diabetes')).toBeTruthy();
    expect(getByText('Pneumonia')).toBeTruthy();
  });

  it('shows term definitions', () => {
    const { getByText } = render(<LibraryScreen />);

    expect(getByText('High blood pressure')).toBeTruthy();
    expect(getByText('A metabolic disease with high blood sugar')).toBeTruthy();
    expect(getByText('Inflammation of the lungs')).toBeTruthy();
  });

  it('displays category badges', () => {
    const { getByText } = render(<LibraryScreen />);

    expect(getByText('Cardiology')).toBeTruthy();
    expect(getByText('Endocrinology')).toBeTruthy();
    expect(getByText('Pulmonology')).toBeTruthy();
  });

  it('renders search bar with correct placeholder', () => {
    const { getByPlaceholderText } = render(<LibraryScreen />);

    expect(getByPlaceholderText('Search medical terms...')).toBeTruthy();
  });

  it('filters terms when searching', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<LibraryScreen />);

    const searchBar = getByPlaceholderText('Search medical terms...');
    fireEvent.changeText(searchBar, 'diabetes');

    // Should show filtered result
    expect(getByText('Diabetes')).toBeTruthy();

    // Should not show other terms
    expect(queryByText('Hypertension')).toBeNull();
    expect(queryByText('Pneumonia')).toBeNull();
  });

  it('updates term count when searching', () => {
    mockSearchTerms.mockReturnValue([mockTerms[0]]); // Return only one term

    const { getByPlaceholderText, getByText } = render(<LibraryScreen />);

    const searchBar = getByPlaceholderText('Search medical terms...');
    fireEvent.changeText(searchBar, 'hyper');

    expect(getByText('1 terms')).toBeTruthy();
  });

  it('shows all terms when search is cleared', () => {
    const { getByPlaceholderText, getByText } = render(<LibraryScreen />);

    const searchBar = getByPlaceholderText('Search medical terms...');

    // Search
    fireEvent.changeText(searchBar, 'diabetes');

    // Clear search
    fireEvent.changeText(searchBar, '');

    expect(getByText('Hypertension')).toBeTruthy();
    expect(getByText('Diabetes')).toBeTruthy();
    expect(getByText('Pneumonia')).toBeTruthy();
    expect(getByText('3 terms')).toBeTruthy();
  });

  it('displays empty list when no terms match search', () => {
    mockSearchTerms.mockReturnValue([]);

    const { getByPlaceholderText, getByText, queryByText } = render(<LibraryScreen />);

    const searchBar = getByPlaceholderText('Search medical terms...');
    fireEvent.changeText(searchBar, 'nonexistent');

    expect(getByText('0 terms')).toBeTruthy();
    expect(queryByText('Hypertension')).toBeNull();
    expect(queryByText('Diabetes')).toBeNull();
  });

  it('handles empty terms list', () => {
    const emptyState = {
      terms: [],
      searchTerms: () => [],
    };

    (useWordStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(emptyState);
      }
      return emptyState;
    });

    const { getByText } = render(<LibraryScreen />);

    expect(getByText('Medical Library')).toBeTruthy();
    expect(getByText('0 terms')).toBeTruthy();
  });

  it('calls searchTerms when search query changes', () => {
    const { getByPlaceholderText } = render(<LibraryScreen />);

    const searchBar = getByPlaceholderText('Search medical terms...');
    fireEvent.changeText(searchBar, 'test query');

    expect(mockSearchTerms).toHaveBeenCalledWith('test query');
  });

  it('renders term items as touchable', () => {
    const { getByText } = render(<LibraryScreen />);

    const termItem = getByText('Hypertension').parent?.parent;
    expect(termItem).toBeTruthy();
  });
});
