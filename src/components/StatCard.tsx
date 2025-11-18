import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { theme } from '../theme/theme';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color: string;
  trend?: string; // e.g., "+5% this week"
}

const StatCardComponent: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  color,
  trend
}) => {
  return (
    <View style={styles.card}>
      <Icon size={28} color={color} strokeWidth={2} />
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {trend && <Text style={styles.trend}>{trend}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  trend: {
    fontSize: 10,
    color: theme.colors.success,
    marginTop: 4,
    fontWeight: '600',
  },
});

// Memoize to prevent re-renders when displaying multiple stat cards
export const StatCard = React.memo(StatCardComponent);
