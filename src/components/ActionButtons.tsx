import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ThumbsUp, X, Heart, Bookmark, Share2 } from 'lucide-react-native';
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
  return (
    <View style={styles.container}>
      {/* Know It - Green */}
      <TouchableOpacity
        style={[styles.button, styles.knowItButton]}
        onPress={onKnowIt}
        activeOpacity={0.7}
        accessibilityLabel="Know It"
        accessibilityRole="button"
      >
        <ThumbsUp size={28} color="#FFFFFF" fill="#FFFFFF" />
      </TouchableOpacity>

      {/* Don't Know - Red */}
      <TouchableOpacity
        style={[styles.button, styles.dontKnowButton]}
        onPress={onDontKnow}
        activeOpacity={0.7}
        accessibilityLabel="Don't Know"
        accessibilityRole="button"
      >
        <X size={28} color="#FFFFFF" strokeWidth={3} />
      </TouchableOpacity>

      {/* Favorite - Pink/Red */}
      <TouchableOpacity
        style={[styles.button, styles.favoriteButton]}
        onPress={onFavorite}
        activeOpacity={0.7}
        accessibilityLabel={isFavorited ? "Remove from favorites" : "Add to favorites"}
        accessibilityRole="button"
      >
        <Heart
          size={28}
          color="#FFFFFF"
          fill={isFavorited ? "#FFFFFF" : "none"}
          strokeWidth={isFavorited ? 0 : 2}
        />
      </TouchableOpacity>

      {/* Bookmark - Amber */}
      <TouchableOpacity
        style={[styles.button, styles.bookmarkButton]}
        onPress={onBookmark}
        activeOpacity={0.7}
        accessibilityLabel={isBookmarked ? "Remove bookmark" : "Bookmark"}
        accessibilityRole="button"
      >
        <Bookmark
          size={28}
          color="#FFFFFF"
          fill={isBookmarked ? "#FFFFFF" : "none"}
          strokeWidth={isBookmarked ? 0 : 2}
        />
      </TouchableOpacity>

      {/* Share - Teal */}
      <TouchableOpacity
        style={[styles.button, styles.shareButton]}
        onPress={onShare}
        activeOpacity={0.7}
        accessibilityLabel="Share"
        accessibilityRole="button"
      >
        <Share2 size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -140 }], // Center vertically (5 buttons * 56px + 4 gaps * 16px = 280px / 2)
    zIndex: 10,
    gap: 16,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
