import React, { useRef } from 'react';
import { Animated, PanResponder, Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const VERTICAL_SWIPE_THRESHOLD = 50;

interface Props {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const SwipeableCard: React.FC<Props> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}) => {
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        // Determine if swipe is more horizontal or vertical
        const isHorizontalSwipe = Math.abs(gesture.dx) > Math.abs(gesture.dy);

        if (isHorizontalSwipe) {
          // Handle horizontal swipes (with evaluation)
          if (gesture.dx > SWIPE_THRESHOLD) {
            Animated.timing(position, {
              toValue: { x: SCREEN_WIDTH + 100, y: 0 },
              duration: 250,
              useNativeDriver: false,
            }).start(() => {
              position.setValue({ x: 0, y: 0 });
              onSwipeRight();
            });
          } else if (gesture.dx < -SWIPE_THRESHOLD) {
            Animated.timing(position, {
              toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
              duration: 250,
              useNativeDriver: false,
            }).start(() => {
              position.setValue({ x: 0, y: 0 });
              onSwipeLeft();
            });
          } else {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            }).start();
          }
        } else {
          // Handle vertical swipes (navigation only, no evaluation)
          if (gesture.dy < -VERTICAL_SWIPE_THRESHOLD && onSwipeUp) {
            Animated.timing(position, {
              toValue: { x: 0, y: -SCREEN_HEIGHT },
              duration: 250,
              useNativeDriver: false,
            }).start(() => {
              position.setValue({ x: 0, y: 0 });
              onSwipeUp();
            });
          } else if (gesture.dy > VERTICAL_SWIPE_THRESHOLD && onSwipeDown) {
            Animated.timing(position, {
              toValue: { x: 0, y: SCREEN_HEIGHT },
              duration: 250,
              useNativeDriver: false,
            }).start(() => {
              position.setValue({ x: 0, y: 0 });
              onSwipeDown();
            });
          } else {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            }).start();
          }
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
            { translateY: position.y },
            { rotate },
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
    width: SCREEN_WIDTH - 40,
    alignSelf: 'center',
  },
});
