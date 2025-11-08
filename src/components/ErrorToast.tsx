import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { errorLogger, ErrorLog } from '../utils/errorLogger';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TOAST_DURATION = 5000; // 5 seconds

interface ErrorToastProps {
  onPress?: () => void;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ onPress }) => {
  const [visible, setVisible] = useState(false);
  const [currentError, setCurrentError] = useState<ErrorLog | null>(null);
  const [slideAnim] = useState(new Animated.Value(-100));
  const [lastErrorId, setLastErrorId] = useState<string | null>(null);

  useEffect(() => {
    // Only show toasts in development mode
    if (__DEV__) {
      const interval = setInterval(() => {
        const logs = errorLogger.getLogs();
        const errors = logs.filter(log => log.type === 'error');

        if (errors.length > 0 && errors[0].id !== lastErrorId) {
          setCurrentError(errors[0]);
          setLastErrorId(errors[0].id);
          showToast();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lastErrorId]);

  const showToast = () => {
    setVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();

    // Auto-hide after duration
    setTimeout(() => {
      hideToast();
    }, TOAST_DURATION);
  };

  const hideToast = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  const handlePress = () => {
    hideToast();
    onPress?.();
  };

  if (!visible || !currentError) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.toast}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.iconContainer}>
          <AlertCircle size={24} color={theme.colors.error} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Error Occurred</Text>
          <Text style={styles.message} numberOfLines={2}>
            {currentError.message}
          </Text>
          <Text style={styles.hint}>Tap to view in Debug tab</Text>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={hideToast}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.error,
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    lineHeight: 18,
    marginBottom: 4,
  },
  hint: {
    fontSize: 11,
    color: theme.colors.accent,
    fontStyle: 'italic',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
