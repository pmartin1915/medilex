import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { captureRef } from 'react-native-view-shot';
import { theme } from '../theme/theme';
import { useWordStore } from '../store/wordStore';
import { useStreakStore } from '../store/streakStore';
import { SwipeableCard } from '../components/SwipeableCard';
import { MedicalTermCard } from '../components/MedicalTermCard';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { SuccessToast } from '../components/SuccessToast';
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
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Use ref to track current index to avoid stale closures
  const currentIndexRef = useRef(currentIndex);

  // Ref for capturing card screenshot
  const cardRef = useRef<any>(null);

  // Keep ref in sync with state
  useEffect(() => {
    currentIndexRef.current = currentIndex;
    console.log('[LearnScreen] currentIndex state updated to:', currentIndex);
  }, [currentIndex]);

  const currentTerm = terms[currentIndex];
  const progress = currentTerm ? getProgress(currentTerm.id) : undefined;

  // Know It - Mark as known and advance
  const handleKnowIt = () => {
    if (currentTerm) {
      updateProgress(currentTerm.id, true);
      setToastMessage('Marked as known');
      setShowToast(true);
      nextCard();
    }
  };

  // Don't Know - Mark as unknown and advance
  const handleDontKnow = () => {
    if (currentTerm) {
      updateProgress(currentTerm.id, false);
      setToastMessage('Keep practicing');
      setShowToast(true);
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
      const isCurrentlyBookmarked = progress?.isBookmarked;
      toggleBookmark(currentTerm.id);
      setToastMessage(isCurrentlyBookmarked ? 'Bookmark removed' : 'Bookmarked');
      setShowToast(true);
    }
  };

  // Share - Capture screenshot and share
  const handleShare = async () => {
    if (!currentTerm) {
      Alert.alert('Error', 'No term available to share.');
      return;
    }

    try {
      // Try screenshot share first (if cardRef is available)
      if (cardRef.current) {
        try {
          const uri = await captureRef(cardRef, {
            format: 'png',
            quality: 1,
          });

          await Share.share({
            url: uri,
            message: `Check out this medical term: ${currentTerm.term}`,
            title: currentTerm.term,
          });
          return; // Success, exit early
        } catch (screenshotError) {
          console.log('Screenshot share failed, falling back to text:', screenshotError);
          // Continue to text fallback
        }
      }

      // Fallback to text sharing
      await Share.share({
        message: `${currentTerm.term}\n\n${currentTerm.definition}\n\nShared from Medilex Healthcare Vocabulary App`,
        title: currentTerm.term,
      });
      setToastMessage('Shared successfully');
      setShowToast(true);
    } catch (error: any) {
      // Only show alert for actual errors (not user cancellation)
      if (error?.message && !error.message.includes('User did not share') && !error.message.includes('cancelled')) {
        console.error('Share error:', error);
        Alert.alert(
          'Share Error',
          'Unable to share this term. Please try again or check your device settings.'
        );
      }
    }
  };

  // Swipe Left - Navigate to next card (no evaluation)
  const handleSwipeLeft = () => {
    const current = currentIndexRef.current;
    console.log('[LearnScreen] handleSwipeLeft called, currentIndexRef.current:', current, 'termsLength:', terms.length);
    if (current < terms.length - 1) {
      console.log('[LearnScreen] Moving to NEXT card:', current + 1);
      setCurrentIndex(prev => {
        console.log('[LearnScreen] setCurrentIndex prev value:', prev, 'new value:', prev + 1);
        return prev + 1;
      });
    } else {
      console.log('[LearnScreen] Already at last card, not moving');
    }
  };

  // Swipe Right - Navigate to previous card
  const handleSwipeRight = () => {
    const current = currentIndexRef.current;
    console.log('[LearnScreen] handleSwipeRight called, currentIndexRef.current:', current);
    if (current > 0) {
      console.log('[LearnScreen] Moving to PREVIOUS card:', current - 1);
      setCurrentIndex(prev => {
        console.log('[LearnScreen] setCurrentIndex prev value:', prev, 'new value:', prev - 1);
        return prev - 1;
      });
    } else {
      console.log('[LearnScreen] Already at first card, not moving');
    }
  };

  // Navigation buttons (backup for gestures)
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < terms.length - 1) {
      setCurrentIndex(prev => prev + 1);
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

  const handlePronounce = async () => {
    if (!currentTerm) return;
    
    try {
      // Check if speech is available
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      }
      
      await Speech.speak(currentTerm.term, { 
        rate: 0.75,
        onError: (error) => {
          console.error('Speech error:', error);
          Alert.alert(
            'Speech Unavailable',
            'Text-to-speech is not available on this device.'
          );
        }
      });
    } catch (error: any) {
      console.error('Speech synthesis error:', error);
      Alert.alert(
        'Speech Error',
        'Unable to pronounce this term. Please try again.'
      );
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
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Terms Available</Text>
        <Text style={styles.emptyMessage}>
          It looks like no medical terms have been loaded.
        </Text>
        <TouchableOpacity
          style={styles.reloadButton}
          onPress={() => {
            const loadTerms = useWordStore.getState().loadTerms;
            loadTerms();
          }}
        >
          <Text style={styles.reloadButtonText}>Reload Terms</Text>
        </TouchableOpacity>
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
        {/* Left Navigation Arrow */}
        <TouchableOpacity
          style={[styles.navArrow, styles.navArrowLeft]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          activeOpacity={0.7}
        >
          <ChevronLeft
            size={24}
            color={currentIndex === 0 ? theme.colors.border : theme.colors.accent}
            strokeWidth={2.5}
          />
        </TouchableOpacity>

        <SwipeableCard
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        >
          <View ref={cardRef} collapsable={false}>
            <MedicalTermCard
              term={currentTerm}
              onPronounce={handlePronounce}
              onKnowIt={handleKnowIt}
              onDontKnow={handleDontKnow}
              onBookmark={handleBookmark}
              onShare={handleShare}
              isBookmarked={progress?.isBookmarked}
              showActions={true} // Show integrated action buttons at bottom
            />
          </View>
        </SwipeableCard>

        {/* Right Navigation Arrow */}
        <TouchableOpacity
          style={[styles.navArrow, styles.navArrowRight]}
          onPress={handleNext}
          disabled={currentIndex === terms.length - 1}
          activeOpacity={0.7}
        >
          <ChevronRight
            size={24}
            color={currentIndex === terms.length - 1 ? theme.colors.border : theme.colors.accent}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
      </View>

      <SuccessToast
        message={toastMessage}
        visible={showToast}
        duration={2000}
        onHide={() => setShowToast(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 56,
    paddingBottom: 16,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  navArrow: {
    padding: 10,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    zIndex: 10,
  },
  navArrowLeft: {
    position: 'absolute',
    left: 8,
    top: '50%',
    transform: [{ translateY: -24 }],
  },
  navArrowRight: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -24 }],
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
  emptyContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  reloadButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 9999,
  },
  reloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
