# 🧭 Quick Navigation Guide

**Lost? Start here!** This is your map to the Healthcare Vocab App project.

---

## 🎯 I Want To...

### Get Started
- **I'm new here** → [00-START-HERE.md](./00-START-HERE.md)
- **Install and run** → [../QUICK_START.md](../QUICK_START.md)
- **See what to do next** → [../TODO.md](../TODO.md)

### Develop
- **Add features** → [01-DEVELOPMENT.md](./01-DEVELOPMENT.md)
- **Understand architecture** → [01-DEVELOPMENT.md](./01-DEVELOPMENT.md#architecture-overview)
- **Follow best practices** → [01-DEVELOPMENT.md](./01-DEVELOPMENT.md#code-style-guide)
- **Add medical terms** → [../MEDICAL-TERMS-GUIDE.md](../MEDICAL-TERMS-GUIDE.md)

### Test
- **Write tests** → [02-TESTING.md](./02-TESTING.md)
- **Run tests** → [02-TESTING.md](./02-TESTING.md#quick-start)
- **Fix failing tests** → [02-TESTING.md](./02-TESTING.md#debugging-tests)
- **Improve coverage** → [02-TESTING.md](./02-TESTING.md#improving-coverage)

### Debug
- **App won't start** → [03-DEBUGGING.md](./03-DEBUGGING.md#app-wont-start)
- **Runtime errors** → [03-DEBUGGING.md](./03-DEBUGGING.md#runtime-errors)
- **Android issues** → [03-DEBUGGING.md](./03-DEBUGGING.md#android-emulator-issues)
- **Use debug tools** → [03-DEBUGGING.md](./03-DEBUGGING.md#built-in-debug-tools)

### Use Scripts
- **See all scripts** → [../scripts/README.md](../scripts/README.md)
- **Android scripts** → [../scripts/README.md](../scripts/README.md#android)
- **Testing scripts** → [../scripts/README.md](../scripts/README.md#testing)
- **Maintenance** → [../scripts/README.md](../scripts/README.md#maintenance)

### Find Old Docs
- **Handoffs** → [archive/handoffs/](./archive/handoffs/)
- **Session summaries** → [archive/session-summaries/](./archive/session-summaries/)
- **Historical docs** → [archive/historical/](./archive/historical/)
- **Old testing docs** → [archive/testing/](./archive/testing/)

---

## 📂 Project Map

```
HealthcareVocabApp/
│
├─ 🎯 START HERE
│  ├─ docs/00-START-HERE.md ⭐ Master guide
│  ├─ README.md              Project overview
│  ├─ QUICK_START.md         Setup guide
│  └─ TODO.md                Current priorities
│
├─ 💻 DEVELOPMENT
│  ├─ docs/01-DEVELOPMENT.md Development guide
│  ├─ src/                   Source code
│  └─ MEDICAL-TERMS-GUIDE.md Medical terms
│
├─ 🧪 TESTING
│  ├─ docs/02-TESTING.md     Testing guide
│  ├─ TESTING_STRATEGY.md    Comprehensive strategy
│  └─ src/**/__tests__/      Test files
│
├─ 🐛 DEBUGGING
│  ├─ docs/03-DEBUGGING.md   Debug guide
│  ├─ DEBUGGING-GUIDE.md     Advanced debugging
│  └─ CLAUDE-AUTONOMOUS-TESTING.md AI testing
│
├─ 🔧 SCRIPTS
│  ├─ scripts/README.md      Scripts documentation
│  ├─ LAUNCH.bat ⭐          Main launcher
│  ├─ quick-start.bat        Quick start
│  └─ test-app-features.bat  Feature testing
│
└─ 📦 ARCHIVE
   └─ docs/archive/          Historical docs
```

---

## 🚀 Common Commands

### Start Development
```bash
.\LAUNCH.bat                 # Full launcher (recommended)
.\quick-start.bat            # Quick Android start
npx expo start --clear       # Manual start with cache clear
```

### Testing
```bash
npm test                     # Run all tests
npm run test:watch           # Watch mode
npm run test:coverage        # With coverage
.\test-app-features.bat      # Feature tests
```

### Debugging
```bash
# In app: Navigate to Debug tab (bug icon)
.\scripts\android\verify-android-setup.bat  # Verify setup
.\scripts\android\restart-emulator.bat      # Restart emulator
npx expo start --clear                      # Clear cache
```

### Maintenance
```bash
npm install                  # Install dependencies
.\scripts\maintenance\rebuild-native.bat    # Rebuild
.\scripts\maintenance\troubleshoot.bat      # Troubleshoot
```

---

## 📚 Documentation Index

### Essential (Read First)
1. [00-START-HERE.md](./00-START-HERE.md) - Master guide
2. [../README.md](../README.md) - Project overview
3. [../QUICK_START.md](../QUICK_START.md) - Setup
4. [../TODO.md](../TODO.md) - Priorities

### Guides (Reference)
5. [01-DEVELOPMENT.md](./01-DEVELOPMENT.md) - Development
6. [02-TESTING.md](./02-TESTING.md) - Testing
7. [03-DEBUGGING.md](./03-DEBUGGING.md) - Debugging
8. [../scripts/README.md](../scripts/README.md) - Scripts

### Specialized
9. [../MEDICAL-TERMS-GUIDE.md](../MEDICAL-TERMS-GUIDE.md) - Medical terms
10. [../TESTING_STRATEGY.md](../TESTING_STRATEGY.md) - Testing strategy
11. [../DEBUGGING-GUIDE.md](../DEBUGGING-GUIDE.md) - Advanced debugging
12. [../CLAUDE-AUTONOMOUS-TESTING.md](../CLAUDE-AUTONOMOUS-TESTING.md) - AI testing

### Archive
13. [archive/README.md](./archive/README.md) - Archive index

---

## 🎓 Learning Path

### Day 1: Getting Started
1. Read [00-START-HERE.md](./00-START-HERE.md)
2. Follow [../QUICK_START.md](../QUICK_START.md)
3. Run `.\LAUNCH.bat`
4. Explore the app (all 5 tabs)

### Day 2: Understanding
1. Read [01-DEVELOPMENT.md](./01-DEVELOPMENT.md)
2. Explore `src/` folder structure
3. Read [../MEDICAL-TERMS-GUIDE.md](../MEDICAL-TERMS-GUIDE.md)
4. Check [../TODO.md](../TODO.md)

### Day 3: Contributing
1. Pick a task from [../TODO.md](../TODO.md)
2. Follow [01-DEVELOPMENT.md](./01-DEVELOPMENT.md) workflow
3. Write tests ([02-TESTING.md](./02-TESTING.md))
4. Test thoroughly

### Ongoing
- Use [03-DEBUGGING.md](./03-DEBUGGING.md) when stuck
- Reference [01-DEVELOPMENT.md](./01-DEVELOPMENT.md) for patterns
- Check [../TODO.md](../TODO.md) for priorities
- Update docs when making changes

---

## 🔍 Search Tips

### Finding Information
1. **Start with** [00-START-HERE.md](./00-START-HERE.md)
2. **Use Ctrl+F** to search within docs
3. **Check** [../TODO.md](../TODO.md) for current work
4. **Look in** [archive/](./archive/) for historical context

### Common Searches
- "How to run" → [../QUICK_START.md](../QUICK_START.md)
- "How to test" → [02-TESTING.md](./02-TESTING.md)
- "Error" → [03-DEBUGGING.md](./03-DEBUGGING.md)
- "Add terms" → [../MEDICAL-TERMS-GUIDE.md](../MEDICAL-TERMS-GUIDE.md)
- "Scripts" → [../scripts/README.md](../scripts/README.md)

---

## 💡 Pro Tips

### For Developers
- Bookmark [00-START-HERE.md](./00-START-HERE.md)
- Always use `.\LAUNCH.bat` to start
- Check Debug tab in app frequently
- Run tests before committing

### For AI Assistants
- Start with [00-START-HERE.md](./00-START-HERE.md)
- Check [../TODO.md](../TODO.md) for priorities
- Use [CLAUDE-AUTONOMOUS-TESTING.md](../CLAUDE-AUTONOMOUS-TESTING.md)
- Update docs when making changes

### For Everyone
- When lost, come back here
- Use the "I Want To..." section above
- Follow the learning path
- Ask questions in issues/discussions

---

## 🆘 Still Lost?

### Quick Help
1. **Read** [00-START-HERE.md](./00-START-HERE.md)
2. **Check** [03-DEBUGGING.md](./03-DEBUGGING.md)
3. **Try** `.\LAUNCH.bat`
4. **Look** in Debug tab (in app)

### Can't Find Something?
- Check [archive/](./archive/) for old docs
- Search in [00-START-HERE.md](./00-START-HERE.md)
- Look in [../scripts/README.md](../scripts/README.md)
- Check [../TODO.md](../TODO.md)

---

*Last Updated: January 2025*  
*This is your map - use it often!* 🗺️
