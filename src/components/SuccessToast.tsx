import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../theme/theme';
import { Check } from 'lucide-react-native';

interface SuccessToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  onHide?: () => void;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({
  message,
  visible,
  duration = 2000,
  onHide,
}) => {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          onHide?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide, opacity]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Check size={18} color="#FFFFFF" strokeWidth={3} />
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
