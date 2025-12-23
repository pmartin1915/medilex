import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.expo'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', 'src/test/**', '**/*.d.ts'],
    },
    server: {
      deps: {
        inline: [
          'react-native',
          '@testing-library/react-native',
          'react-native-web',
          '@react-native-async-storage/async-storage',
          'expo-speech',
          'react-native-gesture-handler',
          'react-native-safe-area-context',
          'react-native-screens',
          '@react-navigation/native',
          '@react-navigation/native-stack',
          '@react-navigation/bottom-tabs',
          'lucide-react-native',
        ],
      },
    },
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
});
