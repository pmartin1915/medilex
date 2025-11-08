#!/bin/bash

################################################################################
# check-app-status.sh - Quick health check for Healthcare Vocab App
################################################################################
# Claude can run this to quickly verify app status without user intervention
################################################################################

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           Healthcare Vocab App - Status Check                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo

# Check 1: ADB connectivity
echo -e "${BLUE}[1/5] Checking ADB...${NC}"
if command -v adb &> /dev/null; then
    echo -e "${GREEN}  ✓ ADB is installed${NC}"
else
    echo -e "${RED}  ✗ ADB not found${NC}"
    exit 1
fi

# Check 2: Device connection
echo -e "${BLUE}[2/5] Checking device connection...${NC}"
DEVICE_COUNT=$(adb devices | grep -E "emulator|device" | grep -v "List" | wc -l)
if [ "$DEVICE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}  ✓ Device connected ($DEVICE_COUNT device(s))${NC}"
    adb devices | grep -E "emulator|device" | grep -v "List" | while read -r line; do
        echo -e "${GRAY}    → $line${NC}"
    done
else
    echo -e "${RED}  ✗ No device connected${NC}"
    echo -e "${YELLOW}    Run: emulator @your_avd_name${NC}"
    exit 1
fi

# Check 3: Metro bundler
echo -e "${BLUE}[3/5] Checking Metro bundler...${NC}"
METRO_PORT=8081
if curl -s "http://localhost:$METRO_PORT/status" | grep -q "packager-status:running" 2>/dev/null; then
    echo -e "${GREEN}  ✓ Metro bundler is running (port $METRO_PORT)${NC}"
else
    echo -e "${YELLOW}  ⚠ Metro bundler not detected${NC}"
    echo -e "${GRAY}    This might be OK if running in production mode${NC}"
fi

# Check 4: Recent errors in logcat
echo -e "${BLUE}[4/5] Checking for recent errors...${NC}"
adb logcat -d -v time | tail -100 > /tmp/recent_logcat.txt
ERROR_COUNT=$(grep -i "VOCAB_APP_ERROR\|Exception\|FATAL" /tmp/recent_logcat.txt | wc -l)

if [ "$ERROR_COUNT" -eq 0 ]; then
    echo -e "${GREEN}  ✓ No recent errors found${NC}"
else
    echo -e "${YELLOW}  ⚠ Found $ERROR_COUNT potential error(s) in last 100 log lines${NC}"
    echo -e "${GRAY}    Recent errors:${NC}"
    grep -i "VOCAB_APP_ERROR\|Exception\|FATAL" /tmp/recent_logcat.txt | tail -3 | while read -r line; do
        echo -e "${GRAY}    $(echo $line | cut -c1-80)${NC}"
    done
fi

# Check 5: App-specific logs
echo -e "${BLUE}[5/5] Checking app-specific logs...${NC}"
APP_LOG_COUNT=$(grep "VOCAB_APP_ERROR" /tmp/recent_logcat.txt | wc -l)
if [ "$APP_LOG_COUNT" -gt 0 ]; then
    echo -e "${CYAN}  ℹ Found $APP_LOG_COUNT app error log(s)${NC}"
    echo -e "${GRAY}    Most recent app error:${NC}"
    grep "VOCAB_APP_ERROR" /tmp/recent_logcat.txt | tail -1 | while read -r line; do
        echo -e "${YELLOW}    $(echo $line | cut -c1-80)${NC}"
    done
else
    echo -e "${GREEN}  ✓ No app-specific errors logged${NC}"
fi

echo
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}📊 Summary${NC}"
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

if [ "$ERROR_COUNT" -eq 0 ] && [ "$DEVICE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓ App appears healthy!${NC}"
    echo
    echo -e "${GRAY}Next steps for Claude:${NC}"
    echo -e "${GRAY}  • Run ./monitor-app.sh to watch real-time logs${NC}"
    echo -e "${GRAY}  • Run node extract-errors.js for detailed error analysis${NC}"
    echo -e "${GRAY}  • Make code changes and test immediately${NC}"
else
    echo -e "${YELLOW}⚠ Issues detected - review errors above${NC}"
    echo
    echo -e "${GRAY}Debugging tools:${NC}"
    echo -e "${GRAY}  • Run ./monitor-app.sh for real-time monitoring${NC}"
    echo -e "${GRAY}  • Run node extract-errors.js for error extraction${NC}"
    echo -e "${GRAY}  • Check the Debug tab in the app${NC}"
fi

echo
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Clean up
rm -f /tmp/recent_logcat.txt
