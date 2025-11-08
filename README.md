# Healthcare Vocab App (Medilex)

A mobile flashcard application for learning medical terminology, built with React Native and Expo.

## Features

- **4-Tab Navigation**: Home, Learn, Library, Progress
- **Swipeable Flashcards**: Study medical terms with intuitive swipe gestures
- **Streak Tracking**: 7-day visual streak calendar
- **Progress Analytics**: Track accuracy, mastered terms, and study sessions
- **Audio Pronunciation**: Hear correct pronunciation of medical terms
- **Search & Filter**: Find terms quickly in the library
- **Offline-First**: All data stored locally with AsyncStorage
- **Error Handling**: Comprehensive error boundaries and try-catch blocks

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
│   ├── MedicalTermCard.tsx
│   ├── StreakCalendar.tsx
│   ├── SwipeableCard.tsx
│   ├── PrimaryButton.tsx
│   ├── ProgressIndicator.tsx
│   └── SearchBar.tsx
├── screens/            # Main app screens
│   ├── HomeScreen.tsx
│   ├── LearnScreen.tsx
│   ├── LibraryScreen.tsx
│   └── ProgressScreen.tsx
├── store/              # Zustand state management
│   ├── wordStore.ts
│   └── streakStore.ts
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

## Data Persistence

All data is stored locally using AsyncStorage:
- `@vocab_app:terms` - Medical terms
- `@vocab_app:user_progress` - Study progress per term
- `@vocab_app:streak` - Streak tracking data

## Error Handling

- ErrorBoundary wraps entire app
- Try-catch blocks in all async operations
- Console logging for debugging
- User-friendly error messages

## Adding More Terms

To add more medical terms:

1. Open `src/data/sampleTerms.ts`
2. Add new term objects following the MedicalTerm interface
3. Terms will automatically appear in the app

## Known Issues

None currently! 🎉

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
