// Setup global environment
global.__DEV__ = true;

// Mock Expo SDK 54's winter module system
global.__ExpoImportMetaRegistry = {
  register: jest.fn(),
  resolve: jest.fn(() => ({})),
};

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock expo-speech
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  isSpeakingAsync: jest.fn(() => Promise.resolve(false)),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }) => children,
  PanGestureHandler: ({ children }) => children,
  State: {},
  Directions: {},
  GestureDetector: ({ children }) => children,
  Gesture: {},
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const mockIcon = (name) => {
    return React.forwardRef((props, ref) =>
      React.createElement('Icon', { ...props, ref, testID: `icon-${name}` })
    );
  };

  return {
    Home: mockIcon('Home'),
    BookOpen: mockIcon('BookOpen'),
    Library: mockIcon('Library'),
    TrendingUp: mockIcon('TrendingUp'),
    Bug: mockIcon('Bug'),
    Volume2: mockIcon('Volume2'),
    Heart: mockIcon('Heart'),
    Bookmark: mockIcon('Bookmark'),
    Info: mockIcon('Info'),
    Search: mockIcon('Search'),
  };
});

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Suppress console warnings in tests
console.warn = jest.fn();
console.error = jest.fn();
