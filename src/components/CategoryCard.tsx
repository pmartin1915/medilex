import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface CategoryCardProps {
  category: string;
  totalTerms: number;
  masteredTerms: number;
  accuracy: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  totalTerms,
  masteredTerms,
  accuracy,
}) => {
  const masteryPercentage = totalTerms > 0 ? (masteredTerms / totalTerms) * 100 : 0;

  return (
    <View style={styles.card}>
      <Text style={styles.category}>{category}</Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{totalTerms}</Text>
          <Text style={styles.statLabel}>Terms</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.colors.success }]}>
            {masteredTerms}
          </Text>
          <Text style={styles.statLabel}>Mastered</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.colors.clinical }]}>
            {accuracy}%
          </Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${masteryPercentage}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    marginBottom: 12,
    ...theme.shadows.sm,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: 3,
  },
});
