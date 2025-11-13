import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Volume2, ThumbsUp, X, Bookmark, Share2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme/theme';
import { MedicalTerm } from '../types';
import { TermBreakdown } from './TermBreakdown';
import { hasBreakdown } from '../utils/componentBreakdown';
import { Tooltip } from './Tooltip';

interface Props {
  term: MedicalTerm;
  onPronounce: () => void;
  onKnowIt: () => void;
  onDontKnow: () => void;
  onBookmark: () => void;
  onShare: () => void;
  isBookmarked?: boolean;
  showActions?: boolean;
  scrollEnabled?: boolean;
}

export const MedicalTermCard: React.FC<Props> = ({
  term,
  onPronounce,
  onKnowIt,
  onDontKnow,
  onBookmark,
  onShare,
  isBookmarked = false,
  showActions = true,
  scrollEnabled = true,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Dynamic font size calculation based on term length
  const getTermFontSize = (termText: string): number => {
    const length = termText.length;
    if (length <= 10) return 48;
    if (length <= 14) return 42;
    if (length <= 16) return 38;
    if (length <= 20) return 34;
    if (length <= 24) return 30;
    return 26;
  };

  const termFontSize = getTermFontSize(term.term);

  // Wrapper functions to add haptic feedback
  const handleKnowIt = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onKnowIt();
  };

  const handleDontKnow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDontKnow();
  };

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBookmark();
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onShare();
  };

  return (
    <View style={styles.card}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        {/* Word block - primary focus */}
        <Text style={[styles.term, { fontSize: termFontSize }]}>{term.term}</Text>

        {/* Pronunciation pill - rounded background */}
        <View style={styles.pronunciationPillContainer}>
          <TouchableOpacity
            onPress={onPronounce}
            style={styles.pronunciationPill}
            activeOpacity={0.7}
          >
            <Volume2 size={20} color={theme.colors.accent} strokeWidth={1.8} />
            <Text style={styles.pronunciation}>{term.pronunciation}</Text>
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
        <View style={styles.actionButtonsFooter}>
          {/* Know It - Green */}
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.knowItButton]}
              onPress={handleKnowIt}
              onLongPress={() => setActiveTooltip('knowIt')}
              onPressOut={() => setActiveTooltip(null)}
              delayLongPress={300}
              activeOpacity={0.7}
              accessibilityLabel="Know It"
              accessibilityRole="button"
            >
              <ThumbsUp size={22} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
            <Tooltip text="Know It" visible={activeTooltip === 'knowIt'} />
          </View>

          {/* Don't Know - Red */}
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.dontKnowButton]}
              onPress={handleDontKnow}
              onLongPress={() => setActiveTooltip('dontKnow')}
              onPressOut={() => setActiveTooltip(null)}
              delayLongPress={300}
              activeOpacity={0.7}
              accessibilityLabel="Don't Know"
              accessibilityRole="button"
            >
              <X size={22} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
            <Tooltip text="Don't Know" visible={activeTooltip === 'dontKnow'} />
          </View>

          {/* Bookmark - Amber */}
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.bookmarkButton]}
              onPress={handleBookmark}
              onLongPress={() => setActiveTooltip('save')}
              onPressOut={() => setActiveTooltip(null)}
              delayLongPress={300}
              activeOpacity={0.7}
              accessibilityLabel={isBookmarked ? "Remove bookmark" : "Bookmark"}
              accessibilityRole="button"
            >
              <Bookmark
                size={22}
                color="#FFFFFF"
                fill={isBookmarked ? "#FFFFFF" : "none"}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <Tooltip text="Save" visible={activeTooltip === 'save'} />
          </View>

          {/* Share - Teal */}
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton]}
              onPress={handleShare}
              onLongPress={() => setActiveTooltip('share')}
              onPressOut={() => setActiveTooltip(null)}
              delayLongPress={300}
              activeOpacity={0.7}
              accessibilityLabel="Share"
              accessibilityRole="button"
            >
              <Share2 size={22} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
            <Tooltip text="Share" visible={activeTooltip === 'share'} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    paddingHorizontal: 32,
    paddingTop: 40,
    minHeight: 600,
    height: '88%',
  },
  // Word block - largest element, serif, bold
  term: {
    ...theme.typography.termDisplay,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    letterSpacing: 0.5,
  },
  // Pronunciation pill container - centers the pill
  pronunciationPillContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  // Rounded pill background for pronunciation + speaker icon
  pronunciationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(91, 143, 163, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pronunciation: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontFamily: 'monospace',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
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
  // Simplified inline part of speech + definition (matching photo)
  partOfSpeechInline: {
    fontSize: 20,
    fontWeight: '400',
    color: theme.colors.textPrimary,
    lineHeight: 30,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
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
  // New integrated action buttons footer (fixed at bottom of card)
  actionButtonsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButtonContainer: {
    flex: 1,
    position: 'relative',
  },
  actionButton: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    minHeight: 48,
  },
  knowItButton: {
    backgroundColor: 'rgba(143, 172, 142, 0.92)',
  },
  dontKnowButton: {
    backgroundColor: 'rgba(209, 123, 111, 0.92)',
  },
  bookmarkButton: {
    backgroundColor: 'rgba(232, 182, 107, 0.92)',
  },
  shareButton: {
    backgroundColor: 'rgba(123, 170, 165, 0.92)',
  },
});
