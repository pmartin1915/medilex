# Healthcare Vocab App (Medilex)

A mobile flashcard application for learning medical terminology, built with React Native and Expo.

## Features

- **5-Tab Navigation**: Home, Learn, Library, Progress, Debug
- **Swipeable Flashcards**: Study medical terms with intuitive swipe gestures
- **Streak Tracking**: 7-day visual streak calendar
- **Progress Analytics**: Track accuracy, mastered terms, and study sessions
- **Audio Pronunciation**: Hear correct pronunciation of medical terms
- **Search & Filter**: Find terms quickly in the library
- **Offline-First**: All data stored locally with AsyncStorage
- **Error Handling**: Comprehensive error boundaries and try-catch blocks
- **Debug Panel**: Built-in error logging with copy/paste functionality
- **Real-time Error Notifications**: Toast alerts for errors in dev mode

## Tech Stack

- **React Native** 0.76.5
- **React** 18.2.0 (Critical: NOT React 19!)
- **Expo** SDK 52
- **TypeScript** 5.3.3
- **React Navigation** v6
- **Zustand** v4.5.2 (State Management)
- **AsyncStorage** (Data Persistence)
- **Lucide React Native** (Icons)
- **Expo Speech** (Audio Pronunciation)

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- Expo Go app on your phone (for testing)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### First Run

The app will automatically:
1. Load 5 sample medical terms
2. Initialize empty progress tracking
3. Set up streak tracking

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.tsx
│   ├── ErrorToast.tsx       # NEW: Real-time error notifications
│   ├── MedicalTermCard.tsx
│   ├── StartupLoader.tsx
│   ├── StreakCalendar.tsx
│   ├── SwipeableCard.tsx
│   ├── PrimaryButton.tsx
│   ├── ProgressIndicator.tsx
│   └── SearchBar.tsx
├── screens/            # Main app screens
│   ├── HomeScreen.tsx
│   ├── LearnScreen.tsx
│   ├── LibraryScreen.tsx
│   ├── ProgressScreen.tsx
│   └── DebugScreen.tsx      # NEW: Debug panel with error viewer
├── store/              # Zustand state management
│   ├── wordStore.ts
│   └── streakStore.ts
├── utils/              # Utilities
│   └── errorLogger.ts       # NEW: Error logging system
├── theme/              # Design system
│   └── theme.ts
├── types/              # TypeScript interfaces
│   └── index.ts
└── data/               # Sample data
    └── sampleTerms.ts
```

## Key Features Explained

### Home Screen
- Displays current streak with 7-day calendar
- Shows "Word of the Day"
- Quick stats and "Start Study Session" button

### Learn Screen
- Swipeable flashcards
- Swipe right = "Know it" (correct)
- Swipe left = "Don't know" (incorrect)
- Progress indicator shows current position
- Session complete screen after all cards

### Library Screen
- Browse all medical terms
- Search functionality
- Category badges
- Tap to view full details

### Progress Screen
- Total terms studied
- Accuracy percentage
- Mastered terms count
- Current and longest streak
- Achievement cards

### Debug Screen
- **Error Logs Tab**: View all errors with timestamps, stack traces, and context
  - Tap any error to copy full details to clipboard
  - "Copy All" button to copy all errors at once
  - Smart timestamps (e.g., "5m ago", "Just now")
  - Color-coded by severity (Error = red, Warning = yellow)
- **Storage Tab**: Inspect AsyncStorage data
  - View all storage keys
  - Tap any key to view its value
  - Clear all storage (with confirmation)
- **State Tab**: Live app state inspection
  - View loaded terms count
  - See user progress entries
  - Check current streak
  - Preview sample terms
- **Error Count Badge**: Debug tab icon shows red badge with error count
- **Real-time Updates**: Auto-refreshes every 2 seconds

## Data Persistence

All data is stored locally using AsyncStorage:
- `@vocab_app:terms` - Medical terms
- `@vocab_app:user_progress` - Study progress per term
- `@vocab_app:streak` - Streak tracking data

## Error Handling & Debugging

The app has comprehensive debugging features built-in:

### Error Logging System
- **Automatic Capture**: All errors, warnings, and console output are logged
- **Persistent Storage**: Errors saved to AsyncStorage (max 50 recent logs)
- **Stack Traces**: Full stack traces with preserved function/class names
- **Component Context**: Shows which component caused the error

### Debug Tab Features
- **In-App Error Viewer**: See all errors without needing a laptop
- **One-Tap Copy**: Copy any error or all errors to clipboard
- **Smart Filtering**: Separate tabs for Logs, Storage, and State
- **Real-time Monitoring**: Errors appear instantly with toast notifications

### Development Tools
Use these batch files for enhanced debugging:

#### `debug-mode.bat` (Recommended)
Launches the app with maximum debugging enabled:
- Verbose Metro bundler output
- Clear cache on startup
- Enhanced error messages
- Source maps enabled
- Shows all debug features available

#### `start-android.bat`
Standard startup with:
- ADB connection verification
- Emulator readiness check
- Metro bundler with --clear and --dev-client flags

#### `show-errors.bat`
Quick utility to check if Metro is running and remind you about the Debug tab

### Error Notifications in DEV Mode
- Toast notifications appear at top of screen when errors occur
- Tap toast to navigate directly to Debug tab
- Toasts auto-dismiss after 5 seconds
- Only active in development mode (`__DEV__`)

### ErrorBoundary
- Wraps entire app to catch React component errors
- Shows user-friendly error screen with full details
- Logs errors to Debug tab automatically
- "Try Again" button to reset and continue

### Best Practices for Debugging
1. **Use the Debug Tab First**: Easiest way to see errors on Android emulator
2. **Tap to Copy**: Copy errors from Debug tab, paste into messages/notes
3. **Check Error Count Badge**: Debug tab icon shows red badge with error count
4. **Use debug-mode.bat**: Start development with `debug-mode.bat` for best experience
5. **Toast Notifications**: Watch for error toasts during development

## Adding More Terms

To add more medical terms:

1. Open `src/data/sampleTerms.ts`
2. Add new term objects following the MedicalTerm interface
3. Terms will automatically appear in the app

## Known Issues

None currently!

If you encounter errors:
1. Check the Debug tab in the app (bug icon at bottom)
2. Copy the error using the tap-to-copy feature
3. Clear Metro cache: `npx expo start --clear`
4. Restart the emulator if needed

## Future Enhancements

- [ ] Spaced repetition algorithm
- [ ] Custom term collections
- [ ] Quiz modes
- [ ] Study reminders
- [ ] Dark mode
- [ ] Cloud sync (optional)
- [ ] More medical terms (100+)

## Development Notes

### Critical: React Version
This app MUST use React 18.2.0. React 19 has compatibility issues with React Navigation and other dependencies.

### Testing
- Test on real device for best experience
- Swipe gestures work better on physical devices
- Audio pronunciation requires device speakers

### Performance
- All images and icons are optimized
- Minimal re-renders with Zustand
- Efficient AsyncStorage operations

## 🤖 Autonomous Testing & Debugging

This app includes a **complete autonomous testing system** that allows Claude (AI assistant) to test and debug without manual copy/paste!

### For Claude
See **[CLAUDE-AUTONOMOUS-TESTING.md](./CLAUDE-AUTONOMOUS-TESTING.md)** for complete documentation.

Quick commands:
```bash
# Check app status
./check-app-status.sh

# Monitor in real-time
./monitor-app.sh

# Extract errors
node extract-errors.js
```

### For Developers
The app includes powerful debugging tools:

**Debug Screen Features:**
- ✅ Real-time error logging
- ✅ Error count badge on Debug tab
- ✅ Copy error button for easy sharing
- ✅ Timestamp formatting
- ✅ Error type filtering

**Development Tools:**
- 📱 `monitor-app.sh` - Real-time Android logcat monitoring
- 🔍 `check-app-status.sh` - Quick health check
- 📊 `extract-errors.js` - Detailed error extraction
- 🛠️ Enhanced Metro bundler logging

**Error Logger Enhancement:**
- Outputs structured errors to console in DEV mode
- Easy-to-grep format: `🏥 [VOCAB_APP_ERROR]`
- Appears in both AsyncStorage and Android logcat
- Automatic toast notifications for errors

### Debugging Workflow
1. Run `./check-app-status.sh` to verify environment
2. Start monitoring with `./monitor-app.sh` in background
3. Make code changes
4. See results immediately in monitor
5. Verify fixes with `./check-app-status.sh`

See full documentation in **[DEBUGGING-GUIDE.md](./DEBUGGING-GUIDE.md)** and **[CLAUDE-AUTONOMOUS-TESTING.md](./CLAUDE-AUTONOMOUS-TESTING.md)**.

## License

MIT

## Credits

Built following best practices from:
- React Native documentation
- Expo documentation
- React Navigation guides
- Zustand state management patterns

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: Production Ready ✅
