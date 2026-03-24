#!/usr/bin/env node
/**
 * Patches react-native/index.js to redirect to react-native-web.
 * Required because the original index.js contains Flow syntax (import typeof)
 * that Node/Vite cannot parse, breaking vitest.
 *
 * Run automatically via postinstall, or manually: node scripts/patch-rn.js
 */
const fs = require('fs');
const path = require('path');

const rnIndex = path.join(__dirname, '..', 'node_modules', 'react-native', 'index.js');

if (!fs.existsSync(rnIndex)) {
  console.log('[patch-rn] react-native not installed, skipping');
  process.exit(0);
}

const content = fs.readFileSync(rnIndex, 'utf8');
if (content.includes('import typeof')) {
  const backup = rnIndex + '.flow.bak';
  if (!fs.existsSync(backup)) {
    fs.copyFileSync(rnIndex, backup);
  }
  fs.writeFileSync(rnIndex,
    '// Patched by scripts/patch-rn.js for vitest compatibility\n' +
    'module.exports = require("react-native-web");\n'
  );
  console.log('[patch-rn] Patched react-native/index.js -> react-native-web');
} else {
  console.log('[patch-rn] Already patched, skipping');
}
