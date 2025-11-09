import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { theme } from '../theme/theme';
import { useWordStore } from '../store/wordStore';
import { useStreakStore } from '../store/streakStore';
import { StreakCalendar } from '../components/StreakCalendar';
import { MedicalTermCard } from '../components/MedicalTermCard';
import { PrimaryButton } from '../components/PrimaryButton';
import * as Speech from 'expo-speech';

export const HomeScreen = ({ navigation }: any) => {
  const terms = useWordStore(state => state.terms);
  const streak = useStreakStore(state => state.currentStreak);
  const weekProgress = useStreakStore(state => state.weekProgress);
  const toggleFavorite = useWordStore(state => state.toggleFavorite);
  const toggleBookmark = useWordStore(state => state.toggleBookmark);
  const getProgress = useWordStore(state => state.getProgress);

  const wordOfDay = terms[0];
  const progress = wordOfDay ? getProgress(wordOfDay.id) : undefined;

  const handlePronounce = () => {
    if (wordOfDay && Platform.OS !== 'web') {
      Speech.speak(wordOfDay.term, { rate: 0.75 });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.crownButton}>
          <Text style={styles.crownIcon}>👑</Text>
        </TouchableOpacity>
      </View>

      <StreakCalendar streak={streak} weekProgress={weekProgress} />

      <Text style={styles.sectionTitle}>Word of the Day</Text>

      {wordOfDay && (
        <MedicalTermCard
          term={wordOfDay}
          onPronounce={handlePronounce}
          onFavorite={() => toggleFavorite(wordOfDay.id)}
          onBookmark={() => toggleBookmark(wordOfDay.id)}
          isFavorited={progress?.isFavorited}
          isBookmarked={progress?.isBookmarked}
        />
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{terms.length}</Text>
          <Text style={styles.statLabel}>Terms Available</Text>
        </View>
      </View>

      <PrimaryButton
        title="Start Study Session"
        onPress={() => navigation.navigate('Learn')}
      />
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
    padding: 20,
    paddingTop: 60,
  },
  profileButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  profileIcon: {
    fontSize: 24,
  },
  crownButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  crownIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: 20,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
});
