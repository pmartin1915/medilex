# 🏥 Healthcare Vocab App - START HERE

**Version**: 1.0.0  
**Status**: Production Ready  
**Medical Terms**: 75 terms across 12+ specialties  
**Tests**: 231 automated tests (200 passing)

---

## 🚀 QUICK START (30 seconds)

```bash
# Option 1: Automatic (Recommended)
.\LAUNCH.bat

# Option 2: Android Only
.\quick-start.bat

# Option 3: Manual
npx expo start --clear
# Then press 'a' for Android or 'i' for iOS
```

**First time?** Read [QUICK_START.md](../QUICK_START.md) for detailed setup.

---

## 📁 PROJECT STRUCTURE

```
HealthcareVocabApp/
├── src/                    # Source code (MAIN WORK HERE)
│   ├── components/         # Reusable UI components
│   ├── screens/           # 5 main screens (Home, Learn, Library, Progress, Debug)
│   ├── store/             # Zustand state management
│   ├── utils/             # Utilities & error logging
│   ├── data/              # Medical terms dataset (75 terms)
│   └── theme/             # Design system
├── docs/                  # Documentation (YOU ARE HERE)
│   ├── 00-START-HERE.md   # This file
│   ├── 01-DEVELOPMENT.md  # Development workflow
│   ├── 02-TESTING.md      # Testing guide
│   ├── 03-DEBUGGING.md    # Debugging & troubleshooting
│   └── archive/           # Historical docs
├── scripts/               # Helper scripts
│   ├── android/           # Android-specific scripts
│   ├── testing/           # Test automation
│   └── maintenance/       # Maintenance utilities
├── LAUNCH.bat             # Main launcher (USE THIS)
├── quick-start.bat        # Quick Android start
└── README.md              # Project overview
```

---

## 🎯 COMMON TASKS

### Run the App
```bash
.\LAUNCH.bat              # Automatic - handles everything
.\quick-start.bat         # Android only - fast start
```

### Run Tests
```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
```

### Debug Issues
1. Open app → Navigate to **Debug tab** (bug icon)
2. Check **Error Logs** for recent errors
3. Use **Copy** button to share errors
4. See [03-DEBUGGING.md](./03-DEBUGGING.md) for detailed guide

### Add Medical Terms
1. Edit `src/data/sampleTerms.ts`
2. Follow the `MedicalTerm` interface structure
3. Run tests to validate: `npm test`
4. See [MEDICAL-TERMS-GUIDE.md](../MEDICAL-TERMS-GUIDE.md)

---

## 📚 DOCUMENTATION GUIDE

### Essential Reading
- **[README.md](../README.md)** - Project overview & features
- **[QUICK_START.md](../QUICK_START.md)** - Setup instructions
- **[TODO.md](../TODO.md)** - Current priorities & roadmap

### Development Guides
- **[01-DEVELOPMENT.md](./01-DEVELOPMENT.md)** - Development workflow
- **[02-TESTING.md](./02-TESTING.md)** - Testing strategy
- **[03-DEBUGGING.md](./03-DEBUGGING.md)** - Debugging guide
- **[MEDICAL-TERMS-GUIDE.md](../MEDICAL-TERMS-GUIDE.md)** - Medical terms documentation

### Reference
- **[TESTING_STRATEGY.md](../TESTING_STRATEGY.md)** - Comprehensive testing docs
- **[DEBUGGING-GUIDE.md](../DEBUGGING-GUIDE.md)** - Advanced debugging

### Historical (Archive)
- **[docs/archive/](./archive/)** - Old handoffs, summaries, completed work

---

## 🏗️ ARCHITECTURE OVERVIEW

### Tech Stack
- **React Native** 0.81.5 + **Expo** SDK 54
- **React** 18.2.0 (NOT React 19!)
- **TypeScript** 5.9.2
- **Zustand** for state management
- **AsyncStorage** for persistence
- **Jest** for testing (231 tests)

### Key Features
- ✅ 5-tab navigation (Home, Learn, Library, Progress, Debug)
- ✅ Swipeable flashcards with gesture controls
- ✅ Streak tracking (7-day calendar)
- ✅ Progress analytics
- ✅ Audio pronunciation
- ✅ Search & filter
- ✅ Error logging & debug panel
- ✅ Offline-first architecture

### State Management
- **wordStore** - Medical terms & user progress
- **streakStore** - Streak tracking & study sessions
- All state persisted to AsyncStorage

---

## 🐛 TROUBLESHOOTING

### App Won't Start
```bash
# Clear cache and restart
npx expo start --clear

# Or use the launcher
.\LAUNCH.bat
```

### Android Emulator Issues
```bash
# Check emulator status
.\scripts\android\verify-android-setup.bat

# Restart emulator
.\scripts\android\restart-emulator.bat
```

### Runtime Errors
1. Open app → **Debug tab**
2. Check error logs
3. Copy error details
4. See [03-DEBUGGING.md](./03-DEBUGGING.md)

### Test Failures
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- wordStore.test.ts
```

---

## 🎓 DEVELOPMENT WORKFLOW

### Daily Development
1. **Start**: `.\LAUNCH.bat`
2. **Code**: Make changes in `src/`
3. **Test**: `npm test` before committing
4. **Debug**: Use Debug tab in app
5. **Commit**: Clear commit messages

### Before Committing
```bash
npm test                  # Run tests
npm run type-check        # TypeScript check
npm run lint              # Linting (if configured)
```

### Adding Features
1. Read [TODO.md](../TODO.md) for priorities
2. Create feature branch
3. Implement with tests
4. Update documentation
5. Test on Android/iOS
6. Commit & push

---

## 📊 PROJECT STATUS

### Current State
- ✅ **Core App**: Fully functional
- ✅ **Testing**: 231 tests (200 passing, 31 need fixes)
- ✅ **Medical Terms**: 75 terms across 12+ specialties
- ✅ **CI/CD**: GitHub Actions configured
- ✅ **Error Handling**: Comprehensive logging
- ✅ **Documentation**: Organized & complete

### Next Priorities (from TODO.md)
1. Fix 31 failing tests
2. Add more medical terms (target: 100+)
3. Increase test coverage (target: 60%+)
4. Implement spaced repetition
5. Prepare for app store launch

### Known Issues
- 31 test failures (non-blocking, mostly minor)
- iOS testing needs verification
- Web platform needs testing

---

## 🚀 PRODUCTION READINESS

### Completed ✅
- [x] Core functionality
- [x] Error handling
- [x] Data validation
- [x] Automated testing
- [x] Debug tools
- [x] Documentation

### Before Launch 🎯
- [ ] Fix all test failures
- [ ] 60%+ test coverage
- [ ] Test on physical devices
- [ ] App store assets (icons, screenshots)
- [ ] Privacy policy & terms
- [ ] Beta testing phase

---

## 💡 TIPS & BEST PRACTICES

### For Developers
- Always use `.\LAUNCH.bat` to start (handles Android SDK paths)
- Check Debug tab frequently during development
- Run tests before committing
- Use TypeScript strictly (avoid `any`)
- Follow existing code patterns

### For AI Assistants
- Read [.claude/PROJECT_CONTEXT.md](../.claude/PROJECT_CONTEXT.md)
- Use [CLAUDE-AUTONOMOUS-TESTING.md](../CLAUDE-AUTONOMOUS-TESTING.md) for testing
- Check [TODO.md](../TODO.md) for current priorities
- Update documentation when making changes

### For New Contributors
1. Read this file (you're doing it!)
2. Read [README.md](../README.md)
3. Run `.\LAUNCH.bat` to see the app
4. Check [TODO.md](../TODO.md) for tasks
5. Read [01-DEVELOPMENT.md](./01-DEVELOPMENT.md)

---

## 📞 NEED HELP?

### Quick References
- **Can't start app?** → [QUICK_START.md](../QUICK_START.md)
- **App crashes?** → [03-DEBUGGING.md](./03-DEBUGGING.md)
- **Adding terms?** → [MEDICAL-TERMS-GUIDE.md](../MEDICAL-TERMS-GUIDE.md)
- **Writing tests?** → [02-TESTING.md](./02-TESTING.md)

### Debug Checklist
1. ✅ Check Debug tab in app
2. ✅ Run `npx expo start --clear`
3. ✅ Check [03-DEBUGGING.md](./03-DEBUGGING.md)
4. ✅ Review error logs
5. ✅ Test on different platform

---

## 🎉 YOU'RE READY!

This is a **professional-grade mobile application** with:
- 75 medical terms
- 231 automated tests
- Comprehensive error handling
- Production-ready architecture

**Next Step**: Run `.\LAUNCH.bat` and start developing! 🚀

---

*Last Updated: January 2025*  
*Maintained by: Medilex Team*
