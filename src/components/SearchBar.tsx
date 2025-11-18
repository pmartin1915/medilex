import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { theme } from '../theme/theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBarComponent: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder = 'Search medical terms...',
}) => {
  return (
    <View style={styles.container}>
      <Search size={20} color={theme.colors.textTertiary} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textTertiary}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textPrimary,
    paddingVertical: 16,
  },
});

// Memoize to avoid re-rendering on every keystroke when parent state changes
export const SearchBar = React.memo(SearchBarComponent);
