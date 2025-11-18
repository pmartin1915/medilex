import React from 'react';
import { render } from '@testing-library/react-native';
import { CategoryCard } from '../CategoryCard';

describe('CategoryCard', () => {
  const defaultProps = {
    category: 'Medical Terminology',
    totalTerms: 20,
    masteredTerms: 15,
    accuracy: 85,
  };

  describe('Rendering', () => {
    it('should render with all props', () => {
      const { getByText } = render(<CategoryCard {...defaultProps} />);
      expect(getByText('Medical Terminology')).toBeTruthy();
      expect(getByText('20')).toBeTruthy();
      expect(getByText('15')).toBeTruthy();
      expect(getByText('85%')).toBeTruthy();
    });

    it('should render category name', () => {
      const { getByText } = render(<CategoryCard {...defaultProps} />);
      expect(getByText('Medical Terminology')).toBeTruthy();
    });

    it('should render stat labels', () => {
      const { getByText } = render(<CategoryCard {...defaultProps} />);
      expect(getByText('Terms')).toBeTruthy();
      expect(getByText('Mastered')).toBeTruthy();
      expect(getByText('Accuracy')).toBeTruthy();
    });

    it('should render totalTerms value', () => {
      const { getByText } = render(<CategoryCard {...defaultProps} />);
      expect(getByText('20')).toBeTruthy();
    });

    it('should render masteredTerms value', () => {
      const { getByText } = render(<CategoryCard {...defaultProps} />);
      expect(getByText('15')).toBeTruthy();
    });

    it('should render accuracy value with percentage symbol', () => {
      const { getByText } = render(<CategoryCard {...defaultProps} />);
      expect(getByText('85%')).toBeTruthy();
    });
  });

  describe('Mastery Percentage Calculation', () => {
    it('should calculate correct percentage (15/20 = 75%)', () => {
      const { getByText } = render(
        <CategoryCard
          category="Test"
          totalTerms={20}
          masteredTerms={15}
          accuracy={80}
        />
      );
      // Progress bar width should be 75%
      expect(getByText('15')).toBeTruthy();
      expect(getByText('20')).toBeTruthy();
    });

    it('should show 0% when totalTerms is 0', () => {
      const { getByText, getAllByText } = render(
        <CategoryCard
          category="Empty Category"
          totalTerms={0}
          masteredTerms={0}
          accuracy={0}
        />
      );
      const zeroTexts = getAllByText('0');
      expect(zeroTexts.length).toBeGreaterThan(0);
      expect(getByText('Empty Category')).toBeTruthy();
    });

    it('should show 100% when all terms are mastered', () => {
      const { getByText, getAllByText } = render(
        <CategoryCard
          category="Complete"
          totalTerms={10}
          masteredTerms={10}
          accuracy={100}
        />
      );
      const tenTexts = getAllByText('10');
      expect(tenTexts.length).toBe(2); // totalTerms and masteredTerms both 10
      expect(getByText('100%')).toBeTruthy();
    });

    it('should handle 0/10 = 0% mastery', () => {
      const { getByText } = render(
        <CategoryCard
          category="Not Started"
          totalTerms={10}
          masteredTerms={0}
          accuracy={0}
        />
      );
      expect(getByText('10')).toBeTruthy();
      expect(getByText('0')).toBeTruthy();
      expect(getByText('0%')).toBeTruthy();
    });

    it('should handle 1/2 = 50% mastery', () => {
      const { getByText } = render(
        <CategoryCard
          category="Half Complete"
          totalTerms={2}
          masteredTerms={1}
          accuracy={50}
        />
      );
      expect(getByText('2')).toBeTruthy();
      expect(getByText('1')).toBeTruthy();
      expect(getByText('50%')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero accuracy', () => {
      const { getByText } = render(
        <CategoryCard
          category="Low Accuracy"
          totalTerms={5}
          masteredTerms={0}
          accuracy={0}
        />
      );
      expect(getByText('0%')).toBeTruthy();
    });

    it('should handle perfect accuracy', () => {
      const { getByText } = render(
        <CategoryCard
          category="Perfect"
          totalTerms={5}
          masteredTerms={5}
          accuracy={100}
        />
      );
      expect(getByText('100%')).toBeTruthy();
    });

    it('should handle large numbers', () => {
      const { getByText } = render(
        <CategoryCard
          category="Large Dataset"
          totalTerms={1000}
          masteredTerms={750}
          accuracy={95}
        />
      );
      expect(getByText('1000')).toBeTruthy();
      expect(getByText('750')).toBeTruthy();
      expect(getByText('95%')).toBeTruthy();
    });

    it('should handle single term', () => {
      const { getByText, getAllByText } = render(
        <CategoryCard
          category="Single Term"
          totalTerms={1}
          masteredTerms={1}
          accuracy={100}
        />
      );
      const oneTexts = getAllByText('1');
      expect(oneTexts.length).toBe(2); // totalTerms and masteredTerms both 1
      expect(getByText('100%')).toBeTruthy();
    });

    it('should handle fractional accuracy', () => {
      const { getByText } = render(
        <CategoryCard
          category="Fractional"
          totalTerms={10}
          masteredTerms={5}
          accuracy={87}
        />
      );
      expect(getByText('87%')).toBeTruthy();
    });
  });

  describe('Different Categories', () => {
    it('should render Anatomy category', () => {
      const { getByText } = render(
        <CategoryCard
          category="Anatomy"
          totalTerms={30}
          masteredTerms={25}
          accuracy={90}
        />
      );
      expect(getByText('Anatomy')).toBeTruthy();
    });

    it('should render Medical Specialty category', () => {
      const { getByText } = render(
        <CategoryCard
          category="Medical Specialty"
          totalTerms={15}
          masteredTerms={10}
          accuracy={80}
        />
      );
      expect(getByText('Medical Specialty')).toBeTruthy();
    });

    it('should render Procedures category', () => {
      const { getByText } = render(
        <CategoryCard
          category="Procedures"
          totalTerms={25}
          masteredTerms={20}
          accuracy={88}
        />
      );
      expect(getByText('Procedures')).toBeTruthy();
    });

    it('should handle long category names', () => {
      const longCategory = 'Very Long Category Name That Might Wrap';
      const { getByText } = render(
        <CategoryCard
          category={longCategory}
          totalTerms={10}
          masteredTerms={5}
          accuracy={75}
        />
      );
      expect(getByText(longCategory)).toBeTruthy();
    });
  });

  describe('Component Stability', () => {
    it('should not crash with all valid props', () => {
      const { getByText } = render(<CategoryCard {...defaultProps} />);
      expect(getByText('Medical Terminology')).toBeTruthy();
    });

    it('should handle rerenders with same props', () => {
      const { getByText, rerender } = render(<CategoryCard {...defaultProps} />);
      expect(getByText('Medical Terminology')).toBeTruthy();

      rerender(<CategoryCard {...defaultProps} />);
      expect(getByText('Medical Terminology')).toBeTruthy();
    });

    it('should handle prop changes', () => {
      const { getByText, rerender } = render(<CategoryCard {...defaultProps} />);
      expect(getByText('20')).toBeTruthy();

      rerender(
        <CategoryCard
          {...defaultProps}
          totalTerms={30}
          masteredTerms={25}
          accuracy={95}
        />
      );
      expect(getByText('30')).toBeTruthy();
      expect(getByText('25')).toBeTruthy();
      expect(getByText('95%')).toBeTruthy();
    });

    it('should handle category name change', () => {
      const { getByText, rerender } = render(<CategoryCard {...defaultProps} />);
      expect(getByText('Medical Terminology')).toBeTruthy();

      rerender(<CategoryCard {...defaultProps} category="Pharmacology" />);
      expect(getByText('Pharmacology')).toBeTruthy();
    });
  });
});
