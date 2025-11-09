import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ThumbsUp, X, Heart, Bookmark, Share2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme/theme';

interface Props {
  onKnowIt: () => void;
  onDontKnow: () => void;
  onFavorite: () => void;
  onBookmark: () => void;
  onShare: () => void;
  isFavorited: boolean;
  isBookmarked: boolean;
}

export const ActionButtons: React.FC<Props> = ({
  onKnowIt,
  onDontKnow,
  onFavorite,
  onBookmark,
  onShare,
  isFavorited,
  isBookmarked,
}) => {
  // Wrapper functions to add haptic feedback
  const handleKnowIt = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onKnowIt();
  };

  const handleDontKnow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDontKnow();
  };

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onFavorite();
  };

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBookmark();
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onShare();
  };

  return (
    <View style={styles.container}>
      {/* Know It - Green */}
      <TouchableOpacity
        style={[styles.button, styles.knowItButton]}
        onPress={handleKnowIt}
        activeOpacity={0.7}
        accessibilityLabel="Know It"
        accessibilityRole="button"
      >
        <ThumbsUp size={24} color="#FFFFFF" fill="#FFFFFF" />
      </TouchableOpacity>

      {/* Don't Know - Red */}
      <TouchableOpacity
        style={[styles.button, styles.dontKnowButton]}
        onPress={handleDontKnow}
        activeOpacity={0.7}
        accessibilityLabel="Don't Know"
        accessibilityRole="button"
      >
        <X size={24} color="#FFFFFF" strokeWidth={3} />
      </TouchableOpacity>

      {/* Favorite - Pink/Red */}
      <TouchableOpacity
        style={[styles.button, styles.favoriteButton]}
        onPress={handleFavorite}
        activeOpacity={0.7}
        accessibilityLabel={isFavorited ? "Remove from favorites" : "Add to favorites"}
        accessibilityRole="button"
      >
        <Heart
          size={24}
          color="#FFFFFF"
          fill={isFavorited ? "#FFFFFF" : "none"}
          strokeWidth={isFavorited ? 0 : 2}
        />
      </TouchableOpacity>

      {/* Bookmark - Amber */}
      <TouchableOpacity
        style={[styles.button, styles.bookmarkButton]}
        onPress={handleBookmark}
        activeOpacity={0.7}
        accessibilityLabel={isBookmarked ? "Remove bookmark" : "Bookmark"}
        accessibilityRole="button"
      >
        <Bookmark
          size={24}
          color="#FFFFFF"
          fill={isBookmarked ? "#FFFFFF" : "none"}
          strokeWidth={isBookmarked ? 0 : 2}
        />
      </TouchableOpacity>

      {/* Share - Teal */}
      <TouchableOpacity
        style={[styles.button, styles.shareButton]}
        onPress={handleShare}
        activeOpacity={0.7}
        accessibilityLabel="Share"
        accessibilityRole="button"
      >
        <Share2 size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -120 }], // Center vertically (5 buttons * 48px + 4 gaps * 12px = 240 + 48 = 288px / 2 = 144, rounded to 120 for better centering)
    zIndex: 10,
    gap: 12,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.card,
  },
  knowItButton: {
    backgroundColor: theme.colors.success,
  },
  dontKnowButton: {
    backgroundColor: theme.colors.error,
  },
  favoriteButton: {
    backgroundColor: theme.colors.favorite,
  },
  bookmarkButton: {
    backgroundColor: theme.colors.bookmark,
  },
  shareButton: {
    backgroundColor: theme.colors.info,
  },
});
