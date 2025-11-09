import React, { useRef } from 'react';
import { Animated, PanResponder, Dimensions, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const VERTICAL_SWIPE_THRESHOLD = 80; // Increased for more intentional swipes

interface Props {
  children: React.ReactNode;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const SwipeableCard: React.FC<Props> = ({
  children,
  onSwipeUp,
  onSwipeDown,
}) => {
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        // Only allow vertical movement for the rolling effect
        position.setValue({ x: 0, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        // Handle vertical swipes only
        if (gesture.dy < -VERTICAL_SWIPE_THRESHOLD && onSwipeUp) {
          // Trigger haptic feedback for successful swipe
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          // Swipe up - slide card up smoothly (rolling effect)
          Animated.timing(position, {
            toValue: { x: 0, y: -SCREEN_HEIGHT },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            // Change card first, then animate new card in from bottom
            onSwipeUp();
            position.setValue({ x: 0, y: SCREEN_HEIGHT });
            Animated.timing(position, {
              toValue: { x: 0, y: 0 },
              duration: 250,
              useNativeDriver: false,
            }).start();
          });
        } else if (gesture.dy > VERTICAL_SWIPE_THRESHOLD && onSwipeDown) {
          // Trigger haptic feedback for successful swipe
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          // Swipe down - slide card down, then bring previous card from top
          Animated.timing(position, {
            toValue: { x: 0, y: SCREEN_HEIGHT },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            // Change card first, then animate new card in from top
            onSwipeDown();
            position.setValue({ x: 0, y: -SCREEN_HEIGHT });
            Animated.timing(position, {
              toValue: { x: 0, y: 0 },
              duration: 250,
              useNativeDriver: false,
            }).start();
          });
        } else {
          // Snap back with spring animation for smooth rolling feel
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
            { translateY: position.y },
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
    width: SCREEN_WIDTH - 90, // More width for card content, buttons are smaller now
    alignSelf: 'center',
  },
});
