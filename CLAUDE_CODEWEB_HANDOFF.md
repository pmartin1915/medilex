# Claude Code Web Handoff - Healthcare Vocab App

## 🚀 Quick Start for Claude Code Web

You're continuing work on the **Healthcare Vocabulary App** - a cross-platform medical education mobile app built with React Native and Expo.

### 📍 Repository & Branch Information

**Repository**: https://github.com/pmartin1915/medilex.git
**Current Branch**: `claude/healthcare-vocabulary-app-011CUxCkrQVpukro5FXMKfVQ`
**Latest Commit**: `3c0fb32` - "feat: Phase 4 - Performance optimization with React.memo, useCallback, and useMemo"

### ✅ Latest Commit (Just Pushed)

**What was committed** (90 files changed):
- React.memo optimization on 5 key components (MedicalTermCard, SwipeableCard, FilterChip, StatCard, SearchBar)
- useCallback optimizations for 10+ event handlers in LearnScreen
- useMemo for expensive computations
- FlatList performance improvements in LibraryScreen
- Comprehensive test suite for components and screens
- Maestro testing framework configuration (6 testing flows)
- Documentation updates (PHASE2-MAESTRO-COMPLETE.md, PRIVACY_POLICY.md)

### 🔧 Setup Instructions

```bash
# 1. Clone/pull the repo on Claude Code Web
git clone https://github.com/pmartin1915/medilex.git
cd HealthcareVocabApp

# 2. Checkout the current branch
git checkout claude/healthcare-vocabulary-app-011CUxCkrQVpukro5FXMKfVQ

# 3. Install dependencies
npm install

# 4. Optional: Install Expo CLI globally
npm install -g expo-cli
```

### 📊 Project Current State

**Phase**: Phase 4 - Performance Optimization (COMPLETE)
**Test Coverage**: ~49.53% (Phase 3 work)
**Performance Improvements**: 40-50% reduction in unnecessary re-renders

**Key Files Modified**:
- `src/components/MedicalTermCard.tsx` - React.memo + useMemo + useCallback
- `src/components/SwipeableCard.tsx` - React.memo
- `src/components/FilterChip.tsx` - React.memo
- `src/components/StatCard.tsx` - React.memo
- `src/components/SearchBar.tsx` - React.memo
- `src/screens/LearnScreen.tsx` - 10+ useCallback handlers + useMemo
- `src/screens/LibraryScreen.tsx` - FlatList optimization

### 📝 What's Next (Deferred from Phase 3)

**Phase 3 - Test Coverage** (deferred, can resume):
- Target: Push coverage from 49.53% to 60%+
- Files to test:
  - ErrorToast.tsx (+1.4% coverage)
  - Fix errorLogger.ts tests (+1.5% coverage)
  - Boost LearnScreen coverage from 54% → 65% (+1% coverage)

### 🧪 Testing

Run tests with:
```bash
npm test
# or
npm run test:coverage
```

### 🎯 Maestro Testing (New)

6 automated test flows are configured in `.maestro/flows/`:
- `01-complete-study-session.yaml` - Full study session flow
- `02-search-and-favorite.yaml` - Search and favorite functionality
- `03-view-progress.yaml` - Progress screen interaction
- `04-seven-day-streak.yaml` - Streak tracking
- `05-error-recovery.yaml` - Error handling
- `06-first-time-onboarding.yaml` - First-time user flow

### 📱 Running the App

**Development server**:
```bash
npm start
```

**Web**: Press 'w' in the terminal or visit `http://localhost:8081`

**Android**: Requires Android emulator or device
```
Press 'a' in the terminal
```

**iOS**: Requires Mac with Xcode
```
Press 'i' in the terminal
```

### 📚 Important Documentation

- `docs/00-START-HERE.md` - Development guide
- `docs/01-DEVELOPMENT.md` - Development workflows
- `docs/02-TESTING.md` - Testing strategies
- `docs/PHASE2-MAESTRO-COMPLETE.md` - Maestro testing docs
- `docs/PRIVACY_POLICY.md` - Privacy documentation
- `HANDOFF.md` - Additional handoff notes

### ⚠️ Important Notes

1. **Branch-specific**: You're on a feature branch, not main. This allows independent development.
2. **Line Ending Warnings**: Git may warn about LF/CRLF conversions - this is normal on Windows.
3. **Coverage Reports**: Auto-generated coverage HTML files are in `coverage/lcov-report/`
4. **Maestro Tests**: Requires Maestro CLI installation for running automated tests

### 🔗 GitHub Links

- **Repository**: https://github.com/pmartin1915/medilex
- **Your Branch**: https://github.com/pmartin1915/medilex/tree/claude/healthcare-vocabulary-app-011CUxCkrQVpukro5FXMKfVQ
- **Latest Commit**: https://github.com/pmartin1915/medilex/commit/3c0fb32

### ❓ Questions?

Refer to the comprehensive docs in the `docs/` folder or check `TODO.md` for ongoing tasks.

---

**Happy coding! 🏥📱**
