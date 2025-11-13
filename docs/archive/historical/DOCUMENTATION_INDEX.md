# Healthcare Vocab App - Documentation Index

## 🚀 START HERE

### **LAUNCH.bat** ⭐
Your primary launcher. Double-click to:
- Start app on any platform
- View errors
- Copy error report for AI assistance
- Monitor live logs
- Fix common issues

### **PROMPT-FOR-NEXT-AI.md**
Quick context for AI assistants. Contains:
- Current project status
- Recent fixes applied
- Environment setup
- Next steps

---

## 📚 Core Documentation

### Getting Started
- **START-HERE.md** - Initial setup and first run
- **START-HERE.txt** - Dead simple text instructions
- **HOW-TO-RUN-APP.md** - Detailed run instructions
- **README.md** - Project overview

### Development Workflow
- **WORKFLOW-WITH-CLAUDE.md** - How to work with AI assistants
- **QUICK-REFERENCE.md** - Common commands and shortcuts
- **HANDOFF.md** - Session handoff information

### Testing & Verification
- **VERIFICATION-CHECKLIST.md** - Testing checklist
- **README-TESTING.md** - Testing documentation
- **iOS-VERIFICATION-GUIDE.md** - iOS-specific testing
- **MAESTRO_SETUP.md** - Automated testing setup

### Debugging
- **DEBUGGING-GUIDE.md** - Comprehensive debugging guide
- **CLAUDE-AUTONOMOUS-TESTING.md** - AI-assisted testing
- **BAT_FILES_INVENTORY.md** - Script reference guide

---

## 🏗️ Architecture & Design

### System Design
- **../Documentation/BUILD_PLAN.md** - Overall build plan
- **../Documentation/DATA_SCHEMA.md** - Data structure
- **../Documentation/DESIGN_SYSTEM.md** - UI/UX design system
- **../Documentation/COMPONENT_LIBRARY.md** - Component reference

### User Experience
- **../Documentation/UX_FLOWS.md** - User flow diagrams
- **TIKTOK_REDESIGN_PLAN.md** - UI redesign plan
- **../Documentation/SAMPLE_TERMS.md** - Sample medical terms

---

## 📝 Project Status & History

### Completed Work
- **IMPLEMENTATION_COMPLETE.md** - Feature implementation status
- **TESTING_IMPLEMENTATION_COMPLETE.md** - Testing phase 1
- **TESTING_PHASE2_COMPLETE.md** - Testing phase 2
- **ENHANCEMENTS_COMPLETE.md** - Enhancement tracking
- **REACT_DOWNGRADE_COMPLETE.md** - React 19→18 migration

### Platform-Specific
- **PLATFORM_FIXES.md** - Platform-specific fixes
- **WEB-COMPATIBILITY-REPORT.md** - Web platform status
- **WEB-VERSION-SETUP.md** - Web setup guide
- **MOBILE-READY.md** - Mobile readiness status

### Planning
- **TODO.md** - Outstanding tasks
- **../Documentation/PROJECT_CHECKLIST.md** - Project checklist
- **NEXT-SESSION-PROMPT.md** - Next session planning
- **NEXT-SESSION-MOBILE-TESTING.md** - Mobile testing plan
- **SESSION-SUMMARY.md** - Session summaries

### Reference
- **MEDICAL-TERMS-GUIDE.md** - Medical terminology reference

---

## 🔧 Scripts Reference

### Active Scripts (in root)
- **LAUNCH.bat** ⭐ - Master launcher
- **troubleshoot.bat** - Advanced troubleshooting menu
- **launch-emulator.bat** - Launch Android emulator
- **list-emulators.bat** - List available emulators
- **restart-emulator.bat** - Restart emulator only
- **verify-android-setup.bat** - Verify Android SDK setup
- **setup-android-env.bat** - Setup environment variables
- **quick-verify.bat** - Quick web verification
- **quick-verify-ios.bat** - Quick iOS verification
- **quick-verify-all.bat** - Verify all platforms
- **test-app-features.bat** - Feature testing
- **test-ios.bat** - iOS testing
- **test-web.bat** - Web testing
- **sync-with-git.bat** - Git sync operations
- **GET_LATEST_CODE.bat** - Pull latest code
- **RESOLVE_CONFLICTS.bat** - Resolve merge conflicts
- **rebuild-native.bat** - Rebuild native modules
- **QUICK_FIX_ALL_PLATFORMS.bat** - Platform fixes

### Archived Scripts (_archive_bat/)
Old scripts superseded by LAUNCH.bat. See **BAT_FILES_INVENTORY.md** for details.

---

## 🎯 Quick Workflows

### Daily Development
1. Double-click **LAUNCH.bat**
2. Choose platform (Web/iOS/Android)
3. Develop and test
4. Use LAUNCH.bat option [4] to check errors

### When Errors Occur
1. **LAUNCH.bat** → Option [4] - View errors
2. **LAUNCH.bat** → Option [5] - Copy for AI
3. Paste to AI assistant with context from **PROMPT-FOR-NEXT-AI.md**

### When Things Break
1. **LAUNCH.bat** → Option [7] - Clear cache (first try)
2. **LAUNCH.bat** → Option [8] - Fix Android (if Android issue)
3. **LAUNCH.bat** → Option [9] - Full reset (nuclear option)

### Starting New Session
1. Read **PROMPT-FOR-NEXT-AI.md**
2. Check **TODO.md** for outstanding tasks
3. Review **SESSION-SUMMARY.md** for recent changes
4. Run **LAUNCH.bat** to start app

### Handing Off to AI
1. Update **PROMPT-FOR-NEXT-AI.md** with current status
2. Update **SESSION-SUMMARY.md** with what you did
3. Update **TODO.md** with remaining tasks
4. AI reads these files to get instant context

---

## 📊 Documentation Status

### ✅ Up to Date
- PROMPT-FOR-NEXT-AI.md
- REACT_DOWNGRADE_COMPLETE.md
- BAT_FILES_INVENTORY.md
- DOCUMENTATION_INDEX.md (this file)
- LAUNCH.bat

### ⚠️ May Need Updates
- TODO.md - Check if tasks are current
- SESSION-SUMMARY.md - Update after each session
- VERIFICATION-CHECKLIST.md - Verify against current features

### 📦 Historical (Reference Only)
- ENHANCEMENTS_COMPLETE.md
- TESTING_IMPLEMENTATION_COMPLETE.md
- TESTING_PHASE2_COMPLETE.md
- IMPLEMENTATION_COMPLETE.md

---

## 🔍 Finding Information

**"How do I start the app?"**
→ LAUNCH.bat or HOW-TO-RUN-APP.md

**"What's the current status?"**
→ PROMPT-FOR-NEXT-AI.md

**"How do I fix errors?"**
→ DEBUGGING-GUIDE.md or LAUNCH.bat options 7-9

**"What features exist?"**
→ IMPLEMENTATION_COMPLETE.md or ../Documentation/COMPONENT_LIBRARY.md

**"How do I test?"**
→ VERIFICATION-CHECKLIST.md or README-TESTING.md

**"What's the architecture?"**
→ ../Documentation/BUILD_PLAN.md and DATA_SCHEMA.md

**"What scripts are available?"**
→ BAT_FILES_INVENTORY.md

**"How do I work with AI?"**
→ WORKFLOW-WITH-CLAUDE.md

---

## 📁 File Organization

```
d:\Medilex\HealthcareVocabApp\
├── LAUNCH.bat ⭐ (START HERE)
├── PROMPT-FOR-NEXT-AI.md ⭐ (AI CONTEXT)
├── DOCUMENTATION_INDEX.md ⭐ (THIS FILE)
├── BAT_FILES_INVENTORY.md (SCRIPT REFERENCE)
│
├── _archive_bat\ (old scripts)
│
├── Documentation\ (design docs)
│   ├── BUILD_PLAN.md
│   ├── DATA_SCHEMA.md
│   ├── DESIGN_SYSTEM.md
│   └── ...
│
├── src\ (source code)
│   ├── components\
│   ├── screens\
│   ├── services\
│   └── ...
│
└── [other .md files] (status, guides, history)
```

---

## 🆘 Emergency Contacts

**App won't start?**
→ LAUNCH.bat option [9] (Full Reset)

**Errors everywhere?**
→ LAUNCH.bat option [5] → Copy to AI

**Lost and confused?**
→ Read this file (DOCUMENTATION_INDEX.md)
→ Then read PROMPT-FOR-NEXT-AI.md
→ Then run LAUNCH.bat

**Need to hand off to someone?**
→ Update PROMPT-FOR-NEXT-AI.md
→ Update SESSION-SUMMARY.md
→ Point them to this file
