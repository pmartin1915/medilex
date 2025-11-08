import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface Props {
  current: number;
  total: number;
}

export const ProgressIndicator: React.FC<Props> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {current} / {total}
      </Text>
      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: theme.spacing.md,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  barContainer: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.sm,
  },
});
