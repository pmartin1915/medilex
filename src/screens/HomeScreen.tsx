import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Heart, BookMarked, TrendingDown, Shuffle, Target, BookOpen } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { useWordStore } from '../store/wordStore';
import { useStreakStore } from '../store/streakStore';
import { StreakCalendar } from '../components/StreakCalendar';
import { MedicalTermCard } from '../components/MedicalTermCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { StatCard } from '../components/StatCard';
import * as Speech from 'expo-speech';

export const HomeScreen = ({ navigation }: any) => {
  const terms = useWordStore(state => state.terms);
  const userProgress = useWordStore(state => state.userProgress);
  const streak = useStreakStore(state => state.currentStreak);
  const weekProgress = useStreakStore(state => state.weekProgress);
  const toggleFavorite = useWordStore(state => state.toggleFavorite);
  const toggleBookmark = useWordStore(state => state.toggleBookmark);
  const getProgress = useWordStore(state => state.getProgress);

  const wordOfDay = terms[0];
  const progress = wordOfDay ? getProgress(wordOfDay.id) : undefined;

  // Calculate quick stats
  const quickStats = useMemo(() => {
    const progressArray = Object.values(userProgress);
    const mastered = progressArray.filter(p => p.masteryLevel === 'mastered').length;
    const needsReview = progressArray.filter(
      p => p.masteryLevel === 'learning' &&
      new Date().getTime() - new Date(p.lastStudied).getTime() > 24 * 60 * 60 * 1000
    ).length;

    return { mastered, needsReview };
  }, [userProgress]);

  // Get recently studied terms (last 5)
  const recentTerms = useMemo(() => {
    return terms
      .filter(term => userProgress[term.id]?.lastStudied)
      .sort((a, b) => {
        const aDate = new Date(userProgress[a.id].lastStudied).getTime();
        const bDate = new Date(userProgress[b.id].lastStudied).getTime();
        return bDate - aDate;
      })
      .slice(0, 5);
  }, [terms, userProgress]);

  // Get terms that need review
  const termsNeedingReview = useMemo(() => {
    return terms
      .filter(term => {
        const p = userProgress[term.id];
        if (!p || p.masteryLevel === 'mastered') return false;
        const daysSinceStudy = (new Date().getTime() - new Date(p.lastStudied).getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceStudy > 1 && p.timesStudied > 0;
      })
      .slice(0, 3);
  }, [terms, userProgress]);

  const handlePronounce = () => {
    if (wordOfDay && Platform.OS !== 'web') {
      Speech.speak(wordOfDay.term, { rate: 0.75 });
    }
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}!</Text>
          <Text style={styles.motivationText}>Ready to expand your medical vocabulary?</Text>
        </View>
        <TouchableOpacity style={styles.crownButton}>
          <Text style={styles.crownIcon}>👑</Text>
        </TouchableOpacity>
      </View>

      <StreakCalendar streak={streak} weekProgress={weekProgress} />

      {/* Quick Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          icon={BookOpen}
          value={terms.length}
          label="Total Terms"
          color={theme.colors.accent}
        />
        <StatCard
          icon={Target}
          value={quickStats.mastered}
          label="Mastered"
          color={theme.colors.success}
        />
      </View>

      {quickStats.needsReview > 0 && (
        <View style={styles.statsGrid}>
          <StatCard
            icon={TrendingDown}
            value={quickStats.needsReview}
            label="Need Review"
            color={theme.colors.warning}
          />
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Learn')}
            activeOpacity={0.7}
          >
            <BookOpen size={24} color={theme.colors.accent} strokeWidth={2} />
            <Text style={styles.actionButtonText}>Study All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Library')}
            activeOpacity={0.7}
          >
            <Heart size={24} color={theme.colors.favorite} strokeWidth={2} />
            <Text style={styles.actionButtonText}>Favorites</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Library')}
            activeOpacity={0.7}
          >
            <TrendingDown size={24} color={theme.colors.warning} strokeWidth={2} />
            <Text style={styles.actionButtonText}>Review</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Learn')}
            activeOpacity={0.7}
          >
            <Shuffle size={24} color={theme.colors.clinical} strokeWidth={2} />
            <Text style={styles.actionButtonText}>Random</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Word of the Day */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Word of the Day</Text>
        {wordOfDay && (
          <MedicalTermCard
            term={wordOfDay}
            onPronounce={handlePronounce}
            onKnowIt={() => {}}
            onDontKnow={() => {}}
            onBookmark={() => toggleBookmark(wordOfDay.id)}
            onShare={() => {}}
            isBookmarked={progress?.isBookmarked}
            showActions={false}
          />
        )}
      </View>

      {/* Recently Studied */}
      {recentTerms.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Studied</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentTerms.map((term, index) => (
              <TouchableOpacity
                key={term.id}
                style={[styles.recentTermCard, index === 0 && { marginLeft: 0 }]}
                onPress={() => navigation.navigate('Library')}
                activeOpacity={0.7}
              >
                <Text style={styles.recentTermName}>{term.term}</Text>
                <Text style={styles.recentTermCategory}>{term.category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Terms Needing Review */}
      {termsNeedingReview.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Needs Your Attention</Text>
          {termsNeedingReview.map((term) => (
            <TouchableOpacity
              key={term.id}
              style={styles.reviewTermCard}
              onPress={() => navigation.navigate('Learn')}
              activeOpacity={0.7}
            >
              <View style={styles.reviewTermContent}>
                <Text style={styles.reviewTermName}>{term.term}</Text>
                <Text style={styles.reviewTermHint} numberOfLines={1}>
                  {term.definition}
                </Text>
              </View>
              <View style={styles.reviewBadge}>
                <TrendingDown size={16} color={theme.colors.warning} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Main CTA */}
      <View style={styles.section}>
        <PrimaryButton
          title="Start Study Session"
          onPress={() => navigation.navigate('Learn')}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  motivationText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  crownButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  crownIcon: {
    fontSize: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    ...theme.shadows.sm,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  recentTermCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    marginLeft: 12,
    minWidth: 140,
    ...theme.shadows.sm,
  },
  recentTermName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  recentTermCategory: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reviewTermCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  reviewTermContent: {
    flex: 1,
  },
  reviewTermName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  reviewTermHint: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  reviewBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
