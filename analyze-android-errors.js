#!/usr/bin/env node

/**
 * analyze-android-errors.js - Advanced Android Error Analysis
 * 
 * Features:
 * - Parse logcat output for app-specific errors
 * - Categorize errors by severity
 * - Extract stack traces
 * - Generate formatted error report
 * - Detect common issues automatically
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

// Error patterns to detect
const errorPatterns = {
  fatal: /FATAL EXCEPTION|AndroidRuntime|Process:.*died/i,
  error: /\bE\/|ERROR|Exception|Error:/i,
  warning: /\bW\/|WARNING|WARN/i,
  crash: /crash|SIGSEGV|SIGABRT/i,
  javascript: /ReactNativeJS|ExceptionsManager|JavaScriptError/i,
  network: /Network|HTTP|Connection|Socket/i,
  memory: /OutOfMemory|OOM|GC_|Memory/i,
};

// Common issues and solutions
const knownIssues = {
  'Unable to resolve module': {
    solution: 'Run: npm install && npx expo start --clear',
    severity: 'high',
  },
  'Metro bundler': {
    solution: 'Clear Metro cache: npx expo start --clear',
    severity: 'medium',
  },
  'Package manager': {
    solution: 'Restart ADB: adb kill-server && adb start-server',
    severity: 'high',
  },
  'EADDRINUSE': {
    solution: 'Port 8081 in use. Kill process or use different port.',
    severity: 'high',
  },
  'Network request failed': {
    solution: 'Check internet connection and Metro bundler status',
    severity: 'medium',
  },
};

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║          Android Error Analysis Tool                          ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Get emulator serial
let emulatorSerial;
try {
  const devices = execSync('adb devices', { encoding: 'utf-8' });
  const match = devices.match(/emulator-\d+/);
  if (match) {
    emulatorSerial = match[0];
    console.log(`${colors.green}✓${colors.reset} Found emulator: ${emulatorSerial}\n`);
  } else {
    console.log(`${colors.red}✗${colors.reset} No emulator detected\n`);
    console.log('Please start an emulator first.\n');
    process.exit(1);
  }
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} ADB not accessible\n`);
  process.exit(1);
}

// Fetch logcat
console.log('Fetching logcat from device...\n');

let logcat;
try {
  logcat = execSync(`adb -s ${emulatorSerial} logcat -d`, {
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024, // 10MB buffer
  });
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} Failed to fetch logcat\n`);
  process.exit(1);
}

// Parse logcat
const lines = logcat.split('\n');
const errors = [];
const warnings = [];
const crashes = [];
const jsErrors = [];

let currentError = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Detect error start
  if (errorPatterns.fatal.test(line)) {
    if (currentError) {
      crashes.push(currentError);
    }
    currentError = {
      type: 'FATAL',
      line: line,
      stackTrace: [],
      lineNumber: i,
    };
  } else if (errorPatterns.javascript.test(line)) {
    if (currentError) {
      jsErrors.push(currentError);
    }
    currentError = {
      type: 'JAVASCRIPT',
      line: line,
      stackTrace: [],
      lineNumber: i,
    };
  } else if (errorPatterns.error.test(line) && !currentError) {
    currentError = {
      type: 'ERROR',
      line: line,
      stackTrace: [],
      lineNumber: i,
    };
  } else if (errorPatterns.warning.test(line) && !currentError) {
    warnings.push({
      line: line,
      lineNumber: i,
    });
  }

  // Collect stack trace
  if (currentError && (line.startsWith('\tat ') || line.includes('Caused by:'))) {
    currentError.stackTrace.push(line);
  }

  // End of error block
  if (currentError && line.trim() === '' && currentError.stackTrace.length > 0) {
    if (currentError.type === 'FATAL') {
      crashes.push(currentError);
    } else if (currentError.type === 'JAVASCRIPT') {
      jsErrors.push(currentError);
    } else {
      errors.push(currentError);
    }
    currentError = null;
  }
}

// Generate report
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`${colors.cyan}ANALYSIS SUMMARY${colors.reset}\n`);
console.log(`  Fatal Crashes:     ${crashes.length > 0 ? colors.red : colors.green}${crashes.length}${colors.reset}`);
console.log(`  JavaScript Errors: ${jsErrors.length > 0 ? colors.red : colors.green}${jsErrors.length}${colors.reset}`);
console.log(`  General Errors:    ${errors.length > 0 ? colors.yellow : colors.green}${errors.length}${colors.reset}`);
console.log(`  Warnings:          ${warnings.length > 0 ? colors.yellow : colors.green}${warnings.length}${colors.reset}`);
console.log();

// Report crashes
if (crashes.length > 0) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`${colors.red}FATAL CRASHES (${crashes.length})${colors.reset}\n`);

  crashes.slice(0, 3).forEach((crash, idx) => {
    console.log(`${colors.red}[${idx + 1}]${colors.reset} ${crash.line.substring(0, 100)}`);
    if (crash.stackTrace.length > 0) {
      console.log(`${colors.gray}${crash.stackTrace.slice(0, 5).join('\n')}${colors.reset}`);
    }
    console.log();

    // Check for known issues
    for (const [issue, info] of Object.entries(knownIssues)) {
      if (crash.line.includes(issue)) {
        console.log(`${colors.yellow}  💡 Known Issue:${colors.reset} ${issue}`);
        console.log(`${colors.cyan}  Solution:${colors.reset} ${info.solution}\n`);
      }
    }
  });
}

// Report JS errors
if (jsErrors.length > 0) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`${colors.red}JAVASCRIPT ERRORS (${jsErrors.length})${colors.reset}\n`);

  jsErrors.slice(0, 5).forEach((error, idx) => {
    console.log(`${colors.red}[${idx + 1}]${colors.reset} ${error.line.substring(0, 100)}`);
    if (error.stackTrace.length > 0) {
      console.log(`${colors.gray}${error.stackTrace.slice(0, 3).join('\n')}${colors.reset}`);
    }
    console.log();
  });
}

// Report general errors
if (errors.length > 0 && errors.length <= 10) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`${colors.yellow}GENERAL ERRORS (${errors.length})${colors.reset}\n`);

  errors.forEach((error, idx) => {
    console.log(`${colors.yellow}[${idx + 1}]${colors.reset} ${error.line.substring(0, 100)}`);
  });
  console.log();
}

// Save detailed report
const reportPath = path.join(__dirname, 'android-error-report.json');
const report = {
  timestamp: new Date().toISOString(),
  emulator: emulatorSerial,
  summary: {
    crashes: crashes.length,
    jsErrors: jsErrors.length,
    errors: errors.length,
    warnings: warnings.length,
  },
  crashes: crashes.slice(0, 10),
  jsErrors: jsErrors.slice(0, 10),
  errors: errors.slice(0, 20),
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`${colors.green}✓${colors.reset} Detailed report saved: ${colors.cyan}android-error-report.json${colors.reset}\n`);

// Overall status
if (crashes.length === 0 && jsErrors.length === 0 && errors.length === 0) {
  console.log(`${colors.green}✓ No critical errors detected!${colors.reset}\n`);
  console.log('Your app appears to be running smoothly on Android.\n');
} else if (crashes.length > 0 || jsErrors.length > 0) {
  console.log(`${colors.red}⚠ Critical issues detected!${colors.reset}\n`);
  console.log('Please review the errors above and check the Debug tab in the app.\n');
} else {
  console.log(`${colors.yellow}⚠ Minor issues detected${colors.reset}\n`);
  console.log('Review warnings but app should be functional.\n');
}

console.log('Next steps:');
console.log('  1. Review errors in android-error-report.json');
console.log('  2. Check app Debug tab for detailed logs');
console.log('  3. Run: npm run test to verify fixes\n');
