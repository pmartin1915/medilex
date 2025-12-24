# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Medilex** is a mobile flashcard app for learning medical terminology. Users swipe through cards to learn, favorite terms, and track their learning streak.

**Platforms:** iOS, Android, Web (via Expo)

**Key Tech Stack:**
- React 19 + TypeScript
- Expo SDK 54 (Metro bundler)
- React Navigation 6 (bottom tabs)
- Zustand (state management)
- AsyncStorage (persistence)
- Vitest (unit testing)
- Playwright (E2E testing on web export)

## Essential Commands

### Development
```bash
npm start            # Expo dev server
npm run android      # Run on Android
npm run ios          # Run on iOS
npm run web          # Run in browser
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
```

### Testing
```bash
npm test             # Vitest unit tests (20 tests)
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
npm run test:e2e     # Playwright E2E (48 tests)
npm run test:e2e:ui  # Playwright interactive UI
```

### Build
```bash
npm run build:web    # Export for web (used for E2E testing)
```

## Architecture

```
src/
├── screens/          # Main app screens
│   ├── HomeScreen.tsx      # Welcome + navigation
│   ├── LearnScreen.tsx     # Swipeable flashcards
│   ├── LibraryScreen.tsx   # Term library browser
│   ├── ProgressScreen.tsx  # Learning stats + streak
│   └── DebugScreen.tsx     # Developer diagnostics
├── components/       # Reusable UI components
│   ├── SwipeableCard.tsx   # Gesture-based flashcard
│   ├── MedicalTermCard.tsx # Term display card
│   ├── StreakCalendar.tsx  # Streak visualization
│   └── ErrorBoundary.tsx   # Error handling wrapper
├── store/            # Zustand state management
│   ├── wordStore.ts        # Medical terms + progress
│   └── streakStore.ts      # Learning streak tracking
├── data/             # Static data
│   └── sampleTerms.ts      # Initial medical terms
├── theme/            # Styling constants
├── types/            # TypeScript definitions
└── utils/            # Utility functions
```

## Key Files

| File | Purpose |
|------|---------|
| `App.tsx` | Navigation setup (4-tab bottom navigator) |
| `src/screens/LearnScreen.tsx` | Main learning interface with swipe gestures |
| `src/store/wordStore.ts` | Medical terms state + persistence |
| `src/store/streakStore.ts` | Streak tracking + daily goals |
| `src/data/sampleTerms.ts` | Initial medical terminology data |
| `src/components/SwipeableCard.tsx` | Gesture-based flashcard component |

## Testing Strategy

### Unit Tests (Vitest)
- Store logic tests in `src/store/__tests__/`
- Component tests in `src/components/__tests__/`
- **Current:** 20 tests passing

### E2E Tests (Playwright)
- Tests run against web export (`npm run build:web`)
- Visual regression with platform-specific baselines (`-win32` suffix)
- **Current:** 48 tests passing

```bash
# Run E2E tests
npm run build:web && npm run test:e2e
```

## Data Persistence

### AsyncStorage Keys
```typescript
@vocab_app:terms        // Medical terms + learning status
@vocab_app:user_progress // Overall progress metrics
@vocab_app:streak       // Streak data
```

### Encryption
Uses `@healthcare-apps/core` for sensitive data:
```typescript
import { EncryptedStorage } from '@healthcare-apps/core';
```

**Security:** AES-256-GCM with PBKDF2 (600,000 iterations)

## State Management

### wordStore (Zustand)
```typescript
import { useWordStore } from './store/wordStore';

const { words, currentIndex, markAsLearned, toggleFavorite } = useWordStore();
```

### streakStore (Zustand)
```typescript
import { useStreakStore } from './store/streakStore';

const { currentStreak, recordStudySession, checkStreakStatus } = useStreakStore();
```

## Common Patterns

### Navigation
```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('Learn');
```

### Speech (Pronunciation)
```typescript
import * as Speech from 'expo-speech';

Speech.speak(word.term, { language: 'en-US' });
```

### Swipe Gestures
```typescript
// In LearnScreen
const handleSwipeLeft = () => advanceToNextCard();
const handleSwipeRight = () => markAsLearnedAndAdvance();
```

## Known Limitations

1. **TypeScript stack overflow** - `npx tsc --noEmit` fails but builds work
2. **Component tests limited** - React 19 + testing-library/react-native compatibility issues
3. **Node version warning** - React Native 0.81.5 recommends Node >= 20.19.4 (current 20.18.0 works)

## Development Workflow

1. Start Expo: `npm start`
2. Open on device/emulator (press `a` for Android, `i` for iOS)
3. Make changes (hot reload enabled)
4. Run unit tests: `npm test`
5. For E2E: `npm run build:web && npm run test:e2e`

## Related Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System architecture
- [README.md](README.md) - Project overview
