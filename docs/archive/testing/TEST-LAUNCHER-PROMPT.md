# Test and Fix LAUNCH.bat - AI Prompt

```
Hi! I need you to test and fix LAUNCH.bat in my Healthcare Vocab App.

PROJECT: D:\Medilex\HealthcareVocabApp

ISSUE: LAUNCH.bat crashes when selecting option [2] (iOS - QR Code)

YOUR TASK:
1. Read LAUNCH.bat
2. Identify the crash issue in option [2]
3. Test each option by reading the code logic
4. Fix any bugs you find
5. Make it robust and error-proof

TESTING APPROACH:
- Read the .bat file code
- Check for syntax errors
- Verify all paths and commands
- Look for missing error handling
- Check for infinite loops or missing gotos
- Ensure all options return to menu properly

COMMON BAT FILE ISSUES TO CHECK:
- Missing "goto MENU" at end of sections
- Incorrect label names
- Commands that hang without timeout
- Missing error handling for failed commands
- Processes that don't terminate properly

FIX REQUIREMENTS:
- All options must return to menu (not crash/exit)
- Add error handling for failed commands
- Add timeouts for long-running processes
- Test that Ctrl+C in subprocesses returns to menu
- Ensure clean exit on option [0]

AFTER FIXING:
1. Commit changes with clear message
2. Push to git
3. Update PROMPT-FOR-NEXT-AI.md with status
4. Create summary of what was broken and how you fixed it

ENVIRONMENT:
- Windows 10/11
- PowerShell/CMD
- Project: D:\Medilex\HealthcareVocabApp
- Git branch: claude/healthcare-vocabulary-app-011CUxCkrQVpukro5FXMKfVQ

START HERE:
Read LAUNCH.bat and identify the crash in option [2].
```
