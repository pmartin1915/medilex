#!/bin/bash

################################################################################
# monitor-app.sh - Unified monitoring for Healthcare Vocab App (Linux/Mac)
################################################################################
# This script monitors Android logcat for app-specific logs
# Claude can run this in background and read all app output automatically
################################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         Healthcare Vocab App - Unified Monitor                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo
echo "This monitor shows:"
echo "  • Android Logcat (filtered for app)"
echo "  • App error logs with 🏥 [VOCAB_APP_ERROR] prefix"
echo "  • React Native JavaScript errors"
echo
echo "Claude can read this output to test and debug autonomously!"
echo
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Check if ADB is available
if ! command -v adb &> /dev/null; then
    echo -e "${RED}[ERROR] ADB not found. Install Android SDK Platform-Tools.${NC}"
    echo "        Android logs will not be available."
    exit 1
fi

# Check if device is connected
if ! adb devices | grep -E "emulator|device" &> /dev/null; then
    echo -e "${YELLOW}[WARNING] No Android device/emulator detected.${NC}"
    echo "          Please start your emulator first."
    exit 1
fi

echo -e "${GREEN}[✓] ADB connected${NC}"
echo -e "${GREEN}[✓] Device detected${NC}"
echo

# Clear old logcat
adb logcat -c 2>/dev/null

echo "Starting monitoring... Press Ctrl+C to stop"
echo
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo -e "${BLUE}[📱 ANDROID LOGCAT - Filtered for Vocab App]${NC}"
echo
echo "Monitoring for:"
echo "  • 🏥 [VOCAB_APP_ERROR] - Our structured app errors"
echo "  • ReactNativeJS - JavaScript logs"
echo "  • Errors, Exceptions, Fatal crashes"
echo
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Stream logcat with filtering and colorization
adb logcat -v time | while IFS= read -r line; do
    # Color code different log types
    if echo "$line" | grep -q "VOCAB_APP_ERROR"; then
        echo -e "${YELLOW}$line${NC}"
    elif echo "$line" | grep -qi "ERROR\|Exception"; then
        echo -e "${RED}$line${NC}"
    elif echo "$line" | grep -qi "FATAL"; then
        echo -e "${RED}${line}${NC}"
    elif echo "$line" | grep -q "ReactNativeJS"; then
        echo -e "${CYAN}$line${NC}"
    fi
done
