/**
 * MINIMAL TEST APP
 * 
 * Use this to verify the runtime error is fixed before testing full app.
 * 
 * To test:
 * 1. Rename App.tsx to App.full.tsx
 * 2. Rename App.minimal.test.tsx to App.tsx
 * 3. Run: npx expo start --clear
 * 4. If this loads successfully, the fix works!
 * 5. Then restore: rename App.full.tsx back to App.tsx
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Minimal Test</Text>
      <Text style={styles.subtitle}>If you see this, the runtime error is fixed!</Text>
      <Text style={styles.info}>No imports, no stores, no navigation</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
  },
  info: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
});
