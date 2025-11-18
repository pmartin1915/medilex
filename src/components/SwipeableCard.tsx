import React, { useRef } from 'react';
import { Animated, PanResponder, Dimensions, StyleSheet, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_SWIPE_THRESHOLD = 100; // Horizontal swipes feel better with slightly higher threshold

interface Props {
  children: React.ReactNode;
  onSwipeLeft?: () => void;  // Swipe left → Next card
  onSwipeRight?: () => void; // Swipe right → Previous card
}

const SwipeableCardComponent: React.FC<Props> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const position = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        // Only capture horizontal swipes (when horizontal movement exceeds vertical)
        const isHorizontalSwipe = Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 10;
        return isHorizontalSwipe;
      },
      onPanResponderMove: (_, gesture) => {
        // Only allow horizontal movement
        position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (_, gesture) => {
        // Handle horizontal swipes only
        console.log('[SwipeableCard] Gesture released:', {
          dx: gesture.dx,
          dy: gesture.dy,
          threshold: HORIZONTAL_SWIPE_THRESHOLD,
          hasOnSwipeLeft: !!onSwipeLeft,
          hasOnSwipeRight: !!onSwipeRight,
        });

        if (gesture.dx < -HORIZONTAL_SWIPE_THRESHOLD && onSwipeLeft) {
          // Swipe LEFT → Next card
          console.log('[SwipeableCard] Triggering SWIPE LEFT (Next)');
          // IMPORTANT: Call callback BEFORE animation to ensure state updates immediately
          onSwipeLeft();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          // Slide card left with subtle fade (animation is visual confirmation)
          Animated.parallel([
            Animated.timing(position, {
              toValue: { x: -SCREEN_WIDTH, y: 0 },
              duration: 200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
            Animated.timing(opacity, {
              toValue: 0.96,
              duration: 200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
          ]).start(() => {
            position.setValue({ x: 0, y: 0 });
            opacity.setValue(1);
          });
        } else if (gesture.dx > HORIZONTAL_SWIPE_THRESHOLD && onSwipeRight) {
          // Swipe RIGHT → Previous card
          console.log('[SwipeableCard] Triggering SWIPE RIGHT (Previous)');
          // IMPORTANT: Call callback BEFORE animation to ensure state updates immediately
          onSwipeRight();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          // Slide card right with subtle fade (animation is visual confirmation)
          Animated.parallel([
            Animated.timing(position, {
              toValue: { x: SCREEN_WIDTH, y: 0 },
              duration: 200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
            Animated.timing(opacity, {
              toValue: 0.96,
              duration: 200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
          ]).start(() => {
            position.setValue({ x: 0, y: 0 });
            opacity.setValue(1);
          });
        } else {
          // Snap back with spring animation
          console.log('[SwipeableCard] Gesture below threshold, snapping back');
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
          opacity,
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
    width: SCREEN_WIDTH - 48, // Centered card with equal margins on both sides
    alignSelf: 'center', // Center the card horizontally
    marginHorizontal: 24, // Equal margins on both sides
  },
});

// Memoize to prevent re-renders during parent state changes
export const SwipeableCard = React.memo(SwipeableCardComponent);
