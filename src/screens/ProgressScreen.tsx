import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { theme } from '../theme/theme';
import { useWordStore } from '../store/wordStore';
import { useStreakStore } from '../store/streakStore';
import { BookOpen, Target, Award, TrendingUp } from 'lucide-react-native';

export const ProgressScreen = () => {
  const terms = useWordStore(state => state.terms);
  const userProgress = useWordStore(state => state.userProgress);
  const currentStreak = useStreakStore(state => state.currentStreak);
  const longestStreak = useStreakStore(state => state.longestStreak);

  const totalStudied = Object.values(userProgress).reduce(
    (sum, p) => sum + p.timesStudied,
    0
  );

  const totalCorrect = Object.values(userProgress).reduce(
    (sum, p) => sum + p.timesCorrect,
    0
  );

  const accuracy = totalStudied > 0
    ? Math.round((totalCorrect / totalStudied) * 100)
    : 0;

  const masteredTerms = Object.values(userProgress).filter(
    p => p.masteryLevel === 'mastered'
  ).length;

  const StatCard = ({ icon: Icon, value, label, color }: any) => (
    <View style={styles.statCard}>
      <Icon size={32} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Keep up the great work!</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon={BookOpen}
          value={totalStudied}
          label="Terms Studied"
          color={theme.colors.accent}
        />
        <StatCard
          icon={Target}
          value={`${accuracy}%`}
          label="Accuracy"
          color={theme.colors.success}
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon={Award}
          value={masteredTerms}
          label="Mastered"
          color={theme.colors.clinical}
        />
        <StatCard
          icon={TrendingUp}
          value={currentStreak}
          label="Day Streak"
          color={theme.colors.streakFire}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementCard}>
          <Text style={styles.achievementIcon}>🔥</Text>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>Longest Streak</Text>
            <Text style={styles.achievementValue}>{longestStreak} days</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: 20,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  achievementCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  achievementIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  achievementValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.accent,
  },
});
