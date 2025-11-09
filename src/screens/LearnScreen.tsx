import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { theme } from '../theme/theme';
import { useWordStore } from '../store/wordStore';
import { useStreakStore } from '../store/streakStore';
import { SwipeableCard } from '../components/SwipeableCard';
import { MedicalTermCard } from '../components/MedicalTermCard';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { ActionButtons } from '../components/ActionButtons';
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

  // Know It - Mark as known and advance
  const handleKnowIt = () => {
    if (currentTerm) {
      updateProgress(currentTerm.id, true);
      nextCard();
    }
  };

  // Don't Know - Mark as unknown and advance
  const handleDontKnow = () => {
    if (currentTerm) {
      updateProgress(currentTerm.id, false);
      nextCard();
    }
  };

  // Favorite - Toggle favorite (stays on card)
  const handleFavorite = () => {
    if (currentTerm) {
      toggleFavorite(currentTerm.id);
    }
  };

  // Bookmark - Toggle bookmark (stays on card)
  const handleBookmark = () => {
    if (currentTerm) {
      toggleBookmark(currentTerm.id);
    }
  };

  // Share - Share term and definition
  const handleShare = async () => {
    if (!currentTerm) return;

    try {
      await Share.share({
        message: `${currentTerm.term}: ${currentTerm.definition}`,
        title: currentTerm.term,
      });
    } catch (error) {
      // Handle error gracefully - only show alert on actual errors, not dismissals
      if (error instanceof Error && error.message !== 'User did not share') {
        Alert.alert('Share Error', 'Unable to share this term. Please try again.');
      }
    }
  };

  // Swipe Left - Navigate to next card (no evaluation)
  const handleSwipeLeft = () => {
    if (currentIndex < terms.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Swipe Right - Navigate to previous card
  const handleSwipeRight = () => {
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

      <View style={styles.contentContainer}>
        <SwipeableCard
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        >
          <MedicalTermCard
            term={currentTerm}
            onPronounce={handlePronounce}
            onFavorite={handleFavorite}
            onBookmark={handleBookmark}
            isFavorited={progress?.isFavorited}
            isBookmarked={progress?.isBookmarked}
            showActions={false} // Hide bottom actions - using ActionButtons instead
          />
        </SwipeableCard>

        <ActionButtons
          onKnowIt={handleKnowIt}
          onDontKnow={handleDontKnow}
          onFavorite={handleFavorite}
          onBookmark={handleBookmark}
          onShare={handleShare}
          isFavorited={progress?.isFavorited || false}
          isBookmarked={progress?.isBookmarked || false}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Swipe ← Next  •  Swipe → Previous
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
    paddingBottom: 20,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative', // For absolute positioning of ActionButtons
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
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
