import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../theme/theme';
import { useWordStore } from '../store/wordStore';
import { useStreakStore } from '../store/streakStore';
import { BookOpen, Target, Award, TrendingUp, Heart, Calendar } from 'lucide-react-native';
import { StatCard } from '../components/StatCard';
import { MasteryChart } from '../components/MasteryChart';
import { StudyHeatmap } from '../components/StudyHeatmap';
import { CategoryCard } from '../components/CategoryCard';

export const ProgressScreen = () => {
  const terms = useWordStore(state => state.terms);
  const userProgress = useWordStore(state => state.userProgress);
  const currentStreak = useStreakStore(state => state.currentStreak);
  const longestStreak = useStreakStore(state => state.longestStreak);
  const studyDates = useStreakStore(state => state.studyDates);

  // Calculate overall stats
  const stats = useMemo(() => {
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

    const favoritedTerms = Object.values(userProgress).filter(
      p => p.isFavorited
    ).length;

    return { totalStudied, totalCorrect, accuracy, favoritedTerms };
  }, [userProgress]);

  // Calculate mastery distribution
  const masteryStats = useMemo(() => {
    const counts = {
      new: 0,
      learning: 0,
      familiar: 0,
      mastered: 0,
    };

    terms.forEach(term => {
      const progress = userProgress[term.id];
      const level = progress?.masteryLevel || 'new';
      counts[level]++;
    });

    return counts;
  }, [terms, userProgress]);

  // Calculate category performance
  const categoryStats = useMemo(() => {
    const categories = new Map<string, {
      total: number;
      studied: number;
      correct: number;
      mastered: number;
    }>();

    terms.forEach(term => {
      if (!categories.has(term.category)) {
        categories.set(term.category, {
          total: 0,
          studied: 0,
          correct: 0,
          mastered: 0,
        });
      }

      const cat = categories.get(term.category)!;
      cat.total++;

      const progress = userProgress[term.id];
      if (progress) {
        if (progress.timesStudied > 0) {
          cat.studied++;
          cat.correct += progress.timesCorrect;
        }
        if (progress.masteryLevel === 'mastered') {
          cat.mastered++;
        }
      }
    });

    return Array.from(categories.entries()).map(([category, data]) => ({
      category,
      totalTerms: data.total,
      masteredTerms: data.mastered,
      accuracy: data.studied > 0 ? Math.round((data.correct / data.studied) * 100) : 0,
    }));
  }, [terms, userProgress]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Keep up the great work!</Text>
      </View>

      {/* Main Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          icon={BookOpen}
          value={stats.totalStudied}
          label="Reviews"
          color={theme.colors.accent}
        />
        <StatCard
          icon={Target}
          value={`${stats.accuracy}%`}
          label="Accuracy"
          color={theme.colors.success}
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon={Award}
          value={masteryStats.mastered}
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

      <View style={styles.statsGrid}>
        <StatCard
          icon={Heart}
          value={stats.favoritedTerms}
          label="Favorites"
          color={theme.colors.favorite}
        />
        <StatCard
          icon={Calendar}
          value={studyDates.length}
          label="Study Days"
          color={theme.colors.info}
        />
      </View>

      {/* Mastery Distribution Chart */}
      <View style={styles.section}>
        <MasteryChart
          newCount={masteryStats.new}
          learningCount={masteryStats.learning}
          familiarCount={masteryStats.familiar}
          masteredCount={masteryStats.mastered}
        />
      </View>

      {/* Study Activity Heatmap */}
      <View style={styles.section}>
        <StudyHeatmap studyDates={studyDates} />
      </View>

      {/* Category Performance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance by Category</Text>
        {categoryStats.map((cat) => (
          <CategoryCard
            key={cat.category}
            category={cat.category}
            totalTerms={cat.totalTerms}
            masteredTerms={cat.masteredTerms}
            accuracy={cat.accuracy}
          />
        ))}
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>

        <View style={styles.achievementCard}>
          <Text style={styles.achievementIcon}>🔥</Text>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>Longest Streak</Text>
            <Text style={styles.achievementValue}>{longestStreak} days</Text>
          </View>
        </View>

        {stats.totalStudied >= 100 && (
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>🎯</Text>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Century Scholar</Text>
              <Text style={styles.achievementValue}>100+ reviews</Text>
            </View>
          </View>
        )}

        {masteryStats.mastered >= 10 && (
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>⭐</Text>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Master of Terms</Text>
              <Text style={styles.achievementValue}>{masteryStats.mastered} mastered</Text>
            </View>
          </View>
        )}

        {currentStreak >= 7 && (
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>💪</Text>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Week Warrior</Text>
              <Text style={styles.achievementValue}>7+ day streak</Text>
            </View>
          </View>
        )}
      </View>

      <View style={{ height: 40 }} />
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
  section: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  achievementCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    ...theme.shadows.sm,
  },
  achievementIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  achievementValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.accent,
  },
});
