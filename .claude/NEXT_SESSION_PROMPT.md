# 🚀 Prompt for Next Claude Instance

Copy and paste this into your next session with Claude:

---

## Quick Start Prompt

```
Hi! I'm continuing work on my Healthcare Vocabulary App (React Native + Expo).

Please read the project context first:
- Read: .claude/PROJECT_CONTEXT.md (comprehensive codebase overview)
- Reference: PLATFORM_FIXES.md (troubleshooting guide)

Current State:
✅ Vertical swipe navigation working (UP=next, DOWN=previous)
⚠️ Previous swipe (DOWN) may need testing/fixes
⚠️ Missing error handling throughout
⚠️ Missing loading states
⚠️ Code has magic numbers and hardcoded values

My Environment:
- Windows (PowerShell)
- Android SDK: D:\Android\Sdk
- Project: D:\Medilex\HealthcareVocabApp
- Testing: iOS (Expo Go), Android Emulator, Web

My Preferences:
- Systematic, step-by-step explanations
- Code should be easily modifiable without breaking
- Test on all platforms (iOS, Android, Web)
- Create .bat helper scripts for complex operations
- Clear comments and descriptive names

Current Branch: claude/healthcare-vocab-app-011CUxRXAghizNMCKbQxtZDB

Priority Goals (in order):
1. Test and fix previous swipe functionality
2. Enhance swipe gestures (feedback, animations, tuning)
3. Add comprehensive error handling
4. Add loading states
5. Quality improvements (accessibility, performance)
6. Eventually: App store deployment

[Your specific request for this session goes here]
```

---

## Alternative: Ultra-Quick Prompt

If you want to dive straight in:

```
I'm working on my Healthcare Vocab App (context in .claude/PROJECT_CONTEXT.md).

Quick task: [Describe your specific goal]

Please review the context doc first to understand the codebase, my setup, and known issues.
```

---

## What to Tell Claude When Things Go Wrong

**Metro cache issues (old code showing):**
```
The apps are showing old code. I've tried `npx expo start --clear` and closed/reopened Expo Go, but still seeing old version. See PLATFORM_FIXES.md for common solutions.
```

**Android emulator won't launch:**
```
Android emulator launches but app won't load. I've tried `.\troubleshoot.bat` option 5. Check PLATFORM_FIXES.md section on Android issues.
```

**Merge conflicts:**
```
Git pull created merge conflicts. I see <<<<< HEAD markers in files. Check PROJECT_CONTEXT.md for the standard resolution process.
```

**Feature not working:**
```
[Describe the feature] isn't working. I tested on [platforms]. Here's the error: [paste error]. Context in .claude/PROJECT_CONTEXT.md.
```

---

## Tips for Effective Sessions

1. **Reference the context doc** - It has everything about the codebase
2. **Mention which platforms** you tested on (iOS/Android/Web)
3. **Share error messages** in full (don't paraphrase)
4. **Say if you've tried fixes** from PLATFORM_FIXES.md
5. **Be specific** about what you want to accomplish

---

*These context files are maintained to help future sessions be productive. Update PROJECT_CONTEXT.md when significant changes are made!*
