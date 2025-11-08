# 🎯 START HERE - Healthcare Vocab App

**You're in the right place!** This guide tells you exactly what to do.

---

## 🚀 To Run Your App

**One command does everything:**

```powershell
.\quick-start.bat
```

That's it! This will:
- ✅ Launch the Android emulator (if not running)
- ✅ Wait for it to boot completely
- ✅ Fix ADB connection issues
- ✅ Start Metro bundler
- ✅ Install and launch the app

**First time?** Takes 2-3 minutes. **Subsequent runs?** 30-60 seconds.

---

## 🐛 To See Errors in Real-Time

Open a **second PowerShell terminal** and run:

```powershell
.\monitor-app.bat
```

**You'll see:**
- Live errors with `🏥 [VOCAB_APP_ERROR]` prefix
- React Native JavaScript errors
- App crashes

**When you see an error:** Just copy the lines with `🏥` and paste them to Claude Code!

**📖 Want to optimize your workflow?** Read **[WORKFLOW-WITH-CLAUDE.md](./WORKFLOW-WITH-CLAUDE.md)** for the complete guide on working efficiently with Claude Code.

---

## 📋 Scripts Quick Reference

| Script | What It Does | When to Use |
|--------|-------------|-------------|
| **`quick-start.bat`** | 🎯 **START HERE** - Does everything | Every time |
| `monitor-app.bat` | Shows errors in real-time | When debugging |
| `check-app-status.bat` | Quick health check | Verify setup is working |
| `start-android.bat` | Just start app (assumes emulator running) | Restart after crash |
| `launch-emulator.bat` | Just launch emulator | Manual control |

**99% of the time, just use `quick-start.bat`**

---

## 📚 Documentation Quick Reference

| File | What's In It | When to Read It |
|------|-------------|-----------------|
| **`START-HERE.md`** | 🎯 **YOU ARE HERE** - Main entry point | Start here! |
| **`WORKFLOW-WITH-CLAUDE.md`** | 🤖 How to work with Claude Code | Want fast debugging |
| `HOW-TO-RUN-APP.md` | 📖 Complete step-by-step guide | Having issues? |
| `README.md` | Project overview & features | Learn about the app |
| `CLAUDE-AUTONOMOUS-TESTING.md` | How Claude tests autonomously | For Claude Code (me!) |

**Just 5 files!** Everything else is archived in `docs/archive/` (old/outdated stuff).

---

## 🔄 Typical Workflow

### Morning Startup:
```powershell
# Terminal 1:
.\quick-start.bat
# Leave this running all day

# Terminal 2 (optional, for debugging):
.\monitor-app.bat
```

### Making Code Changes:
1. Edit files in VS Code
2. Save
3. App hot-reloads automatically (2-3 seconds)
4. Errors appear in Terminal 2 if you have monitor running

### Sharing Errors with Claude Code:
**Option 1 (Easy):**
- Look at Terminal 2 (monitor-app.bat)
- Copy lines with `🏥 [VOCAB_APP_ERROR]`
- Paste to Claude Code

**Option 2 (Even Easier):**
- Open the Debug tab in the app
- Press "Copy Error" button
- Paste to Claude Code

---

## ❓ Troubleshooting

### "Something went wrong" in app

**Check Terminal 1** (Metro bundler) - error will be there.

**OR run:**
```powershell
.\monitor-app.bat
```
Then restart the app to see the error appear.

### Emulator won't start

**Check which emulators you have:**
```powershell
.\list-emulators.bat
```

### Metro port already in use

**Kill Metro and restart:**
```powershell
# Press Ctrl+C in Terminal 1
.\quick-start.bat
```

---

## 🎯 Your Next Steps

**Right now:**
1. Close this file
2. Open PowerShell in `D:\Medilex\HealthcareVocabApp`
3. Run: `.\quick-start.bat`
4. Wait 1-2 minutes
5. Your app opens on the emulator!

**If you see errors:**
1. Open another PowerShell terminal
2. Run: `.\monitor-app.bat`
3. Copy the error lines
4. Paste them to me (Claude Code)
5. I'll fix them!

---

## 💡 Pro Tips

- **Leave emulator running** between sessions - saves time
- **Use two terminals** - one for Metro, one for monitoring
- **Hot reload is automatic** - just save your files
- **Check Debug tab** in the app for all logged errors

---

**Questions?** Ask Claude Code! I can help debug any issues you see.

**Ready to code?** Run `.\quick-start.bat` and let's go! 🚀
