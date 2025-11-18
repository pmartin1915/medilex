// Setup global environment
global.__DEV__ = true;

// Mock Expo SDK 54's winter module system
global.__ExpoImportMetaRegistry = {
  register: jest.fn(),
  resolve: jest.fn(() => ({})),
};

// Polyfill structuredClone for Jest environment (required by Expo SDK 54)
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
}

// Mock AsyncStorage with in-memory storage
const mockAsyncStorage = (() => {
  let store = {};

  return {
    getItem: jest.fn((key) => Promise.resolve(store[key] || null)),
    setItem: jest.fn((key, value) => {
      store[key] = value;
      return Promise.resolve();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      store = {};
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
    multiGet: jest.fn((keys) =>
      Promise.resolve(keys.map(key => [key, store[key] || null]))
    ),
    multiSet: jest.fn((pairs) => {
      pairs.forEach(([key, value]) => { store[key] = value; });
      return Promise.resolve();
    }),
    multiRemove: jest.fn((keys) => {
      keys.forEach(key => delete store[key]);
      return Promise.resolve();
    }),
  };
})();

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

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
