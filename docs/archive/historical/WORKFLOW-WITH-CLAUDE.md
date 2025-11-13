# 🤖 Working with Claude Code - Error Monitoring Workflow

This guide shows you how to work efficiently with Claude Code (me!) to fix errors in your app.

---

## 🎯 The Two-Terminal Setup

This is the **easiest and fastest** way to develop with Claude Code helping you.

### Terminal 1: Run Your App

```powershell
cd D:\Medilex\HealthcareVocabApp
.\quick-start.bat
```

**Leave this running!** This is your Metro bundler.

### Terminal 2: Monitor Errors

```powershell
cd D:\Medilex\HealthcareVocabApp
.\monitor-app.bat
```

**Watch this terminal for errors!**

---

## 🔍 When You See an Error

### In Terminal 2 (monitor-app.bat), you'll see:

```
🏥 [VOCAB_APP_ERROR] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 [VOCAB_APP_ERROR] Type: ERROR
🏥 [VOCAB_APP_ERROR] Time: 2:34:56 PM
🏥 [VOCAB_APP_ERROR] Context: LearnScreen
🏥 [VOCAB_APP_ERROR] Message: Cannot read property 'map' of undefined
🏥 [VOCAB_APP_ERROR] Stack: at LearnScreen.tsx:45:12
🏥 [VOCAB_APP_ERROR] ID: 1738999123456_abc123xyz
🏥 [VOCAB_APP_ERROR] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### What to Do:

**Option 1: Copy the Error Block**
1. Select all lines between the `━━━` separators
2. Copy (Ctrl+C)
3. Paste in Claude Code chat
4. Say: "Fix this error"

**Option 2: Quick Copy Just the Important Parts**
Copy just these lines:
```
Message: Cannot read property 'map' of undefined
Stack: at LearnScreen.tsx:45:12
```

**Option 3: Use the In-App Debug Screen**
1. Open your app on the emulator
2. Go to the "Debug" tab
3. Click "Copy Error" button
4. Paste in Claude Code

---

## 💬 Example Conversation

### You:
```
I see this error:

🏥 [VOCAB_APP_ERROR] Message: Cannot read property 'map' of undefined
🏥 [VOCAB_APP_ERROR] Stack: at LearnScreen.tsx:45:12

Can you fix it?
```

### Claude Code (Me):
```
I can see the issue! In LearnScreen.tsx line 45, you're trying to
call .map() on something that's undefined. Let me fix that by adding
a null check...

[I'll make the fix and commit it]

Try running the app again - the error should be gone!
```

---

## ⚡ The Fast Fix Loop

1. **You:** Run `.\quick-start.bat` and `.\monitor-app.bat`
2. **You:** See an error in Terminal 2
3. **You:** Copy error, paste to me
4. **Me:** Read the error, find the issue, fix the code
5. **You:** Save triggers hot reload (2-3 seconds)
6. **You:** Check Terminal 2 - error gone!
7. **Repeat** as needed

**Average fix time:** 30 seconds to 2 minutes

---

## 🎯 What Makes This Fast

### Traditional Debugging:
1. See error on phone ❌ Hard to copy
2. Type it out manually ❌ Slow
3. Search for file ❌ Time consuming
4. Figure out fix ❌ Thinking time
5. Test ❌ Redeploy app

**Total: 5-15 minutes per error**

### With This Setup:
1. See error in Terminal 2 ✅ Copy/paste ready
2. Paste to Claude Code ✅ Instant
3. I read error & find file ✅ Automatic
4. I figure out & apply fix ✅ Seconds
5. Hot reload ✅ 2-3 seconds

**Total: 30 seconds to 2 minutes per error**

---

## 🔧 Alternative: In-App Error Viewing

If you prefer not to use Terminal 2:

1. Just run `.\quick-start.bat` (Terminal 1 only)
2. When something breaks, open the **Debug** tab in the app
3. See all errors listed there
4. Click "Copy Error" button
5. Paste to me

**Pros:**
- Don't need second terminal
- Visual UI for errors
- Copy button is convenient

**Cons:**
- Have to open app and navigate to Debug tab
- Not real-time (have to check manually)

---

## 📋 Quick Reference: Terminal 2 Error Format

Every error has this structure:

```
🏥 [VOCAB_APP_ERROR] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 [VOCAB_APP_ERROR] Type: ERROR | WARN | INFO
🏥 [VOCAB_APP_ERROR] Time: HH:MM:SS
🏥 [VOCAB_APP_ERROR] Context: Which component/file
🏥 [VOCAB_APP_ERROR] Message: What went wrong
🏥 [VOCAB_APP_ERROR] Stack: Where it happened
🏥 [VOCAB_APP_ERROR] ID: Unique error ID
🏥 [VOCAB_APP_ERROR] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**The `🏥` emoji makes it super easy to find and copy!**

---

## 💡 Pro Tips

### For You:

1. **Keep both terminals visible** side-by-side
2. **Watch Terminal 2** while testing features
3. **Copy errors immediately** when they appear
4. **Use VS Code's terminal** for both if you prefer
5. **Leave emulator running** between sessions

### For Me (Claude Code):

1. I can **read the exact file and line** from Stack
2. I can **understand context** from Context field
3. I can **fix and commit** changes immediately
4. I can **verify the fix** by checking Terminal 2 output
5. I can **iterate quickly** if the first fix doesn't work

---

## 🚀 Ready to Try?

### Right Now:

1. **Open PowerShell Terminal 1:**
   ```powershell
   cd D:\Medilex\HealthcareVocabApp
   .\quick-start.bat
   ```

2. **Open PowerShell Terminal 2:**
   ```powershell
   cd D:\Medilex\HealthcareVocabApp
   .\monitor-app.bat
   ```

3. **Use your app on the emulator**
   - Try all the features
   - See if any errors appear in Terminal 2

4. **If you see an error:**
   - Copy the `🏥` block
   - Paste it to me
   - I'll fix it!

---

## ✅ This Makes Us a Great Team

**You handle:**
- Testing features
- Finding edge cases
- Spotting visual issues
- User experience feedback

**I handle:**
- Reading errors
- Finding root causes
- Writing fixes
- Verifying solutions

**Together:** We build a solid, bug-free app! 🎉

---

**Questions about this workflow?** Just ask! I'm here to help.
