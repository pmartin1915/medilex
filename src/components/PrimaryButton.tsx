import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const PrimaryButton: React.FC<Props> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: theme.borderRadius.full,
    marginHorizontal: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.textTertiary,
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
