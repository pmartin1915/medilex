import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../theme/theme';
import { useWordStore } from '../store/wordStore';
import { useStreakStore } from '../store/streakStore';
import { SwipeableCard } from '../components/SwipeableCard';
import { MedicalTermCard } from '../components/MedicalTermCard';
import { ProgressIndicator } from '../components/ProgressIndicator';
import * as Speech from 'expo-speech';

export const LearnScreen = () => {
  const terms = useWordStore(state => state.terms);
  const updateProgress = useWordStore(state => state.updateProgress);
  const recordStudySession = useStreakStore(state => state.recordStudySession);
  const toggleFavorite = useWordStore(state => state.toggleFavorite);
  const toggleBookmark = useWordStore(state => state.toggleBookmark);
  const getProgress = useWordStore(state => state.getProgress);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentTerm = terms[currentIndex];
  const progress = currentTerm ? getProgress(currentTerm.id) : undefined;

  const handleSwipeLeft = () => {
    if (currentTerm) {
      updateProgress(currentTerm.id, false);
      nextCard();
    }
  };

  const handleSwipeRight = () => {
    if (currentTerm) {
      updateProgress(currentTerm.id, true);
      nextCard();
    }
  };

  const handleSwipeUp = () => {
    // Navigate to next card without evaluating
    if (currentIndex < terms.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSwipeDown = () => {
    // Navigate to previous card without evaluating
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const nextCard = () => {
    if (currentIndex < terms.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
      recordStudySession();
    }
  };

  const handlePronounce = () => {
    if (currentTerm) {
      Speech.speak(currentTerm.term, { rate: 0.75 });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <View style={styles.completeContainer}>
        <Text style={styles.completeTitle}>Session Complete!</Text>
        <Text style={styles.completeSubtitle}>
          You studied {terms.length} terms
        </Text>
        <TouchableOpacity
          style={styles.restartButton}
          onPress={handleRestart}
        >
          <Text style={styles.restartButtonText}>Study Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentTerm) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No terms available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProgressIndicator
          current={currentIndex + 1}
          total={terms.length}
        />
      </View>

      <View style={styles.cardContainer}>
        <SwipeableCard
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onSwipeUp={handleSwipeUp}
          onSwipeDown={handleSwipeDown}
        >
          <MedicalTermCard
            term={currentTerm}
            onPronounce={handlePronounce}
            onFavorite={() => toggleFavorite(currentTerm.id)}
            onBookmark={() => toggleBookmark(currentTerm.id)}
            isFavorited={progress?.isFavorited}
            isBookmarked={progress?.isBookmarked}
          />
        </SwipeableCard>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ← Don't Know  •  Know It →
        </Text>
        <Text style={[styles.footerText, styles.footerSubtext]}>
          ↑ Next  •  ↓ Previous
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: theme.spacing.md,
  },
  footer: {
    paddingVertical: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    letterSpacing: 0.5,
  },
  footerSubtext: {
    fontSize: 11,
    marginTop: 4,
  },
  completeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  completeSubtitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginBottom: 40,
  },
  restartButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
