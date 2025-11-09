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
    paddingHorizontal: theme.spacing.lg,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  barContainer: {
    height: 3,
    backgroundColor: theme.colors.progressBackground,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: theme.colors.progressFill,
    borderRadius: theme.borderRadius.full,
  },
});
