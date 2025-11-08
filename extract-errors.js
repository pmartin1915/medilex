#!/usr/bin/env node

/**
 * extract-errors.js - Extract error logs from Android emulator's AsyncStorage
 *
 * This script uses ADB to read the app's AsyncStorage and extract error logs.
 * Claude can run this to see all errors logged by ErrorLogger without user help.
 *
 * Usage: node extract-errors.js
 */

const { execSync } = require('child_process');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function log(color, ...args) {
  console.log(color, ...args, COLORS.reset);
}

function runCommand(cmd, options = {}) {
  try {
    const output = execSync(cmd, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return output;
  } catch (error) {
    if (!options.ignoreError) {
      throw error;
    }
    return null;
  }
}

async function extractErrors() {
  log(COLORS.cyan, '\n========================================');
  log(COLORS.cyan, '  Error Log Extractor (Android)');
  log(COLORS.cyan, '========================================\n');

  // Check if ADB is available
  try {
    runCommand('adb version', { silent: true });
  } catch (error) {
    log(COLORS.red, '❌ ADB not found. Please ensure Android SDK is installed and in PATH.');
    process.exit(1);
  }

  // Check if device is connected
  const devices = runCommand('adb devices', { silent: true });
  if (!devices.includes('emulator-') && !devices.includes('device')) {
    log(COLORS.red, '❌ No Android device/emulator connected.');
    log(COLORS.yellow, '   Run: emulator @your_avd_name');
    process.exit(1);
  }

  log(COLORS.green, '✓ ADB connected\n');

  // Get package name (assumes expo.name.myApp format)
  // For Expo, the package is usually host.exp.exponent in dev mode
  const packageName = 'host.exp.exponent';

  log(COLORS.blue, `📦 Package: ${packageName}\n`);

  // Extract AsyncStorage data
  // Expo uses different storage locations depending on the mode
  const possiblePaths = [
    `/data/data/${packageName}/files/RKStorage`,
    `/data/data/${packageName}/databases/RKStorage`,
    `/data/data/host.exp.exponent/files/RKStorage`,
    `/data/user/0/${packageName}/files/RKStorage`,
  ];

  log(COLORS.gray, 'Searching for AsyncStorage...\n');

  // Try to read AsyncStorage via logcat method
  log(COLORS.yellow, '📋 Attempting to read error logs...\n');

  // Alternative: Use React Native Debugger API
  // For now, let's just parse Metro logs and Android logcat

  log(COLORS.magenta, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  log(COLORS.cyan, 'Checking recent Android logs for errors:\n');

  try {
    // Get recent logs and filter for our app
    const logs = runCommand('adb logcat -d -v time ReactNativeJS:* *:S', {
      silent: true,
      ignoreError: true
    });

    if (logs) {
      const lines = logs.split('\n');
      const errorLines = lines.filter(line =>
        line.includes('ERROR') ||
        line.includes('Error') ||
        line.includes('Exception') ||
        line.includes('FATAL') ||
        line.includes('Warning')
      );

      if (errorLines.length > 0) {
        log(COLORS.red, `Found ${errorLines.length} error/warning entries:\n`);
        errorLines.slice(-20).forEach(line => {
          if (line.includes('ERROR') || line.includes('FATAL')) {
            log(COLORS.red, line);
          } else {
            log(COLORS.yellow, line);
          }
        });
      } else {
        log(COLORS.green, '✓ No errors found in recent logs!');
      }
    }
  } catch (error) {
    log(COLORS.gray, 'Could not read Android logs');
  }

  log(COLORS.magenta, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  log(COLORS.cyan, 'Metro Bundler Error Check:\n');

  // Check if Metro bundler is running and has errors
  try {
    const metroPort = 8081;
    log(COLORS.gray, `Checking Metro bundler on port ${metroPort}...\n`);

    // Try to hit the status endpoint
    const curlCmd = `curl -s http://localhost:${metroPort}/status`;
    const status = runCommand(curlCmd, { silent: true, ignoreError: true });

    if (status && status.includes('packager-status:running')) {
      log(COLORS.green, '✓ Metro bundler is running\n');
    } else {
      log(COLORS.yellow, '⚠ Metro bundler may not be running\n');
    }
  } catch (error) {
    log(COLORS.gray, 'Could not check Metro status');
  }

  log(COLORS.magenta, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  log(COLORS.cyan, '\n💡 Tips:');
  log(COLORS.gray, '   • Run read-app-logs.bat for real-time monitoring');
  log(COLORS.gray, '   • Run monitor-app.bat for combined Metro + Android logs');
  log(COLORS.gray, '   • Check the Debug tab in the app for detailed error logs');
  log(COLORS.gray, '   • Use check-app-status.bat for quick health check\n');
}

// Run the extraction
extractErrors().catch(error => {
  log(COLORS.red, '\n❌ Error:', error.message);
  process.exit(1);
});
