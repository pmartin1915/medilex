export const theme = {
  colors: {
    background: '#FAF7F1',
    cardBackground: '#FFFFFF',
    textPrimary: '#2B2B2B',
    textSecondary: '#6A6A6A',
    textTertiary: '#9B9B9B',
    accent: '#7BAAA5',
    accentLight: '#A5C9C4',
    accentDark: '#5B8A86',
    clinical: '#5B8FA3',
    border: '#F5EFE3',
    divider: '#E8E2D5',
    success: '#8FAC8E',
    warning: '#E8B66B',
    error: '#D17B6F',
    info: '#7BAAA5',
    favorite: '#D17B6F',
    bookmark: '#E8B66B',
    streakFire: '#E8704D',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },
  typography: {
    wordLarge: {
      fontSize: 36,
      fontWeight: '400' as const,
      lineHeight: 44,
    },
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400' as const,
      lineHeight: 28,
    },
    bodyMedium: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    card: {
      shadowColor: '#7BAAA5',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
  },
};

export type Theme = typeof theme;
