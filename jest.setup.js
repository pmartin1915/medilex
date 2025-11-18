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

// Mock AsyncStorage - create mocked functions that will be shared across all imports
const createAsyncStorageMock = () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
  mergeItem: jest.fn(() => Promise.resolve()),
  flushGetRequests: jest.fn(() => Promise.resolve()),
  multiMerge: jest.fn(() => Promise.resolve()),
});

const mockAsyncStorageInstance = createAsyncStorageMock();

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    __esModule: true,
    default: mockAsyncStorageInstance,
    ...mockAsyncStorageInstance,
  };
});

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

// Mock React Native Animated API to prevent native module errors
global.requestAnimationFrame = (cb) => {
  setTimeout(cb, 0);
  return 0;
};

// Mock the native module access to prevent "Cannot read properties of undefined (reading 'S')" errors
// This happens when TouchableOpacity tries to use Animated API
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  // Mock the NativeAnimatedModule
  RN.NativeModules = RN.NativeModules || {};
  RN.NativeModules.NativeAnimatedModule = {
    createAnimatedNode: jest.fn(),
    startListeningToAnimatedNodeValue: jest.fn(),
    stopListeningToAnimatedNodeValue: jest.fn(),
    connectAnimatedNodes: jest.fn(),
    disconnectAnimatedNodes: jest.fn(),
    startAnimatingNode: jest.fn(),
    stopAnimation: jest.fn(),
    setAnimatedNodeValue: jest.fn(),
    setAnimatedNodeOffset: jest.fn(),
    flattenAnimatedNodeOffset: jest.fn(),
    extractAnimatedNodeOffset: jest.fn(),
    connectAnimatedNodeToView: jest.fn(),
    disconnectAnimatedNodeFromView: jest.fn(),
    restoreDefaultValues: jest.fn(),
    dropAnimatedNode: jest.fn(),
    addAnimatedEventToView: jest.fn(),
    removeAnimatedEventFromView: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    getValue: jest.fn(),
  };

  RN.NativeModules.PlatformConstants = RN.NativeModules.PlatformConstants || {
    isTesting: true,
    reactNativeVersion: { major: 0, minor: 70, patch: 0 },
  };

  RN.NativeModules.UIManager = RN.NativeModules.UIManager || {};
  RN.NativeModules.UIManager.getViewManagerConfig = jest.fn(() => ({ Commands: {} }));

  // Disable native driver to force JS-only animations
  if (RN.Animated && RN.Animated.timing) {
    const originalTiming = RN.Animated.timing;
    RN.Animated.timing = (value, config) => {
      return originalTiming(value, { ...config, useNativeDriver: false });
    };
  }

  return RN;
});

// Comprehensive mock for react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');

  // Create a mock component that accepts children and passes through props
  const createMockComponent = (name) => {
    const MockComponent = React.forwardRef((props, ref) => {
      return React.createElement(View, { ...props, ref }, props.children);
    });
    MockComponent.displayName = name;
    return MockComponent;
  };

  return {
    GestureHandlerRootView: createMockComponent('GestureHandlerRootView'),
    GestureDetector: createMockComponent('GestureDetector'),
    PanGestureHandler: createMockComponent('PanGestureHandler'),
    TapGestureHandler: createMockComponent('TapGestureHandler'),
    Gesture: {
      Pan: () => ({
        onStart: jest.fn().mockReturnThis(),
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
        onFinalize: jest.fn().mockReturnThis(),
        onChange: jest.fn().mockReturnThis(),
        onTouchesDown: jest.fn().mockReturnThis(),
        onTouchesUp: jest.fn().mockReturnThis(),
        withTestId: jest.fn().mockReturnThis(),
      }),
      Tap: () => ({
        onStart: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
        withTestId: jest.fn().mockReturnThis(),
      }),
    },
    State: {
      BEGAN: 'BEGAN',
      FAILED: 'FAILED',
      ACTIVE: 'ACTIVE',
      END: 'END',
      CANCELLED: 'CANCELLED',
      UNDETERMINED: 'UNDETERMINED',
    },
    Directions: {
      RIGHT: 1,
      LEFT: 2,
      UP: 4,
      DOWN: 8,
    },
    // Mock gesture handler context methods
    runOnJS: (fn) => fn,
    useSharedValue: (initialValue) => ({ value: initialValue }),
    useAnimatedStyle: (callback) => callback(),
    useAnimatedGestureHandler: (handlers) => handlers,
    useAnimatedReaction: jest.fn(),
    withSpring: (value) => value,
    withTiming: (value) => value,
    withDecay: (value) => value,
  };
});

// Silence console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(), // Also silence log to reduce noise
};
