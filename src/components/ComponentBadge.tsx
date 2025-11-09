import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface ComponentBadgeProps {
  component: string;
  meaning: string;
  type: 'prefix' | 'root' | 'suffix';
  size?: 'small' | 'medium' | 'large';
}

export const ComponentBadge: React.FC<ComponentBadgeProps> = ({
  component,
  meaning,
  type,
  size = 'medium',
}) => {
  // Color scheme based on component type
  const colors = {
    prefix: {
      bg: '#E3F2FD',      // Light blue
      border: '#2196F3',  // Blue
      text: '#1565C0',    // Dark blue
    },
    root: {
      bg: '#F3E5F5',      // Light purple
      border: '#9C27B0',  // Purple
      text: '#6A1B9A',    // Dark purple
    },
    suffix: {
      bg: '#E8F5E9',      // Light green
      border: '#4CAF50',  // Green
      text: '#2E7D32',    // Dark green
    },
  };

  const sizeStyles = {
    small: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      componentFontSize: 12,
      meaningFontSize: 10,
    },
    medium: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      componentFontSize: 14,
      meaningFontSize: 11,
    },
    large: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      componentFontSize: 16,
      meaningFontSize: 12,
    },
  };

  const colorScheme = colors[type];
  const sizing = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colorScheme.bg,
          borderColor: colorScheme.border,
          paddingHorizontal: sizing.paddingHorizontal,
          paddingVertical: sizing.paddingVertical,
        },
      ]}
    >
      <Text
        style={[
          styles.component,
          {
            color: colorScheme.text,
            fontSize: sizing.componentFontSize,
          },
        ]}
      >
        {component}
      </Text>
      <Text
        style={[
          styles.meaning,
          {
            color: colorScheme.text,
            fontSize: sizing.meaningFontSize,
          },
        ]}
      >
        {meaning}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    gap: 6,
  },
  component: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  meaning: {
    fontWeight: '500',
    opacity: 0.9,
  },
});
