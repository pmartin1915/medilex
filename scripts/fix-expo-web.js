/**
 * Fix Expo web export for ES modules compatibility
 *
 * Expo SDK 54 generates JavaScript bundles using import.meta but doesn't add
 * type="module" to the script tag. This script fixes the index.html after export.
 */
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');

if (!fs.existsSync(indexPath)) {
  console.log('dist/index.html not found, skipping fix');
  process.exit(0);
}

let html = fs.readFileSync(indexPath, 'utf-8');

// Add type="module" to script tags that load the bundle
// Before: <script src="/_expo/static/js/web/index-xxx.js" defer></script>
// After:  <script type="module" src="/_expo/static/js/web/index-xxx.js"></script>
const before = html;
html = html.replace(
  /<script src="(\/_expo\/static\/js\/web\/[^"]+\.js)" defer(="")?><\/script>/g,
  '<script type="module" src="$1"></script>'
);

if (before === html) {
  console.log('No changes needed to index.html');
} else {
  fs.writeFileSync(indexPath, html);
  console.log('Fixed index.html: added type="module" to script tags');
}
