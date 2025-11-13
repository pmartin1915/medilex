import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme/theme';

interface StudyHeatmapProps {
  studyDates: string[]; // Array of date strings in ISO format
}

export const StudyHeatmap: React.FC<StudyHeatmapProps> = ({ studyDates }) => {
  // Generate last 12 weeks (84 days) of data
  const generateHeatmapData = () => {
    const today = new Date();
    const weeks: { date: Date; hasStudied: boolean }[][] = [];

    // Start from 12 weeks ago
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 83); // 12 weeks = 84 days

    let currentWeek: { date: Date; hasStudied: boolean }[] = [];

    for (let i = 0; i < 84; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dateStr = date.toISOString().split('T')[0];
      const hasStudied = studyDates.includes(dateStr);

      currentWeek.push({ date, hasStudied });

      // Start new week on Sunday (day 0)
      if (date.getDay() === 6 || i === 83) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }

    return weeks;
  };

  const weeks = generateHeatmapData();
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study Activity</Text>
      <Text style={styles.subtitle}>Last 12 weeks</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.heatmapContainer}>
          {/* Day labels */}
          <View style={styles.dayLabels}>
            {weekDays.map((day, index) => (
              <Text key={index} style={styles.dayLabel}>{day}</Text>
            ))}
          </View>

          {/* Heatmap grid */}
          <View style={styles.grid}>
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.week}>
                {week.map((day, dayIndex) => (
                  <View
                    key={`${weekIndex}-${dayIndex}`}
                    style={[
                      styles.day,
                      day.hasStudied && styles.dayActive,
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        <View style={styles.legendDots}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.border }]} />
          <View style={[styles.legendDot, styles.dayActive]} />
        </View>
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    marginBottom: 16,
    ...theme.shadows.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  scrollView: {
    marginBottom: 12,
  },
  heatmapContainer: {
    flexDirection: 'row',
  },
  dayLabels: {
    marginRight: 8,
    justifyContent: 'space-around',
  },
  dayLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    height: 14,
    lineHeight: 14,
  },
  grid: {
    flexDirection: 'row',
    gap: 3,
  },
  week: {
    gap: 3,
  },
  day: {
    width: 14,
    height: 14,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
  },
  dayActive: {
    backgroundColor: theme.colors.accent,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  legendText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  legendDots: {
    flexDirection: 'row',
    gap: 3,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
});
