export const theme = {
  colors: {
    // Warm, calm backgrounds
    background: '#FAF7F1', // warm cream
    cardBackground: '#FFFFFF', // white card surface

    // Text hierarchy
    textPrimary: '#2B2B2B', // dark charcoal
    textSecondary: '#6A6A6A',
    textTertiary: '#9B9B9B',

    // Muted blue accent (used sparingly for Clinical Example, Show More, icons)
    accent: '#5B8FA3', // muted desaturated blue
    accentLight: '#7BA5B8',
    accentDark: '#4A7383',

    // Legacy colors maintained for other features
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

    // Subtle progress bar
    progressBackground: '#E8E2D5',
    progressFill: '#C5BFB0',
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
    // Display term - large serif (adjusted for longer medical terms)
    termDisplay: {
      fontSize: 40,
      fontWeight: '600' as const,
      lineHeight: 48,
      fontFamily: 'serif',
    },
    // Pronunciation
    pronunciation: {
      fontSize: 18,
      fontWeight: '400' as const,
      lineHeight: 26,
    },
    // Labels (Definition, Clinical Example, etc.)
    label: {
      fontSize: 12,
      fontWeight: '600' as const,
      letterSpacing: 1,
      textTransform: 'uppercase' as const,
    },
    // Definition text
    definition: {
      fontSize: 18,
      fontWeight: '400' as const,
      lineHeight: 28,
    },
    // Example text
    example: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    // Body text
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
    // Very subtle shadow - just enough to lift the card
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
  },
};

export type Theme = typeof theme;
