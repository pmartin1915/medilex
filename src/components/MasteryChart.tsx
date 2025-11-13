import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface MasteryChartProps {
  newCount: number;
  learningCount: number;
  familiarCount: number;
  masteredCount: number;
}

export const MasteryChart: React.FC<MasteryChartProps> = ({
  newCount,
  learningCount,
  familiarCount,
  masteredCount,
}) => {
  const total = newCount + learningCount + familiarCount + masteredCount;

  const getPercentage = (count: number) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  const masteryLevels = [
    { label: 'New', count: newCount, color: theme.colors.info, percentage: getPercentage(newCount) },
    { label: 'Learning', count: learningCount, color: theme.colors.warning, percentage: getPercentage(learningCount) },
    { label: 'Familiar', count: familiarCount, color: theme.colors.clinical, percentage: getPercentage(familiarCount) },
    { label: 'Mastered', count: masteredCount, color: theme.colors.success, percentage: getPercentage(masteredCount) },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mastery Distribution</Text>

      {/* Visual Bar */}
      <View style={styles.barContainer}>
        {masteryLevels.map((level, index) => (
          level.percentage > 0 && (
            <View
              key={level.label}
              style={[
                styles.barSegment,
                {
                  backgroundColor: level.color,
                  width: `${level.percentage}%`,
                  borderTopLeftRadius: index === 0 ? 8 : 0,
                  borderBottomLeftRadius: index === 0 ? 8 : 0,
                  borderTopRightRadius: index === masteryLevels.length - 1 ? 8 : 0,
                  borderBottomRightRadius: index === masteryLevels.length - 1 ? 8 : 0,
                }
              ]}
            />
          )
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {masteryLevels.map((level) => (
          <View key={level.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: level.color }]} />
            <Text style={styles.legendLabel}>{level.label}</Text>
            <Text style={styles.legendCount}>{level.count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: 20,
    marginBottom: 16,
    ...theme.shadows.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  barContainer: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  barSegment: {
    height: '100%',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '45%',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  legendCount: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
});
