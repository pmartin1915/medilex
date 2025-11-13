# 🛠️ Development Guide

Complete guide for developing the Healthcare Vocab App.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Initial Setup
```bash
# Clone and install
git clone <repository>
cd HealthcareVocabApp
npm install

# Start development
.\LAUNCH.bat
```

---

## 📁 Project Structure

### Source Code (`src/`)
```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.tsx       # Global error catcher
│   ├── ErrorToast.tsx          # Error notifications
│   ├── MedicalTermCard.tsx     # Term display card
│   ├── SwipeableCard.tsx       # Swipe gesture handler
│   ├── StreakCalendar.tsx      # 7-day streak display
│   ├── PrimaryButton.tsx       # Styled button
│   ├── ProgressIndicator.tsx   # Progress bar
│   └── SearchBar.tsx           # Search input
├── screens/             # Main app screens
│   ├── HomeScreen.tsx          # Dashboard & streak
│   ├── LearnScreen.tsx         # Flashcard study
│   ├── LibraryScreen.tsx       # Browse all terms
│   ├── ProgressScreen.tsx      # Analytics & stats
│   └── DebugScreen.tsx         # Error logs & diagnostics
├── store/               # Zustand state management
│   ├── wordStore.ts            # Terms & progress
│   └── streakStore.ts          # Streak tracking
├── utils/               # Utilities
│   ├── errorLogger.ts          # Error logging system
│   └── dataValidator.ts        # Data validation
├── data/                # Data files
│   └── sampleTerms.ts          # 75 medical terms
├── theme/               # Design system
│   └── theme.ts                # Colors, spacing, typography
└── types/               # TypeScript types
    └── index.ts                # Shared interfaces
```

### Configuration Files
- `app.json` - Expo configuration
- `app.config.js` - Dynamic Expo config
- `tsconfig.json` - TypeScript configuration
- `jest.config.js` - Jest testing configuration
- `babel.config.js` - Babel transpiler config
- `metro.config.js` - Metro bundler config

---

## 🔄 Development Workflow

### Daily Development
```bash
# 1. Start the app
.\LAUNCH.bat

# 2. Make changes in src/

# 3. Hot reload happens automatically

# 4. Test your changes
npm test

# 5. Commit
git add .
git commit -m "feat: add new feature"
git push
```

### Branch Strategy
```bash
# Create feature branch
git checkout -b feature/new-feature

# Work on feature
# ... make changes ...

# Test thoroughly
npm test
npm run type-check

# Commit and push
git commit -m "feat: implement new feature"
git push origin feature/new-feature

# Create pull request
```

---

## 🎨 Adding New Features

### 1. Adding a New Screen
```typescript
// src/screens/NewScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export function NewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.text,
  },
});
```

### 2. Adding a New Component
```typescript
// src/components/NewComponent.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface NewComponentProps {
  title: string;
  onPress?: () => void;
}

export function NewComponent({ title, onPress }: NewComponentProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  text: {
    color: theme.colors.text,
  },
});
```

### 3. Adding State Management
```typescript
// src/store/newStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NewState {
  data: string[];
  loadData: () => Promise<void>;
  saveData: (data: string[]) => Promise<void>;
}

export const useNewStore = create<NewState>((set) => ({
  data: [],
  
  loadData: async () => {
    try {
      const saved = await AsyncStorage.getItem('@app:new_data');
      if (saved) {
        set({ data: JSON.parse(saved) });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  },
  
  saveData: async (data) => {
    try {
      await AsyncStorage.setItem('@app:new_data', JSON.stringify(data));
      set({ data });
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  },
}));
```

---

## 🧪 Testing

### Writing Tests
```typescript
// src/components/__tests__/NewComponent.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NewComponent } from '../NewComponent';

describe('NewComponent', () => {
  it('renders title correctly', () => {
    render(<NewComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeTruthy();
  });
  
  it('handles press events', () => {
    const onPress = jest.fn();
    render(<NewComponent title="Test" onPress={onPress} />);
    // Test press handling
  });
});
```

### Running Tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Specific file
npm test -- NewComponent.test.tsx
```

---

## 🎯 Code Style Guide

### TypeScript
- Use strict typing (avoid `any`)
- Define interfaces for all props
- Use type inference where obvious
- Export types from `src/types/index.ts`

### React Components
- Use functional components
- Use hooks (useState, useEffect, etc.)
- Memoize expensive computations
- Keep components small and focused

### Naming Conventions
- Components: PascalCase (`MedicalTermCard`)
- Files: PascalCase for components (`MedicalTermCard.tsx`)
- Hooks: camelCase with 'use' prefix (`useWordStore`)
- Constants: UPPER_SNAKE_CASE (`MAX_TERMS`)
- Functions: camelCase (`loadTerms`)

### File Organization
```typescript
// 1. Imports (external first, then internal)
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { theme } from '../theme/theme';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
export function Component({ title }: Props) {
  // 4. Hooks
  const [state, setState] = useState('');
  
  // 5. Functions
  const handlePress = () => {
    // ...
  };
  
  // 6. Render
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}

// 7. Styles
const styles = StyleSheet.create({
  // ...
});
```

---

## 🎨 Design System

### Using Theme
```typescript
import { theme } from '../theme/theme';

// Colors
theme.colors.primary
theme.colors.accent
theme.colors.background
theme.colors.text

// Spacing
theme.spacing.xs   // 4
theme.spacing.sm   // 8
theme.spacing.md   // 16
theme.spacing.lg   // 24
theme.spacing.xl   // 32

// Typography
theme.typography.sizes.sm   // 12
theme.typography.sizes.md   // 16
theme.typography.sizes.lg   // 20
theme.typography.sizes.xl   // 24
```

### Consistent Styling
- Use theme values (don't hardcode colors/spacing)
- Follow existing patterns
- Keep styles at bottom of file
- Use StyleSheet.create for performance

---

## 📦 Adding Dependencies

### Installing Packages
```bash
# Install package
npm install package-name

# Install dev dependency
npm install -D package-name

# Update package.json
# Test thoroughly
npm test
```

### Important Notes
- **React Version**: MUST use React 18.2.0 (NOT React 19!)
- **Expo SDK**: Currently on SDK 54
- Test on all platforms after adding dependencies
- Update documentation if needed

---

## 🐛 Debugging

### Development Tools
```bash
# Start with debugging
.\LAUNCH.bat

# Clear cache
npx expo start --clear

# Check logs
# Use Debug tab in app
```

### Common Issues
1. **Metro bundler issues** → Clear cache: `npx expo start --clear`
2. **Android emulator issues** → Restart: `.\scripts\android\restart-emulator.bat`
3. **TypeScript errors** → Run: `npm run type-check`
4. **Test failures** → Run: `npm test -- --verbose`

See [03-DEBUGGING.md](./03-DEBUGGING.md) for detailed debugging guide.

---

## 📝 Documentation

### When to Update Docs
- Adding new features
- Changing architecture
- Fixing major bugs
- Adding dependencies
- Changing workflows

### Which Docs to Update
- `README.md` - For user-facing changes
- `TODO.md` - Mark completed items
- `MEDICAL-TERMS-GUIDE.md` - When adding terms
- This file - For development changes

---

## 🚀 Deployment

### Building for Production
```bash
# Android
eas build --platform android

# iOS
eas build --platform ios

# Both
eas build --platform all
```

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Test on physical devices
- [ ] Update version in app.json
- [ ] Update CHANGELOG
- [ ] Create git tag

---

## 💡 Best Practices

### Performance
- Memoize expensive computations
- Use React.memo for pure components
- Optimize images and assets
- Minimize re-renders
- Use FlatList for long lists

### Error Handling
- Always use try-catch for async operations
- Log errors to errorLogger
- Show user-friendly error messages
- Test error scenarios

### State Management
- Keep state close to where it's used
- Use Zustand for global state
- Persist important data to AsyncStorage
- Validate data before saving

### Testing
- Write tests for new features
- Test edge cases
- Test error scenarios
- Maintain test coverage above 60%

---

## 📚 Resources

### Documentation
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand](https://github.com/pmndrs/zustand)

### Internal Docs
- [00-START-HERE.md](./00-START-HERE.md) - Project overview
- [02-TESTING.md](./02-TESTING.md) - Testing guide
- [03-DEBUGGING.md](./03-DEBUGGING.md) - Debugging guide
- [MEDICAL-TERMS-GUIDE.md](../MEDICAL-TERMS-GUIDE.md) - Medical terms

---

*Last Updated: January 2025*
