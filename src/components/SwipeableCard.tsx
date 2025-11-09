import React, { useRef } from 'react';
import { Animated, PanResponder, Dimensions, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_SWIPE_THRESHOLD = 100; // Horizontal swipes feel better with slightly higher threshold

interface Props {
  children: React.ReactNode;
  onSwipeLeft?: () => void;  // Swipe left → Next card
  onSwipeRight?: () => void; // Swipe right → Previous card
}

export const SwipeableCard: React.FC<Props> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        // Only allow horizontal movement
        position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (_, gesture) => {
        // Handle horizontal swipes only
        if (gesture.dx < -HORIZONTAL_SWIPE_THRESHOLD && onSwipeLeft) {
          // Swipe LEFT → Next card
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          // Slide card left and reset (simple, reliable animation)
          Animated.timing(position, {
            toValue: { x: -SCREEN_WIDTH, y: 0 },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            position.setValue({ x: 0, y: 0 });
            onSwipeLeft();
          });
        } else if (gesture.dx > HORIZONTAL_SWIPE_THRESHOLD && onSwipeRight) {
          // Swipe RIGHT → Previous card
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          // Slide card right and reset (simple, reliable animation)
          Animated.timing(position, {
            toValue: { x: SCREEN_WIDTH, y: 0 },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            position.setValue({ x: 0, y: 0 });
            onSwipeRight();
          });
        } else {
          // Snap back with spring animation
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 7,
            tension: 40,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [
            { translateX: position.x },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 72, // Expanded width: 48px buttons + 12px margin + 12px safety = 72px total
    alignSelf: 'flex-start', // Align to left edge
    marginLeft: 12, // Small left margin
  },
});
