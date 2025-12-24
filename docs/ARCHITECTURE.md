# Medilex Architecture

## Overview

Medilex is a mobile flashcard application for learning medical terminology. Built with React Native and Expo, it features swipe-based learning, progress tracking, and streak gamification.

## Architecture Layers

### 1. Navigation Layer (`App.tsx`)

React Navigation 6 with a 4-tab bottom navigator:

```
BottomTabNavigator
├── HomeScreen       # Welcome + quick actions
├── LearnScreen      # Swipeable flashcards
├── LibraryScreen    # Term library browser
└── ProgressScreen   # Stats + streak calendar
```

### 2. Screen Layer (`/src/screens/`)

Self-contained screen components handling their own state and data:

| Screen | Purpose |
|--------|---------|
| `HomeScreen.tsx` | Entry point, daily goals, navigation |
| `LearnScreen.tsx` | Core learning with swipe gestures |
| `LibraryScreen.tsx` | Browse/search all terms |
| `ProgressScreen.tsx` | Learning stats, streak visualization |
| `DebugScreen.tsx` | Developer diagnostics |

### 3. Component Layer (`/src/components/`)

Reusable UI components:

- `SwipeableCard.tsx` - Gesture-based flashcard with left/right swipe
- `MedicalTermCard.tsx` - Term display with pronunciation button
- `StreakCalendar.tsx` - Visual streak tracker
- `ErrorBoundary.tsx` - Error handling wrapper
- `AnimatedProgress.tsx` - Progress indicators

### 4. State Management (`/src/store/`)

Zustand stores with AsyncStorage persistence:

**wordStore.ts:**
```typescript
{
  words: MedicalTerm[],      // All medical terms
  currentIndex: number,       // Current card position
  learnedWords: string[],    // IDs of learned terms
  favoriteWords: string[],   // IDs of favorited terms
  markAsLearned: (id) => void,
  toggleFavorite: (id) => void
}
```

**streakStore.ts:**
```typescript
{
  currentStreak: number,
  longestStreak: number,
  studySessions: Date[],
  recordStudySession: () => void,
  checkStreakStatus: () => void
}
```

### 5. Data Layer (`/src/data/`)

- `sampleTerms.ts` - Initial medical terminology (expandable)

## Data Flow

```
User Swipe Gesture
       ↓
SwipeableCard (onSwipeLeft/onSwipeRight)
       ↓
LearnScreen Handler
       ↓
wordStore.markAsLearned() / wordStore.nextCard()
       ↓
Zustand State Update
       ↓
AsyncStorage Persist
       ↓
UI Re-render
```

## Offline-First Design

### Local-Only Architecture
- All data stored in AsyncStorage
- No network dependencies for core functionality
- Works completely offline

### AsyncStorage Keys
```
@vocab_app:terms          # Medical terms + status
@vocab_app:user_progress  # Overall progress
@vocab_app:streak         # Streak data
```

### Encrypted Storage
Sensitive data uses `@healthcare-apps/core`:
```typescript
import { EncryptedStorage } from '@healthcare-apps/core';
const storage = new EncryptedStorage('medilex-key');
```

**Security:** AES-256-GCM with PBKDF2 (600,000 iterations)

## Testing Strategy

### Unit Tests (Vitest)
- **20 tests passing**
- Store logic: `src/store/__tests__/`
- Utilities: `src/utils/__tests__/`

### E2E Tests (Playwright)
- **48 tests passing**
- Tests run against web export
- Visual regression with platform-specific baselines

**E2E Workflow:**
```bash
npm run build:web    # Export to web
npm run test:e2e     # Run Playwright
```

### Test Limitations
- Component tests limited due to React 19 + testing-library compatibility
- E2E tests provide full component coverage

## Platform Considerations

### Expo SDK 52
- Metro bundler (not Vite)
- Managed workflow
- OTA updates supported

### Platform-Specific Code
```typescript
// Use .ios.ts / .android.ts when needed
import { Platform } from 'react-native';

if (Platform.OS === 'ios') { ... }
if (Platform.OS === 'android') { ... }
```

### Speech Synthesis
```typescript
import * as Speech from 'expo-speech';

Speech.speak(term, { language: 'en-US', rate: 0.8 });
```

## Build Pipeline

### Development
```bash
npm start        # Expo dev server
npm run android  # Android emulator/device
npm run ios      # iOS simulator/device
npm run web      # Browser
```

### Production
```bash
npm run build:web  # Web export for E2E/hosting
# Mobile builds via EAS Build (Expo Application Services)
```

## Performance Considerations

### Gesture Handling
- `react-native-gesture-handler` for smooth swipes
- Native driver animations where possible

### Image Optimization
- SVG icons via `lucide-react-native`
- No heavy image assets

### Bundle Size
- Tree-shaking via Metro
- Lazy loading of screens

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - AI assistant guidance
- [README.md](../README.md) - Project overview
