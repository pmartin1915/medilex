// Setup global environment
global.__DEV__ = true;

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-speech
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    State: {},
    Directions: {},
  };
});

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  return {
    Home: () => React.createElement('Home'),
    BookOpen: () => React.createElement('BookOpen'),
    Library: () => React.createElement('Library'),
    TrendingUp: () => React.createElement('TrendingUp'),
    Bug: () => React.createElement('Bug'),
    Volume2: () => React.createElement('Volume2'),
    Heart: () => React.createElement('Heart'),
    Bookmark: () => React.createElement('Bookmark'),
    Info: () => React.createElement('Info'),
    Search: () => React.createElement('Search'),
  };
});

// Suppress console warnings in tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
