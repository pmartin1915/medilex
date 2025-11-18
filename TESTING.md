# Testing Infrastructure

## Overview

This project has a comprehensive testing setup using Jest and React Native Testing Library. Tests are organized by type (components, screens, stores) and provide coverage for core functionality.

## Test Structure

```
src/
├── components/
│   └── __tests__/
│       ├── SearchBar.test.tsx
│       ├── ProgressIndicator.test.tsx
│       └── SwipeableCard.test.tsx
├── screens/
│   └── __tests__/
│       └── LearnScreen.test.tsx
└── store/
    └── __tests__/
        └── wordStore.test.ts
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

## Test Coverage

The test suite includes:

### Component Tests
- **SearchBar**: Input handling, placeholder rendering, value changes
- **ProgressIndicator**: Progress display, percentage calculation, prop updates
- **SwipeableCard**: Children rendering, callback props, React.memo optimization

### Screen Tests
- **LearnScreen**: Term display, progress tracking, swipe functionality, completion flow

### Store Tests
- **wordStore**: Term loading, search functionality, progress tracking, favorites, bookmarks

## Known Issues

### jest-expo Compatibility Issue (Expo SDK 54)

**Issue**: `TypeError: Object.defineProperty called on non-object` at `jest-expo/src/preset/setup.js:47`

**Status**: Known compatibility issue between jest-expo 54 and Jest 29/30

**Impact**:
- Tests are written and structured correctly
- Configuration is in place
- Issue prevents test execution

**Solutions** (choose one):

#### Option 1: Use Expo SDK 52 (Recommended for testing)
```bash
npm install expo@~52.0.0 --save
npm install jest-expo@~52.0.0 --save-dev
npm install jest@29 --save-dev
npm test
```

#### Option 2: Skip jest-expo preset (Use custom React Native config)
Edit `jest.config.js`:
```js
module.exports = {
  preset: 'react-native', // Instead of 'jest-expo'
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // ... rest of config
};
```

Then install react-native preset:
```bash
npm install --save-dev @testing-library/react-native react-test-renderer@18.2.0
```

#### Option 3: Use Development Build Testing
```bash
# Generate native folders
npx expo prebuild

# Run tests in native environment
npm test
```

#### Option 4: Wait for jest-expo Update
Monitor: https://github.com/expo/expo/issues (jest-expo SDK 54 compatibility)

## Test File Examples

### Component Test Pattern
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello')).toBeTruthy();
  });
});
```

### Store Test Pattern
```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useMyStore } from '../myStore';

describe('myStore', () => {
  it('updates state', async () => {
    const { result } = renderHook(() => useMyStore());

    await act(async () => {
      await result.current.updateData();
    });

    expect(result.current.data).toBeTruthy();
  });
});
```

## Mocked Dependencies

The following are mocked in `jest.setup.js`:
- `@react-native-async-storage/async-storage`
- `expo-speech`
- `react-native-gesture-handler`
- `lucide-react-native`
- React Native animations

## Writing New Tests

### 1. Create test file
```bash
# For components
touch src/components/__tests__/MyComponent.test.tsx

# For screens
touch src/screens/__tests__/MyScreen.test.tsx

# For stores
touch src/store/__tests__/myStore.test.ts
```

### 2. Follow naming conventions
- Test files: `*.test.tsx` or `*.test.ts`
- Place in `__tests__` directory next to source
- Match source file name

### 3. Test structure
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('describes what it tests', () => {
    // Test implementation
  });
});
```

## Coverage Goals

Target coverage:
- **Statements**: 50%+
- **Branches**: 40%+
- **Functions**: 50%+
- **Lines**: 50%+

Current coverage: Pending jest-expo fix

## Testing Best Practices

1. **Test behavior, not implementation**
   - Test what users see and do
   - Avoid testing internal state directly

2. **Use descriptive test names**
   ```typescript
   it('calls onPress when button is tapped') // Good
   it('works') // Bad
   ```

3. **Keep tests focused**
   - One assertion concept per test
   - Tests should be independent

4. **Mock external dependencies**
   - Network calls
   - AsyncStorage
   - Native modules

5. **Test edge cases**
   - Empty states
   - Error conditions
   - Loading states

## Continuous Integration

When CI is set up, use:
```bash
npm run test:ci
```

This runs:
- All tests
- Coverage collection
- Optimized for CI (maxWorkers=2)

## Troubleshooting

### Tests not finding modules
```bash
npm install
npm test -- --clearCache
npm test
```

### Mock not working
Check `jest.setup.js` for mock configuration

### Timeout errors
Increase timeout in test:
```typescript
it('async test', async () => {
  // test
}, 10000); // 10 second timeout
```

## Next Steps

Once jest-expo issue is resolved:
1. Run full test suite
2. Verify coverage meets thresholds
3. Add tests for remaining components:
   - ErrorBoundary
   - MedicalTermCard
   - StreakCalendar
   - PrimaryButton
4. Add tests for remaining screens:
   - HomeScreen
   - LibraryScreen
   - ProgressScreen
5. Add tests for streakStore

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Expo Testing Guide](https://docs.expo.dev/develop/unit-testing/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
