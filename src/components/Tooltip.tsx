import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { theme } from '../theme/theme';

interface Props {
  text: string;
  visible: boolean;
}

export const Tooltip: React.FC<Props> = ({ text, visible }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      // Fade in and scale up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fade out and scale down
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.tooltip,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.tooltipText}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: [{ translateX: -50 }],
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
