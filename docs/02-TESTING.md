# 🧪 Testing Guide

Complete testing documentation for the Healthcare Vocab App.

---

## 📊 Current Test Status

- **Total Tests**: 231
- **Passing**: 200 (87%)
- **Failing**: 31 (13%)
- **Coverage**: ~19% (Target: 60%+)
- **CI/CD**: GitHub Actions configured

---

## 🚀 Quick Start

```bash
# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# With coverage report
npm run test:coverage

# CI mode (for GitHub Actions)
npm run test:ci
```

---

## 📁 Test Structure

```
src/
├── components/__tests__/
│   ├── ErrorBoundary.test.tsx
│   ├── MedicalTermCard.test.tsx
│   ├── ProgressIndicator.test.tsx
│   ├── SearchBar.test.tsx
│   ├── StatCard.test.tsx
│   ├── StreakCalendar.test.tsx
│   └── SwipeableCard.test.tsx
├── screens/__tests__/
│   ├── HomeScreen.test.tsx
│   └── LearnScreen.test.tsx
├── store/__tests__/
│   ├── streakStore.test.ts
│   └── wordStore.test.ts
└── utils/__tests__/
    └── componentBreakdown.test.ts
```

---

## ✅ Test Categories

### 1. Component Tests
Test individual UI components in isolation.

**Example**: `MedicalTermCard.test.tsx`
```typescript
import { render, screen } from '@testing-library/react-native';
import { MedicalTermCard } from '../MedicalTermCard';

describe('MedicalTermCard', () => {
  const mockTerm = {
    id: '1',
    term: 'Hypertension',
    definition: 'High blood pressure',
    category: 'Cardiovascular',
  };

  it('renders term correctly', () => {
    render(<MedicalTermCard term={mockTerm} />);
    expect(screen.getByText('Hypertension')).toBeTruthy();
  });
});
```

### 2. Screen Tests
Test complete screens with navigation and state.

**Example**: `HomeScreen.test.tsx`
```typescript
import { render, screen } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';

describe('HomeScreen', () => {
  it('displays streak calendar', () => {
    render(<HomeScreen />);
    expect(screen.getByText(/Current Streak/i)).toBeTruthy();
  });
});
```

### 3. Store Tests
Test Zustand state management logic.

**Example**: `wordStore.test.ts`
```typescript
import { useWordStore } from '../wordStore';

describe('wordStore', () => {
  it('loads terms correctly', async () => {
    const { loadTerms, terms } = useWordStore.getState();
    await loadTerms();
    expect(terms.length).toBeGreaterThan(0);
  });
});
```

### 4. Utility Tests
Test helper functions and utilities.

**Example**: `dataValidator.test.ts`
```typescript
import { validateTerm } from '../dataValidator';

describe('dataValidator', () => {
  it('validates correct term structure', () => {
    const term = { id: '1', term: 'Test', definition: 'Test def' };
    expect(validateTerm(term)).toBe(true);
  });
});
```

---

## 🛠️ Writing Tests

### Test Template
```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Reset state, mocks, etc.
  });

  // Cleanup
  afterEach(() => {
    // Clean up
  });

  // Test cases
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeTruthy();
  });

  it('should handle user interaction', () => {
    const onPress = jest.fn();
    render(<ComponentName onPress={onPress} />);
    
    fireEvent.press(screen.getByText('Button'));
    expect(onPress).toHaveBeenCalled();
  });

  it('should handle error states', () => {
    render(<ComponentName error="Error message" />);
    expect(screen.getByText('Error message')).toBeTruthy();
  });
});
```

### Best Practices

#### 1. Test Behavior, Not Implementation
```typescript
// ❌ Bad - tests implementation
it('calls setState with correct value', () => {
  const { result } = renderHook(() => useState(0));
  // Testing internal state
});

// ✅ Good - tests behavior
it('displays updated count when button pressed', () => {
  render(<Counter />);
  fireEvent.press(screen.getByText('Increment'));
  expect(screen.getByText('Count: 1')).toBeTruthy();
});
```

#### 2. Use Descriptive Test Names
```typescript
// ❌ Bad
it('works', () => { /* ... */ });

// ✅ Good
it('displays error message when API call fails', () => { /* ... */ });
```

#### 3. Arrange-Act-Assert Pattern
```typescript
it('updates progress when term is marked correct', () => {
  // Arrange
  const term = { id: '1', term: 'Test' };
  render(<LearnScreen />);
  
  // Act
  fireEvent.press(screen.getByText('Know It'));
  
  // Assert
  expect(screen.getByText('Progress: 1/10')).toBeTruthy();
});
```

#### 4. Mock External Dependencies
```typescript
// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));
```

---

## 🎯 Testing Checklist

### For New Components
- [ ] Renders without crashing
- [ ] Displays props correctly
- [ ] Handles user interactions
- [ ] Shows loading states
- [ ] Shows error states
- [ ] Handles edge cases (empty data, null, undefined)
- [ ] Accessibility labels present

### For New Screens
- [ ] Renders all sections
- [ ] Navigation works
- [ ] Data loads correctly
- [ ] Handles empty states
- [ ] Handles error states
- [ ] User interactions work
- [ ] State updates correctly

### For New Stores
- [ ] Initial state correct
- [ ] Actions update state correctly
- [ ] Async operations work
- [ ] Error handling works
- [ ] Persistence works (AsyncStorage)
- [ ] State resets correctly

---

## 🐛 Debugging Tests

### Common Issues

#### 1. AsyncStorage Errors
```typescript
// Solution: Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));
```

#### 2. Navigation Errors
```typescript
// Solution: Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));
```

#### 3. Timeout Errors
```typescript
// Solution: Increase timeout
it('loads data', async () => {
  // Test code
}, 10000); // 10 second timeout
```

#### 4. Act Warnings
```typescript
// Solution: Wrap in act()
import { act } from '@testing-library/react-native';

await act(async () => {
  // Async operations
});
```

### Debugging Commands
```bash
# Run single test file
npm test -- ComponentName.test.tsx

# Run with verbose output
npm test -- --verbose

# Run with coverage
npm test -- --coverage

# Update snapshots
npm test -- -u
```

---

## 📈 Improving Coverage

### Current Coverage Gaps
1. **Error scenarios** - Need more error handling tests
2. **Edge cases** - Empty states, null values, etc.
3. **Integration tests** - Multi-component interactions
4. **E2E tests** - Complete user flows

### Priority Areas
1. **wordStore** - Core business logic
2. **LearnScreen** - Main user interaction
3. **Error handling** - Critical for stability
4. **Data validation** - Prevent corruption

### Coverage Goals
- **Target**: 60%+ overall coverage
- **Critical paths**: 80%+ coverage
- **Utilities**: 90%+ coverage

---

## 🤖 Automated Testing

### In-App Self-Tests
The app includes built-in diagnostic tests accessible via Debug tab:

1. Open app → Navigate to **Debug tab**
2. Tap **Tests** tab
3. Tap **Run Tests** button

**Tests Include**:
- ✅ Medical terms validation
- ✅ Minimum term count (20+)
- ✅ Search functionality
- ✅ AsyncStorage access
- ✅ Progress tracking
- ✅ Streak calculations
- ✅ Error logging
- ✅ Platform detection

### CI/CD Pipeline
GitHub Actions runs tests automatically on:
- Every push to main
- Every pull request
- Scheduled daily runs

**Configuration**: `.github/workflows/test.yml`

---

## 📚 Testing Resources

### Libraries Used
- **Jest** - Test runner
- **@testing-library/react-native** - Component testing
- **@testing-library/jest-native** - Custom matchers
- **react-test-renderer** - Snapshot testing

### Documentation
- [Jest Docs](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Internal Resources
- [TESTING_STRATEGY.md](../TESTING_STRATEGY.md) - Comprehensive strategy
- [AUTOMATED_TESTING_COMPLETE.md](../AUTOMATED_TESTING_COMPLETE.md) - Implementation details

---

## 🎯 Next Steps

### Short Term
1. Fix 31 failing tests
2. Add tests for error scenarios
3. Increase coverage to 30%

### Medium Term
1. Add integration tests
2. Increase coverage to 60%
3. Add E2E tests (Detox/Maestro)

### Long Term
1. 80%+ coverage
2. Performance testing
3. Accessibility testing
4. Visual regression testing

---

*Last Updated: January 2025*
