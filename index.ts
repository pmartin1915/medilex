console.log('[INIT] 1. Starting app registration...');

// Check if AsyncStorage is available
try {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  console.log('[INIT] 2. AsyncStorage available:', typeof AsyncStorage);
} catch (e) {
  console.error('[INIT] 2. AsyncStorage NOT available:', e);
}

try {
  console.log('[INIT] 3. Importing registerRootComponent...');
  const { registerRootComponent } = require('expo');
  
  console.log('[INIT] 4. Importing App component...');
  const App = require('./App').default;
  
  console.log('[INIT] 5. Registering root component...');
  registerRootComponent(App);
  
  console.log('[INIT] ✅ App registered successfully!');
} catch (error) {
  console.error('[INIT] ❌ FATAL:', error);
  console.error('[INIT] Message:', error instanceof Error ? error.message : String(error));
  console.error('[INIT] Stack:', error instanceof Error ? error.stack : 'No stack');
  throw error;
}
