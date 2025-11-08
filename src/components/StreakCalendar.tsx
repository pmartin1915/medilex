import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { theme } from '../theme/theme';

interface Props {
  streak: number;
  weekProgress: boolean[];
}

export const StreakCalendar: React.FC<Props> = ({ streak, weekProgress }) => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Flame size={24} color={theme.colors.streakFire} />
        <Text style={styles.streakText}>{streak} Day Streak!</Text>
      </View>
      
      <View style={styles.daysContainer}>
        {days.map((day, index) => (
          <View key={index} style={styles.dayColumn}>
            <Text style={styles.dayLabel}>{day}</Text>
            <View
              style={[
                styles.dayCircle,
                weekProgress[index] && styles.dayCircleActive,
              ]}
            >
              {weekProgress[index] && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
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
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  streakText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleActive: {
    backgroundColor: theme.colors.accent,
  },
  checkmark: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
