import React, { useRef, useEffect } from 'react';
import { Animated, PanResponder, Dimensions, StyleSheet, View, Text, Platform } from 'react-native';
import { errorLogger } from '../utils/errorLogger';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD_X = SCREEN_WIDTH * 0.25;
const SWIPE_THRESHOLD_Y = SCREEN_HEIGHT * 0.15;

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
  const opacity = useRef(new Animated.Value(1)).current;

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const leftIndicatorOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD_X, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const rightIndicatorOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD_X],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const upIndicatorOpacity = position.y.interpolate({
    inputRange: [-SWIPE_THRESHOLD_Y, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const downIndicatorOpacity = position.y.interpolate({
    inputRange: [0, SWIPE_THRESHOLD_Y],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (event: KeyboardEvent) => {
        try {
          switch (event.key) {
            case 'ArrowLeft':
              event.preventDefault();
              errorLogger.logInfo('ArrowLeft key pressed', 'SwipeableCard.handleKeyDown');
              onSwipeLeft();
              break;
            case 'ArrowRight':
              event.preventDefault();
              errorLogger.logInfo('ArrowRight key pressed', 'SwipeableCard.handleKeyDown');
              onSwipeRight();
              break;
            case 'ArrowUp':
              event.preventDefault();
              if (onSwipeUp) {
                errorLogger.logInfo('ArrowUp key pressed', 'SwipeableCard.handleKeyDown');
                onSwipeUp();
              }
              break;
            case 'ArrowDown':
              event.preventDefault();
              if (onSwipeDown) {
                errorLogger.logInfo('ArrowDown key pressed', 'SwipeableCard.handleKeyDown');
                onSwipeDown();
              }
              break;
          }
        } catch (error) {
          errorLogger.logError('error', `Keyboard event handler failed: ${error}`, undefined, undefined, 'SwipeableCard.handleKeyDown');
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      errorLogger.logInfo('Keyboard event listener attached', 'SwipeableCard.useEffect');

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        errorLogger.logInfo('Keyboard event listener removed', 'SwipeableCard.useEffect');
      };
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        try {
          const absX = Math.abs(gesture.dx);
          const absY = Math.abs(gesture.dy);

          // Determine if swipe is primarily horizontal or vertical
          if (absX > absY) {
            // Horizontal swipe
            if (gesture.dx > SWIPE_THRESHOLD_X) {
              errorLogger.logInfo('Swipe right detected', 'SwipeableCard.panResponder');
              Animated.parallel([
                Animated.timing(position, {
                  toValue: { x: SCREEN_WIDTH + 100, y: 0 },
                  duration: 250,
                  useNativeDriver: false,
                }),
                Animated.timing(opacity, {
                  toValue: 0,
                  duration: 250,
                  useNativeDriver: false,
                }),
              ]).start(() => {
                position.setValue({ x: 0, y: 0 });
                opacity.setValue(1);
                onSwipeRight();
              });
            } else if (gesture.dx < -SWIPE_THRESHOLD_X) {
              errorLogger.logInfo('Swipe left detected', 'SwipeableCard.panResponder');
              Animated.parallel([
                Animated.timing(position, {
                  toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
                  duration: 250,
                  useNativeDriver: false,
                }),
                Animated.timing(opacity, {
                  toValue: 0,
                  duration: 250,
                  useNativeDriver: false,
                }),
              ]).start(() => {
                position.setValue({ x: 0, y: 0 });
                opacity.setValue(1);
                onSwipeLeft();
              });
            } else {
              Animated.spring(position, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false,
              }).start();
            }
          } else {
            // Vertical swipe
            if (gesture.dy < -SWIPE_THRESHOLD_Y && onSwipeUp) {
              errorLogger.logInfo('Swipe up detected', 'SwipeableCard.panResponder');
              Animated.parallel([
                Animated.timing(position, {
                  toValue: { x: 0, y: -SCREEN_HEIGHT - 100 },
                  duration: 250,
                  useNativeDriver: false,
                }),
                Animated.timing(opacity, {
                  toValue: 0,
                  duration: 250,
                  useNativeDriver: false,
                }),
              ]).start(() => {
                position.setValue({ x: 0, y: 0 });
                opacity.setValue(1);
                onSwipeUp();
              });
            } else if (gesture.dy > SWIPE_THRESHOLD_Y && onSwipeDown) {
              errorLogger.logInfo('Swipe down detected', 'SwipeableCard.panResponder');
              Animated.parallel([
                Animated.timing(position, {
                  toValue: { x: 0, y: SCREEN_HEIGHT + 100 },
                  duration: 250,
                  useNativeDriver: false,
                }),
                Animated.timing(opacity, {
                  toValue: 0,
                  duration: 250,
                  useNativeDriver: false,
                }),
              ]).start(() => {
                position.setValue({ x: 0, y: 0 });
                opacity.setValue(1);
                onSwipeDown();
              });
            } else {
              Animated.spring(position, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false,
              }).start();
            }
          }
        } catch (error) {
          errorLogger.logError('error', `Swipe gesture handler failed: ${error}`, undefined, undefined, 'SwipeableCard.panResponder');
          // Reset position on error
          position.setValue({ x: 0, y: 0 });
          opacity.setValue(1);
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            opacity,
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

      <Animated.View style={[styles.indicator, styles.leftIndicator, { opacity: leftIndicatorOpacity }]}>
        <Text style={styles.indicatorText}>Don't Know</Text>
      </Animated.View>

      <Animated.View style={[styles.indicator, styles.rightIndicator, { opacity: rightIndicatorOpacity }]}>
        <Text style={styles.indicatorText}>Know It</Text>
      </Animated.View>

      {onSwipeUp && (
        <Animated.View style={[styles.indicator, styles.upIndicator, { opacity: upIndicatorOpacity }]}>
          <Text style={styles.indicatorText}>Next</Text>
        </Animated.View>
      )}

      {onSwipeDown && (
        <Animated.View style={[styles.indicator, styles.downIndicator, { opacity: downIndicatorOpacity }]}>
          <Text style={styles.indicatorText}>Previous</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  card: {
    width: SCREEN_WIDTH - 40,
    alignSelf: 'center',
  },
  indicator: {
    position: 'absolute',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  leftIndicator: {
    left: 40,
    top: '50%',
    transform: [{ translateY: -20 }],
  },
  rightIndicator: {
    right: 40,
    top: '50%',
    transform: [{ translateY: -20 }],
  },
  upIndicator: {
    top: 80,
    left: '50%',
    transform: [{ translateX: -40 }],
  },
  downIndicator: {
    bottom: 80,
    left: '50%',
    transform: [{ translateX: -40 }],
  },
  indicatorText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
