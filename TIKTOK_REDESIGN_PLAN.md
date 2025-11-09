# TikTok-Style Learn Screen Redesign Plan

## 🎯 Goal
Redesign the Learn screen to emulate TikTok's interface:
- Vertical-only swiping (UP = next, DOWN = previous)
- Action buttons stacked vertically on the right side
- Modern, intuitive UX

---

## 📋 Current State Analysis

### Current Behavior:
- **Horizontal swipes**: LEFT = Don't Know, RIGHT = Know It (evaluates progress)
- **Vertical swipes**: UP = next, DOWN = previous (no evaluation)
- **Buttons**: Heart and Bookmark at bottom of card (inside card component)
- **Footer**: Text indicators for swipe directions

### Current Components:
1. **SwipeableCard.tsx**: Handles both horizontal and vertical swipes
2. **LearnScreen.tsx**: Orchestrates swipe handlers and card display
3. **MedicalTermCard.tsx**: Shows term content + bottom actions (Heart, Bookmark)

---

## 🎨 New Design (TikTok-Style)

### Layout:
```
┌─────────────────────────────────────┐
│  [Progress: 1/50]                   │
│                                     │
│  ┌──────────────────┐              │
│  │                  │  ┏━━━━━┓     │
│  │                  │  ┃  👍  ┃ Know it
│  │   Medical Term   │  ┗━━━━━┛     │
│  │      Card        │               │
│  │                  │  ┏━━━━━┓     │
│  │                  │  ┃  ✕  ┃ Don't know
│  │                  │  ┗━━━━━┛     │
│  │                  │               │
│  │                  │  ┏━━━━━┓     │
│  │                  │  ┃  🔖  ┃ Bookmark
│  │  Swipe ↑ Next   │  ┗━━━━━┛     │
│  │  Swipe ↓ Prev   │               │
│  │                  │  ┏━━━━━┓     │
│  └──────────────────┘  ┃  ↗️  ┃ Share
│                         ┗━━━━━┛     │
└─────────────────────────────────────┘
```

### Swipe Behavior:
- **Swipe UP**: Navigate to next card (no evaluation)
- **Swipe DOWN**: Navigate to previous card (no evaluation)
- **No horizontal swipes**: Disabled entirely

### Button Actions:
1. **Know It** (ThumbsUp icon, green)
   - Marks term as known
   - Animates card away
   - Auto-advances to next card

2. **Don't Know** (X icon, red)
   - Marks term as unknown
   - Animates card away
   - Auto-advances to next card

3. **Bookmark** (Bookmark icon, yellow)
   - Toggles bookmark state
   - No navigation, stays on card
   - Visual feedback (filled/unfilled)

4. **Share** (Share2 icon, blue) **NEW**
   - Opens native share sheet
   - Shares term name + definition
   - No navigation

---

## 🔧 Implementation Steps

### Step 1: Create ActionButtons Component
**File**: `src/components/ActionButtons.tsx`

**Features**:
- Four circular buttons stacked vertically
- Icons from lucide-react-native
- Proper spacing and sizing
- Color coding per action
- Press animations
- Accessibility labels

**Props**:
```typescript
interface Props {
  onKnowIt: () => void;
  onDontKnow: () => void;
  onBookmark: () => void;
  onShare: () => void;
  isBookmarked: boolean;
}
```

**Styling**:
- Button size: 56x56px (good touch target)
- Spacing between buttons: 16px
- Position: absolute, right: 16px, centered vertically
- Background: white with shadow
- Active state: scale animation
- Icon size: 28px

### Step 2: Update SwipeableCard Component
**File**: `src/components/SwipeableCard.tsx`

**Changes**:
- Remove all horizontal swipe logic
- Keep only vertical swipe detection
- Simplify gesture handler
- Remove rotation animation (only horizontal needed rotation)
- Keep vertical translation animation

**Before**:
- Detects horizontal vs vertical
- Handles 4 directions

**After**:
- Only detects vertical
- Handles 2 directions (up/down)

### Step 3: Implement Share Functionality
**Location**: `src/screens/LearnScreen.tsx`

**Use React Native's Share API**:
```typescript
import { Share } from 'react-native';

const handleShare = async () => {
  try {
    await Share.share({
      message: `${currentTerm.term}: ${currentTerm.definition}`,
      title: currentTerm.term,
    });
  } catch (error) {
    // Handle error gracefully
  }
};
```

### Step 4: Update LearnScreen
**File**: `src/screens/LearnScreen.tsx`

**Changes**:
1. Remove `handleSwipeLeft` and `handleSwipeRight`
2. Add button handlers:
   - `handleKnowIt()` - evaluates as known, advances
   - `handleDontKnow()` - evaluates as unknown, advances
   - `handleBookmark()` - toggles bookmark (existing)
   - `handleShare()` - shares term (new)
3. Remove horizontal swipe props from SwipeableCard
4. Add ActionButtons component to layout
5. Pass MedicalTermCard with `showActions={false}` (hide bottom actions)
6. Update footer text (or remove it)

**Layout Structure**:
```tsx
<View style={styles.container}>
  <ProgressIndicator />

  <View style={styles.contentContainer}>
    <SwipeableCard
      onSwipeUp={handleSwipeUp}
      onSwipeDown={handleSwipeDown}
    >
      <MedicalTermCard
        term={currentTerm}
        showActions={false}  {/* Hide bottom actions */}
      />
    </SwipeableCard>

    <ActionButtons
      onKnowIt={handleKnowIt}
      onDontKnow={handleDontKnow}
      onBookmark={handleBookmark}
      onShare={handleShare}
      isBookmarked={progress?.isBookmarked}
    />
  </View>
</View>
```

### Step 5: Update Styling
**Considerations**:
- ActionButtons need absolute positioning
- Ensure buttons don't overlap with card on small screens
- Card might need slightly reduced width to accommodate buttons
- Test on various screen sizes

---

## ✅ Testing Checklist

### Functionality:
- [ ] Swipe up advances to next card
- [ ] Swipe down goes to previous card
- [ ] Cannot swipe down on first card
- [ ] Cannot swipe up on last card (shows completion)
- [ ] Know It button marks as known and advances
- [ ] Don't Know button marks as unknown and advances
- [ ] Bookmark button toggles state (stays on card)
- [ ] Share button opens share sheet with correct content
- [ ] Animations are smooth
- [ ] No horizontal swipe triggers anything

### Visual:
- [ ] Buttons are clearly visible
- [ ] Buttons don't overlap card content
- [ ] Icons are recognizable
- [ ] Color coding is intuitive
- [ ] Layout works on small screens (iPhone SE)
- [ ] Layout works on large screens (iPad)

### Platform-Specific:
- [ ] iOS: Share sheet works correctly
- [ ] iOS: Swipe gestures feel natural
- [ ] Android: Share intent works correctly
- [ ] Android: Buttons are touch-responsive
- [ ] Web: Mouse drag for swipe works
- [ ] Web: Share API or fallback works

---

## 🎨 Design Decisions

### Button Colors:
1. **Know It** (ThumbsUp): `theme.colors.success` (#8FAC8E - green)
2. **Don't Know** (X): `theme.colors.error` (#D17B6F - red)
3. **Bookmark**: `theme.colors.bookmark` (#E8B66B - yellow/amber)
4. **Share**: `theme.colors.info` (#7BAAA5 - teal)

### Icons (from lucide-react-native):
- `ThumbsUp` - Know It
- `X` - Don't Know
- `Bookmark` - Save (already imported)
- `Share2` - Share

### Animation Timing:
- Button press: 100ms scale to 0.9
- Card swipe away: 250ms (existing)
- Vertical swipe threshold: 50px (existing)

---

## 🚨 Potential Issues & Solutions

### Issue 1: Buttons overlap with card on small screens
**Solution**:
- Reduce card width by 80px (to account for button space)
- Adjust card margins dynamically

### Issue 2: Share doesn't work on web
**Solution**:
- Check if Share API is available: `Share.share.isAvailable`
- Fallback: Copy to clipboard or show modal with shareable text

### Issue 3: Users might miss horizontal swipe (muscle memory)
**Solution**:
- Show brief tutorial on first launch
- Animate buttons subtly to draw attention
- Quick "tap buttons or swipe up/down" hint

### Issue 4: Bookmark button behavior differs (doesn't advance)
**Solution**:
- This is intentional and matches TikTok behavior
- Consider adding subtle confirmation (haptic + icon animation)

---

## 📝 Files to Modify

1. ✏️ **CREATE**: `src/components/ActionButtons.tsx` (new component)
2. ✏️ **MODIFY**: `src/components/SwipeableCard.tsx` (remove horizontal swipes)
3. ✏️ **MODIFY**: `src/screens/LearnScreen.tsx` (new layout + handlers)
4. ✏️ **MODIFY**: `src/components/MedicalTermCard.tsx` (optional: adjust for reduced width)

---

## 🎯 Success Criteria

✅ Swipe gestures work smoothly (vertical only)
✅ All four buttons functional
✅ Share feature works on all platforms
✅ UI looks polished and professional
✅ No regressions in existing features
✅ Tested on iOS, Android, and Web
✅ Documentation updated (PROJECT_CONTEXT.md, TODO.md)

---

*Ready to implement? Let's start with Step 1: Creating the ActionButtons component.*
