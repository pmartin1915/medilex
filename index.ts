console.log('[INIT] 1. Starting app registration...');

try {
  console.log('[INIT] 2. Importing registerRootComponent...');
  const { registerRootComponent } = require('expo');
  
  console.log('[INIT] 3. Importing App component...');
  const App = require('./App').default;
  
  console.log('[INIT] 4. Registering root component...);
  registerRootComponent(App);
  
  console.log('[INIT] ✅ App registered successfully!');
} catch (error) {
  console.error('[INIT] ❌ FATAL:', error);
  console.error('[INIT] Message:', error instanceof Error ? error.message : String(error));
  console.error('[INIT] Stack:', error instanceof Error ? error.stack : 'No stack');
  throw error;
}
