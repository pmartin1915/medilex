// Jest setup file
// Note: @testing-library/react-native v12.4+ has built-in matchers, no need for extend-expect

// Polyfill for TextEncoder/TextDecoder (needed for some modules)
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Expo winter runtime to fix import errors
global.__ExpoImportMetaRegistry = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  has: jest.fn(() => false),
  clear: jest.fn(),
};

// Polyfill for structuredClone (needed by Expo)
if (!global.structuredClone) {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
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
  pause: jest.fn(),
  resume: jest.fn(),
  isSpeaking: jest.fn(() => Promise.resolve(false)),
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Mock react-native-view-shot
jest.mock('react-native-view-shot', () => ({
  captureRef: jest.fn(() => Promise.resolve('file:///mock-path/screenshot.png')),
  captureScreen: jest.fn(() => Promise.resolve('file:///mock-path/screenshot.png')),
}));

// Mock react-navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Mock errorLogger to reduce noise in tests
jest.mock('./src/utils/errorLogger', () => ({
  errorLogger: {
    logInfo: jest.fn(),
    logError: jest.fn(),
    logWarning: jest.fn(),
    getLogs: jest.fn(() => []),
    clearLogs: jest.fn(),
  },
}));

// Silence console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(), // Also silence log to reduce noise
};
