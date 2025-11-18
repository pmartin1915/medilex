import React, { useRef } from 'react';
import { Animated, PanResponder, Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface Props {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const SwipeableCardComponent: React.FC<Props> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
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
        position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (_, gesture) => {
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

// Memoize to prevent re-renders during parent state changes
export const SwipeableCard = React.memo(SwipeableCardComponent);

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 40,
    alignSelf: 'center',
  },
});
