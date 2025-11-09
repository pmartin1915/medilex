import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Volume2, Heart, Bookmark, Info } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { MedicalTerm } from '../types';
import { TermBreakdown } from './TermBreakdown';
import { hasBreakdown } from '../utils/componentBreakdown';

interface Props {
  term: MedicalTerm;
  onPronounce: () => void;
  onFavorite: () => void;
  onBookmark: () => void;
  isFavorited?: boolean;
  isBookmarked?: boolean;
  showActions?: boolean;
}

export const MedicalTermCard: React.FC<Props> = ({
  term,
  onPronounce,
  onFavorite,
  onBookmark,
  isFavorited = false,
  isBookmarked = false,
  showActions = true,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <View style={styles.card}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Word block - primary focus */}
        <Text style={styles.term}>{term.term}</Text>

        <View style={styles.pronunciationRow}>
          <Text style={styles.pronunciation}>{term.pronunciation}</Text>
          <TouchableOpacity
            onPress={onPronounce}
            style={styles.audioButton}
            activeOpacity={0.6}
          >
            <Volume2 size={22} color={theme.colors.accent} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.syllables}>{term.syllables}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.partOfSpeech}>{term.partOfSpeech}</Text>
        </View>

        {/* Definition block - clear separation with spacing */}
        <Text style={styles.sectionLabel}>DEFINITION</Text>
        <Text style={styles.definition}>{term.definition}</Text>

        {/* Clinical Example block - accent color only here */}
        <Text style={styles.clinicalLabel}>CLINICAL EXAMPLE</Text>
        <Text style={styles.example}>{term.example}</Text>

        {showDetails && (
          <>
            {hasBreakdown(term) && (
              <TermBreakdown term={term} showTitle={true} variant="inline" />
            )}

            {term.clinicalNote && (
              <View style={styles.clinicalNoteContainer}>
                <Text style={styles.clinicalNoteLabel}>Clinical Note:</Text>
                <Text style={styles.clinicalNote}>{term.clinicalNote}</Text>
              </View>
            )}

            <View style={styles.etymologyContainer}>
              <Text style={styles.etymologyLabel}>Etymology:</Text>
              <Text style={styles.etymology}>{term.etymology.meaning}</Text>
            </View>

            <View style={styles.categoryContainer}>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>{term.category}</Text>
              </View>
              {term.specialty && (
                <View style={[styles.categoryPill, styles.specialtyPill]}>
                  <Text style={styles.categoryText}>{term.specialty}</Text>
                </View>
              )}
            </View>

            {term.relatedTerms.length > 0 && (
              <View style={styles.relatedContainer}>
                <Text style={styles.relatedLabel}>Related Terms:</Text>
                <Text style={styles.relatedTerms}>
                  {term.relatedTerms.join(', ')}
                </Text>
              </View>
            )}
          </>
        )}

        <TouchableOpacity
          onPress={() => setShowDetails(!showDetails)}
          style={styles.detailsButton}
          activeOpacity={0.6}
        >
          <Text style={styles.detailsButtonText}>
            {showDetails ? 'Show Less' : 'Show More'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={onFavorite} style={styles.actionButton}>
            <Heart
              size={24}
              color={isFavorited ? theme.colors.favorite : theme.colors.textTertiary}
              fill={isFavorited ? theme.colors.favorite : 'none'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onBookmark} style={styles.actionButton}>
            <Bookmark
              size={24}
              color={isBookmarked ? theme.colors.bookmark : theme.colors.textTertiary}
              fill={isBookmarked ? theme.colors.bookmark : 'none'}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginHorizontal: theme.spacing.md,
    minHeight: 500,
    ...theme.shadows.card,
  },
  // Word block - largest element, serif, bold
  term: {
    ...theme.typography.termDisplay,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  pronunciationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  pronunciation: {
    ...theme.typography.pronunciation,
    color: theme.colors.textSecondary,
    fontFamily: 'monospace',
    flex: 1,
  },
  audioButton: {
    padding: theme.spacing.sm,
    marginRight: -theme.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  syllables: {
    fontSize: 13,
    color: theme.colors.textTertiary,
    letterSpacing: 0.5,
  },
  separator: {
    fontSize: 13,
    color: theme.colors.textTertiary,
    marginHorizontal: theme.spacing.sm,
  },
  partOfSpeech: {
    fontSize: 13,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
  },
  // Section labels - small, uppercase, subtle
  sectionLabel: {
    ...theme.typography.label,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  definition: {
    ...theme.typography.definition,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xl,
  },
  // Clinical label - accent color only here
  clinicalLabel: {
    ...theme.typography.label,
    color: theme.colors.accent,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  example: {
    ...theme.typography.example,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  clinicalNoteContainer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.clinical,
  },
  clinicalNoteLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.clinical,
    marginBottom: theme.spacing.xs,
  },
  clinicalNote: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSecondary,
  },
  etymologyContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  etymologyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.accent,
    marginBottom: theme.spacing.xs,
  },
  etymology: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  categoryPill: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  specialtyPill: {
    backgroundColor: theme.colors.clinical,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  relatedContainer: {
    marginTop: theme.spacing.md,
  },
  relatedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  relatedTerms: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  detailsButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  detailsButtonText: {
    fontSize: 14,
    color: theme.colors.accent,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    padding: theme.spacing.sm,
  },
});
