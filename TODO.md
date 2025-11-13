# Healthcare Vocabulary App - TODO

**Last Updated**: January 2025  
**Status**: Organized & Ready for Development  
**See Also**: [PROJECT_STATUS.md](PROJECT_STATUS.md) for complete project overview

---

## 🔴 HIGH PRIORITY

### ✅ Project Reorganization (COMPLETED - January 2025)
- [x] Create new documentation structure
- [x] Move 43+ documents to archive
- [x] Organize 26 scripts into folders
- [x] Create comprehensive guides (00-START-HERE, Development, Testing, Debugging)
- [x] Update README with new structure
- [x] Create navigation guides
- [x] Document all changes

### 🔥 IMMEDIATE PRIORITIES (Next Session)

#### 1. Verify Runtime Fix
- [ ] Test app launch: `npx expo start --clear`
- [ ] Verify no "Cannot read property 'S' of undefined" error
- [ ] Test all 5 tabs work correctly
- [ ] Check Debug tab for any errors
- [ ] Document results

#### 2. Fix Failing Tests
- [ ] Run tests: `npm test`
- [ ] Fix 31 failing tests systematically
- [ ] Focus on critical path tests first
- [ ] Update test documentation
- [ ] Target: 100% passing tests

#### 3. Increase Test Coverage
- [ ] Current: 19% → Target: 30%+
- [ ] Add tests for wordStore
- [ ] Add tests for streakStore
- [ ] Add tests for error scenarios
- [ ] Add tests for edge cases

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

### Medical Terms Expansion
- [ ] Add 25+ more medical terms
  - Current: 75 terms
  - Target: 100+ terms
  - Focus on high-value specialties
  - Maintain quality and accuracy
- [ ] Validate all new terms
  - Use Debug tab → Tests
  - Check data integrity
  - Verify no duplicates
- [ ] Update MEDICAL-TERMS-GUIDE.md
  - Document new categories
  - Update statistics
  - Add usage examples

### Platform Testing
- [ ] Test on iOS
  - Verify app launches
  - Test all features
  - Check for iOS-specific issues
  - Document any problems
- [ ] Test on Web
  - Verify web compatibility
  - Test responsive design
  - Check for web-specific issues
  - Document limitations
- [ ] Test on physical Android device
  - Performance testing
  - Gesture testing
  - Real-world usage

### Documentation Maintenance
- [ ] Keep TODO.md updated
- [ ] Update PROJECT_STATUS.md after major changes
- [ ] Archive completed documents
- [ ] Update guides when adding features
- [ ] Maintain MEDICAL-TERMS-GUIDE.md

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
