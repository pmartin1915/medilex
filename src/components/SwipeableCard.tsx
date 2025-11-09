import React, { useRef } from 'react';
import { Animated, PanResponder, Dimensions, StyleSheet } from 'react-native';

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
          // Swipe up - slide card up smoothly (rolling effect)
          Animated.timing(position, {
            toValue: { x: 0, y: -SCREEN_HEIGHT },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            position.setValue({ x: 0, y: 0 });
            onSwipeUp();
          });
        } else if (gesture.dy > VERTICAL_SWIPE_THRESHOLD && onSwipeDown) {
          // Swipe down - slide card down smoothly (rolling effect)
          Animated.timing(position, {
            toValue: { x: 0, y: SCREEN_HEIGHT },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            position.setValue({ x: 0, y: 0 });
            onSwipeDown();
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
