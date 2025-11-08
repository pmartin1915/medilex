import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Volume2, Heart, Bookmark, Info } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { MedicalTerm } from '../types';

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
        <Text style={styles.term}>{term.term}</Text>
        
        <View style={styles.pronunciationRow}>
          <Text style={styles.pronunciation}>{term.pronunciation}</Text>
          <TouchableOpacity onPress={onPronounce} style={styles.audioButton}>
            <Volume2 size={20} color={theme.colors.accent} />
          </TouchableOpacity>
        </View>

        <Text style={styles.syllables}>{term.syllables}</Text>
        <Text style={styles.partOfSpeech}>{term.partOfSpeech}</Text>

        <View style={styles.divider} />

        <Text style={styles.definition}>{term.definition}</Text>

        <View style={styles.exampleContainer}>
          <Text style={styles.exampleLabel}>Clinical Example:</Text>
          <Text style={styles.example}>{term.example}</Text>
        </View>

        {showDetails && (
          <>
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
        >
          <Info size={16} color={theme.colors.accent} />
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
  term: {
    fontSize: 36,
    fontWeight: '400',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  pronunciationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  pronunciation: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    fontFamily: 'monospace',
    flex: 1,
  },
  audioButton: {
    padding: theme.spacing.sm,
  },
  syllables: {
    fontSize: 20,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  partOfSpeech: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
    marginBottom: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: theme.spacing.md,
  },
  definition: {
    fontSize: 18,
    lineHeight: 28,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  exampleContainer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  exampleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.clinical,
    marginBottom: theme.spacing.xs,
  },
  example: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  detailsButtonText: {
    fontSize: 14,
    color: theme.colors.accent,
    marginLeft: theme.spacing.xs,
    fontWeight: '600',
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
