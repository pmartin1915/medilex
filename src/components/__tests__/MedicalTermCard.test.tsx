import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MedicalTermCard } from '../MedicalTermCard';
import { MedicalTerm } from '../../types';

const mockTerm: MedicalTerm = {
  id: '1',
  term: 'Tachycardia',
  pronunciation: '/tak-i-kar-dee-uh/',
  syllables: 'tach-y-car-di-a',
  partOfSpeech: 'noun',
  definition: 'Abnormally rapid heart rate, typically over 100 beats per minute',
  example: 'The patient presented with tachycardia and chest pain.',
  etymology: {
    roots: [
      { text: 'tachy-', meaning: 'fast', language: 'Greek' },
      { text: 'cardia', meaning: 'heart', language: 'Greek' },
    ],
    meaning: 'fast heart',
  },
  category: 'Cardiology',
  specialty: 'Emergency Medicine',
  relatedTerms: ['Bradycardia', 'Arrhythmia', 'Palpitations'],
};

describe('MedicalTermCard', () => {
  const mockOnPronounce = jest.fn();
  const mockOnFavorite = jest.fn();
  const mockOnBookmark = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders term information correctly', () => {
    const { getByText } = render(
      <MedicalTermCard
        term={mockTerm}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
      />
    );

    expect(getByText('Tachycardia')).toBeTruthy();
    expect(getByText('/tak-i-kar-dee-uh/')).toBeTruthy();
    expect(getByText('tach-y-car-di-a')).toBeTruthy();
    expect(getByText('noun')).toBeTruthy();
  });

  it('displays definition and example', () => {
    const { getByText } = render(
      <MedicalTermCard
        term={mockTerm}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
      />
    );

    expect(getByText('Abnormally rapid heart rate, typically over 100 beats per minute')).toBeTruthy();
    expect(getByText('Clinical Example:')).toBeTruthy();
    expect(getByText('The patient presented with tachycardia and chest pain.')).toBeTruthy();
  });

  it('calls onPronounce when audio button is pressed', () => {
    const { getByTestId } = render(
      <MedicalTermCard
        term={mockTerm}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
      />
    );

    const audioButton = getByTestId('icon-Volume2').parent?.parent;
    fireEvent.press(audioButton!);

    expect(mockOnPronounce).toHaveBeenCalledTimes(1);
  });

  it('shows "Show More" button initially', () => {
    const { getByText } = render(
      <MedicalTermCard
        term={mockTerm}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
      />
    );

    expect(getByText('Show More')).toBeTruthy();
  });

  it('toggles to "Show Less" when details button is pressed', () => {
    const { getByText } = render(
      <MedicalTermCard
        term={mockTerm}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
      />
    );

    const detailsButton = getByText('Show More');
    fireEvent.press(detailsButton);

    expect(getByText('Show Less')).toBeTruthy();
  });

  it('displays etymology when details are shown', () => {
    const { getByText } = render(
      <MedicalTermCard
        term={mockTerm}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
      />
    );

    const detailsButton = getByText('Show More');
    fireEvent.press(detailsButton);

    expect(getByText('Etymology:')).toBeTruthy();
    expect(getByText('fast heart')).toBeTruthy();
  });

  it('displays category when details are shown', () => {
    const { getByText } = render(
      <MedicalTermCard
        term={mockTerm}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
      />
    );

    const detailsButton = getByText('Show More');
    fireEvent.press(detailsButton);

    expect(getByText('Cardiology')).toBeTruthy();
    expect(getByText('Emergency Medicine')).toBeTruthy();
  });

  it('displays related terms when details are shown', () => {
    const { getByText } = render(
      <MedicalTermCard
        term={mockTerm}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
      />
    );

    const detailsButton = getByText('Show More');
    fireEvent.press(detailsButton);

    expect(getByText('Related Terms:')).toBeTruthy();
    expect(getByText('Bradycardia, Arrhythmia, Palpitations')).toBeTruthy();
  });

  it('hides details when Show Less is pressed', () => {
    const { getByText, queryByText } = render(
      <MedicalTermCard
        term={mockTerm}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
      />
    );

    // Show details
    fireEvent.press(getByText('Show More'));
    expect(getByText('Etymology:')).toBeTruthy();

    // Hide details
    fireEvent.press(getByText('Show Less'));
    expect(queryByText('Etymology:')).toBeNull();
  });

  it('shows action buttons when showActions is true', () => {
    const { getByTestId } = render(
      <MedicalTermCard
        term={mockTerm}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
        showActions={true}
      />
    );

    expect(getByTestId('icon-Heart')).toBeTruthy();
    expect(getByTestId('icon-Bookmark')).toBeTruthy();
  });

  it('hides action buttons when showActions is false', () => {
    const { queryByTestId } = render(
      <MedicalTermCard
        term={mockTerm}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
        showActions={false}
      />
    );

    expect(queryByTestId('icon-Heart')).toBeNull();
    expect(queryByTestId('icon-Bookmark')).toBeNull();
  });

  it('calls onFavorite when heart button is pressed', () => {
    const { getByTestId } = render(
      <MedicalTermCard
        term={mockTerm}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
      />
    );

    const heartButton = getByTestId('icon-Heart').parent?.parent;
    fireEvent.press(heartButton!);

    expect(mockOnFavorite).toHaveBeenCalledTimes(1);
  });

  it('calls onBookmark when bookmark button is pressed', () => {
    const { getByTestId } = render(
      <MedicalTermCard
        term={mockTerm}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
      />
    );

    const bookmarkButton = getByTestId('icon-Bookmark').parent?.parent;
    fireEvent.press(bookmarkButton!);

    expect(mockOnBookmark).toHaveBeenCalledTimes(1);
  });

  it('handles term without related terms', () => {
    const termWithoutRelated = { ...mockTerm, relatedTerms: [] };

    const { getByText, queryByText } = render(
      <MedicalTermCard
        term={termWithoutRelated}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
      />
    );

    fireEvent.press(getByText('Show More'));

    expect(queryByText('Related Terms:')).toBeNull();
  });

  it('handles term without specialty', () => {
    const termWithoutSpecialty = { ...mockTerm, specialty: undefined };

    const { getByText, queryByText } = render(
      <MedicalTermCard
        term={termWithoutSpecialty}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
      />
    );

    fireEvent.press(getByText('Show More'));

    expect(getByText('Cardiology')).toBeTruthy();
    expect(queryByText('Emergency Medicine')).toBeNull();
  });

  it('shows favorited state visually', () => {
    const { getByTestId } = render(
      <MedicalTermCard
        term={mockTerm}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
        isFavorited={true}
      />
    );

    const heartIcon = getByTestId('icon-Heart');
    expect(heartIcon).toBeTruthy();
  });

  it('shows bookmarked state visually', () => {
    const { getByTestId } = render(
      <MedicalTermCard
        term={mockTerm}
        onPronounce={mockOnPronounce}
        onFavorite={mockOnFavorite}
        onBookmark={mockOnBookmark}
        isBookmarked={true}
      />
    );

    const bookmarkIcon = getByTestId('icon-Bookmark');
    expect(bookmarkIcon).toBeTruthy();
  });
});
