import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
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
      // Auto-advance to next card after marking "Don't Know"
      advanceToNextCard();
    }
  };

  const handleSwipeRight = () => {
    if (currentTerm) {
      updateProgress(currentTerm.id, true);
      // Auto-advance to next card after marking "Know It"
      advanceToNextCard();
    }
  };

  const handleSwipeUp = () => {
    // Swipe UP = Navigate to NEXT word
    advanceToNextCard();
  };

  const handleSwipeDown = () => {
    // Swipe DOWN = Navigate to PREVIOUS word
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const advanceToNextCard = () => {
    if (currentIndex < terms.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Reached end of deck
      setIsComplete(true);
      recordStudySession();
    }
  };

  const handlePronounce = () => {
    if (currentTerm && Platform.OS !== 'web') {
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
        {Platform.OS === 'web' ? (
          <View style={styles.webControlsContainer}>
            <View style={styles.webVerticalButtons}>
              <TouchableOpacity
                style={[styles.webButton, styles.webButtonVertical, currentIndex === 0 && styles.webButtonDisabled]}
                onPress={handleSwipeDown}
                disabled={currentIndex === 0}
              >
                <Text style={styles.webButtonText}>Previous (Down Arrow)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.webButton, styles.webButtonVertical, currentIndex === terms.length - 1 && styles.webButtonDisabled]}
                onPress={handleSwipeUp}
                disabled={currentIndex === terms.length - 1}
              >
                <Text style={styles.webButtonText}>Next (Up Arrow)</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.webHorizontalButtons}>
              <TouchableOpacity
                style={[styles.webButton, styles.webButtonLeft]}
                onPress={handleSwipeLeft}
              >
                <Text style={styles.webButtonText}>Don't Know (Left Arrow)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.webButton, styles.webButtonRight]}
                onPress={handleSwipeRight}
              >
                <Text style={styles.webButtonText}>Know It (Right Arrow)</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.footerText}>
            Up: Next | Down: Previous | Left/Right: Answer & Advance
          </Text>
        )}
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
    paddingBottom: 20,
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  webControlsContainer: {
    width: '100%',
    maxWidth: 500,
    gap: 12,
  },
  webVerticalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  webHorizontalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  webButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webButtonVertical: {
    backgroundColor: theme.colors.accent,
  },
  webButtonLeft: {
    backgroundColor: theme.colors.error,
  },
  webButtonRight: {
    backgroundColor: theme.colors.success,
  },
  webButtonDisabled: {
    backgroundColor: theme.colors.textTertiary,
    opacity: 0.5,
  },
  webButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
