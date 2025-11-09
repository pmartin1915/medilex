# Healthcare Vocabulary App - TODO

## 🔴 HIGH PRIORITY

### TikTok-Style UI Polish
- [ ] Test all platforms (iOS, Android, Web)
  - [ ] Verify swipe gestures work smoothly
  - [ ] Test all 5 action buttons
  - [ ] Test Share on each platform
  - [ ] Check button visibility on small screens
  - [ ] Verify animations are smooth
- [ ] Add gesture enhancements
  - [ ] Add visual feedback during swipe (card preview?)
  - [ ] Add haptic feedback on button presses
  - [ ] Add button press animations (scale effect)
  - [ ] Consider making threshold configurable

### Error Handling
- [ ] Add error handling to Speech synthesis
  - Try/catch on `Speech.speak()`
  - Show user-friendly error message
- [ ] Add error handling to AsyncStorage operations
  - Handle storage quota exceeded
  - Handle corrupted data
  - Provide fallback behavior
- [ ] Add error handling to Zustand stores
  - Validate state updates
  - Handle undefined/null data
- [ ] Global error boundary component
  - Catch React errors
  - Show recovery UI

### Loading States
- [ ] Add initial app loading screen
  - Splash screen transition
  - Data loading indicator
- [ ] Add loading states for data persistence
  - Saving progress indicator
  - Saving favorites/bookmarks feedback
- [ ] Add screen transition loading
  - Skeleton screens for ReviewScreen
  - Loading indicators for ProgressScreen

### Input Validation
- [ ] Handle empty term list gracefully
  - Show empty state UI
  - Prevent app crashes
- [ ] Validate progress data structure
  - Check for corrupted AsyncStorage
  - Migrate old data formats
- [ ] Handle edge cases in LearnScreen
  - No terms available
  - All terms completed
  - Single term in deck

---

## 🟡 MEDIUM PRIORITY

### UX Improvements
- [ ] Add "Undo" feature for last swipe
  - Store swipe history
  - Show undo button
  - Restore previous state
- [ ] Add confirmation dialogs
  - Before resetting progress
  - Before clearing favorites
- [ ] Empty states for all screens
  - No bookmarks message
  - No favorites message
  - Completed all terms celebration
- [ ] Tutorial/onboarding for NEW gesture system
  - First-time user guide (TikTok-style)
  - Show button functions on first launch
  - Gesture hints overlay
  - Skip/don't show again option

### Performance
- [ ] Optimize SwipeableCard re-renders
  - Memoize components
  - Use React.memo where appropriate
- [ ] Optimize ActionButtons re-renders
  - Only re-render on state changes
- [ ] Optimize large term lists
  - Consider virtualization for ReviewScreen
  - Lazy load term data
- [ ] Profile performance on older devices
  - Test on slower hardware
  - Optimize animations

### Accessibility
- [ ] Add screen reader support
  - Label all interactive elements
  - Announce swipe actions
  - Provide alternative to swipe gestures
- [ ] Add keyboard navigation (Web)
  - Arrow keys for navigation
  - Space/Enter for actions
- [ ] Support high contrast mode
  - Check color contrast ratios
  - Provide high contrast theme
- [ ] Support dynamic font scaling
  - Test with large text sizes
  - Ensure layout doesn't break

---

## 🟢 LOW PRIORITY

### Testing
- [ ] Set up Jest for unit tests
  - Test store logic
  - Test utility functions
- [ ] Set up E2E testing (Detox)
  - Test main user flows
  - Test on multiple devices
- [ ] Add manual testing checklist
  - QA before releases
  - Platform-specific checks

### Code Quality
- [ ] Extract magic numbers to constants
  - Swipe thresholds
  - Animation durations
  - Color values
- [ ] Add JSDoc comments to complex functions
- [ ] Consistent error handling patterns
- [ ] TypeScript strict mode
  - Fix any `any` types
  - Ensure proper type coverage

### Developer Experience
- [ ] Add development documentation
  - Component API docs
  - State management guide
  - Adding new terms guide
- [ ] Improve helper scripts
  - Add more troubleshooting options
  - Better error messages
- [ ] Pre-commit hooks
  - Linting
  - Type checking
  - Format checking

---

## 🚀 FUTURE FEATURES

### Before App Store Launch
- [ ] Production build configuration
  - App icons (all sizes)
  - Splash screens
  - App name and bundle ID
- [ ] Privacy policy and terms
- [ ] App store screenshots
  - iOS screenshots (multiple sizes)
  - Android screenshots
- [ ] App store descriptions
  - Engaging copy
  - Keywords for ASO
- [ ] Beta testing phase
  - TestFlight (iOS)
  - Google Play Beta (Android)
  - Gather feedback

### Nice-to-Have Features
- [ ] Custom term sets
  - User-created decks
  - Import/export terms
- [ ] Statistics enhancements
  - Detailed progress charts
  - Learning analytics
- [ ] Cloud sync
  - Cross-device progress
  - Account system
- [ ] Social features
  - Share progress
  - Compete with friends
- [ ] More content
  - Additional medical term sets
  - Different specialties
  - Difficulty levels

---

## 📝 Completed

- [x] Vertical swipe navigation (UP=next, DOWN=previous)
- [x] Horizontal swipe evaluation (LEFT=don't know, RIGHT=know) - DEPRECATED
- [x] Footer indicators for swipe controls
- [x] Android troubleshooting scripts
- [x] Metro cache helper scripts
- [x] Project context documentation
- [x] **TikTok-style redesign (MAJOR UPDATE - 2025-11-09)**
  - [x] Remove horizontal swipes
  - [x] Add ActionButtons component (5 buttons)
  - [x] Vertical-only swipe gestures
  - [x] Share functionality with React Native Share API
  - [x] Rolling animation effect (smooth vertical sliding)
  - [x] Button color coding (green, red, pink, amber, teal)
  - [x] Reduce card width for button space
  - [x] Update LearnScreen layout

---

## 📋 Notes

**Before Starting Work:**
1. Read `.claude/PROJECT_CONTEXT.md`
2. Test current state on all platforms
3. Check this TODO for priorities
4. Update TODO after completing items

**After Completing Item:**
- Move to "Completed" section
- Update PROJECT_CONTEXT.md if significant
- Test on iOS, Android, and Web
- Commit with clear message

**Priority Order:**
1. Fix broken features (high priority bugs)
2. Add critical missing features (error handling, loading)
3. Polish and UX improvements
4. Testing and quality
5. Future features and nice-to-haves

---

*Last Updated: 2025-11-09 (TikTok-style redesign complete!)*
