# Healthcare Vocab App - Automated Testing Strategy

## 🎯 Overview

This document outlines the comprehensive automated testing strategy for the Healthcare Vocabulary App, ensuring all code is validated with automatic tests in CI.

## 📊 Testing Pyramid

```
        /\
       /E2E\         5-10 tests (Critical user flows)
      /------\
     /Integration\   20-30 tests (Screen & feature tests)
    /------------\
   /  Unit Tests  \  100+ tests (Components, utils, stores)
  /----------------\
```

## 🧪 Test Types

### 1. Unit Tests (Fast, Many)
**Target: 80%+ code coverage**

#### Components
- ✅ MedicalTermCard - 38 tests
- ✅ ProgressIndicator - 38 tests
- ✅ SearchBar - 31 tests
- ✅ StatCard - 9 tests
- ✅ StreakCalendar - 28 tests
- ✅ SwipeableCard - 23 tests
- 🔄 ActionButtons - TODO
- 🔄 CategoryCard - TODO
- 🔄 ErrorBoundary - TODO
- 🔄 FilterChip - TODO
- 🔄 MasteryChart - TODO
- 🔄 SuccessToast - TODO
- 🔄 TermBreakdown - TODO
- 🔄 Tooltip - TODO

#### Stores
- ✅ wordStore - 27 tests (fixed mastery level logic)
- ✅ streakStore - 14 tests

#### Utils
- ✅ componentBreakdown - 8 tests
- 🔄 dataValidator - Partial coverage
- 🔄 errorLogger - TODO

### 2. Integration Tests (Medium Speed, Some)
**Target: All screens + key flows**

#### Screens
- ✅ HomeScreen - 6 tests
- ✅ LearnScreen - 10 tests
- 🔄 LibraryScreen - TODO
- 🔄 ProgressScreen - TODO
- 🔄 DebugScreen - TODO

#### User Flows
- 🔄 Complete study session flow
- 🔄 Search and filter flow
- 🔄 Bookmark and favorite flow
- 🔄 Progress tracking flow

### 3. E2E Tests (Slow, Few)
**Target: 5-10 critical paths**

- 🔄 First-time user onboarding
- 🔄 Complete study session (5 cards)
- 🔄 Search and study specific term
- 🔄 Build 7-day streak
- 🔄 Master a term (5+ correct answers)

## 🔧 CI/CD Pipeline

### GitHub Actions Workflows

#### 1. Main CI Pipeline (`.github/workflows/ci.yml`)
**Triggers:** Push to main/develop, Pull Requests

**Jobs:**
- **Test** (Matrix: Node 18.x, 20.x)
  - Install dependencies
  - Run linter (if configured)
  - Run unit tests with coverage
  - Upload coverage to Codecov
  - Generate coverage report
  - Archive test results
  - Check coverage thresholds (60% minimum)

- **Build**
  - Type check with TypeScript
  - Build for web platform
  - Verify no build errors

- **Quality Gates**
  - Ensure all tests pass
  - Verify coverage thresholds
  - Block merge if quality gates fail

#### 2. Pre-commit Checks (`.github/workflows/pre-commit.yml`)
**Triggers:** Pull Request events

**Jobs:**
- **Lint & Format Check**
  - TypeScript type checking
  - Run all tests

- **Test Coverage Check**
  - Generate coverage report
  - Comment PR with coverage changes

### Quality Gates

#### Merge Requirements
- ✅ All tests must pass
- ✅ TypeScript compilation successful
- ✅ Code coverage ≥ 60% (current: 19%)
- ✅ No critical security vulnerabilities

#### Coverage Targets
- **Phase 1 (Current):** 60% overall
- **Phase 2 (Next sprint):** 70% overall
- **Phase 3 (Production):** 80% overall

## 🚀 Running Tests

### Local Development

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI (no watch, with coverage)
npm run test:ci
```

### Test Scripts

```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:ci": "jest --ci --coverage --maxWorkers=2"
}
```

## 📝 Test Writing Guidelines

### Component Tests
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Component />);
    expect(getByText('Expected Text')).toBeTruthy();
  });

  it('should handle user interaction', () => {
    const mockFn = jest.fn();
    const { getByRole } = render(<Component onPress={mockFn} />);
    fireEvent.press(getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### Store Tests
```typescript
describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({ /* reset state */ });
  });

  it('should update state correctly', async () => {
    const { result } = renderHook(() => useStore());
    await act(async () => {
      await result.current.someAction();
    });
    expect(result.current.someValue).toBe(expected);
  });
});
```

### Integration Tests
```typescript
describe('ScreenName Integration', () => {
  it('should complete user flow', async () => {
    const { getByText, getByLabelText } = render(<Screen />);
    
    fireEvent.press(getByText('Start'));
    await waitFor(() => {
      expect(getByText('Success')).toBeTruthy();
    });
  });
});
```

## 🐛 Known Issues & Fixes

### Fixed Issues
1. ✅ **Mastery Level Calculation** - Updated to use incremented counts
2. ✅ **Date Serialization** - Tests now handle Date objects correctly
3. ✅ **Streak Calculation** - Fixed edge cases in streak logic

### Remaining Issues
1. 🔄 **SwipeableCard Gesture Tests** - Need proper gesture handler mocking
2. 🔄 **Low Screen Coverage** - Need integration tests for all screens
3. 🔄 **Utils Coverage** - Need tests for errorLogger and dataValidator

## 📈 Coverage Progress

### Current Coverage (Baseline)
```
File                | % Stmts | % Branch | % Funcs | % Lines
--------------------|---------|----------|---------|--------
All files           |   18.83 |    19.07 |   13.10 |   19.33
components/         |   15.75 |    20.33 |   17.04 |   15.61
screens/            |    0.00 |     0.00 |    0.00 |    0.00
store/              |   76.92 |    80.43 |  100.00 |   76.69
utils/              |   23.47 |    25.33 |   15.38 |   24.87
```

### Target Coverage (Phase 1)
```
File                | Target
--------------------|--------
All files           |   60%+
components/         |   70%+
screens/            |   50%+
store/              |   90%+
utils/              |   70%+
```

## 🔄 Continuous Improvement

### Weekly Tasks
- [ ] Add 5+ new tests per week
- [ ] Fix 1-2 failing tests per week
- [ ] Increase coverage by 2-3% per week
- [ ] Review and update test documentation

### Monthly Goals
- [ ] Achieve 60% overall coverage
- [ ] All screens have integration tests
- [ ] All critical utils have unit tests
- [ ] E2E tests for top 3 user flows

## 📚 Resources

### Documentation
- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Tools
- **Jest** - Test runner and assertion library
- **React Native Testing Library** - Component testing utilities
- **Codecov** - Coverage reporting and tracking
- **GitHub Actions** - CI/CD automation

## 🎓 Best Practices

1. **Write tests first** - TDD when possible
2. **Test behavior, not implementation** - Focus on user interactions
3. **Keep tests isolated** - No shared state between tests
4. **Use descriptive names** - Test names should explain what they test
5. **Mock external dependencies** - AsyncStorage, navigation, etc.
6. **Aim for fast tests** - Unit tests should run in milliseconds
7. **Maintain test quality** - Tests should be as clean as production code

## 🚦 Status Dashboard

### Test Health
- **Total Tests:** 207
- **Passing:** 186 (90%)
- **Failing:** 21 (10%)
- **Coverage:** 19.33%

### CI Status
- **Main Branch:** ✅ Passing
- **Latest PR:** 🔄 Pending
- **Coverage Trend:** 📈 Improving

---

**Last Updated:** 2025-01-08
**Next Review:** Weekly sprint planning
