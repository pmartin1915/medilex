import { vi } from 'vitest';

// Define React Native globals
(globalThis as Record<string, unknown>).__DEV__ = true;

// Provide jest compat for tests that use jest.fn() instead of vi.fn()
(globalThis as Record<string, unknown>).jest = vi;

// Mock AsyncStorage
const mockStorage: Record<string, string> = {};

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn((key: string) => Promise.resolve(mockStorage[key] || null)),
    setItem: vi.fn((key: string, value: string) => {
      mockStorage[key] = value;
      return Promise.resolve();
    }),
    removeItem: vi.fn((key: string) => {
      delete mockStorage[key];
      return Promise.resolve();
    }),
    clear: vi.fn(() => {
      Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
      return Promise.resolve();
    }),
    getAllKeys: vi.fn(() => Promise.resolve(Object.keys(mockStorage))),
    multiGet: vi.fn((keys: string[]) =>
      Promise.resolve(keys.map((key) => [key, mockStorage[key] || null]))
    ),
    multiSet: vi.fn((pairs: [string, string][]) => {
      pairs.forEach(([key, value]) => {
        mockStorage[key] = value;
      });
      return Promise.resolve();
    }),
  },
}));

// Mock expo-speech
vi.mock('expo-speech', () => ({
  speak: vi.fn(),
  stop: vi.fn(),
  isSpeakingAsync: vi.fn(() => Promise.resolve(false)),
  getAvailableVoicesAsync: vi.fn(() => Promise.resolve([])),
}));

// Mock react-native modules — fully static to avoid loading Flow-typed react-native/index.js
vi.mock('react-native', () => {
  const React = require('react');
  const createElement = React.createElement;

  const createMockComponent = (name: string) => {
    return ({ children, ...props }: Record<string, unknown>) =>
      createElement(name === 'Text' ? 'span' : 'div', props, children);
  };

  // TextInput renders as <input> so getByDisplayValue and fireEvent.change work
  const TextInputMock = ({ value, placeholder, onChangeText, placeholderTextColor, autoCapitalize, autoCorrect, ...props }: Record<string, unknown>) =>
    createElement('input', {
      value,
      placeholder,
      onChange: (e: { target: { value: string } }) => {
        if (typeof onChangeText === 'function') onChangeText(e.target.value);
      },
      ...props,
    });

  const mockAnimatedValue = () => ({
    setValue: vi.fn(),
    interpolate: vi.fn(() => 0),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    removeAllListeners: vi.fn(),
  });

  return {
    default: {},
    View: createMockComponent('View'),
    Text: createMockComponent('Text'),
    Image: createMockComponent('Image'),
    ScrollView: createMockComponent('ScrollView'),
    FlatList: createMockComponent('FlatList'),
    TouchableOpacity: createMockComponent('TouchableOpacity'),
    TextInput: TextInputMock,
    ActivityIndicator: createMockComponent('ActivityIndicator'),
    Platform: {
      OS: 'web',
      select: vi.fn((obj: Record<string, unknown>) => obj.web || obj.default),
    },
    Dimensions: {
      get: vi.fn(() => ({ width: 375, height: 812 })),
      addEventListener: vi.fn(() => ({ remove: vi.fn() })),
    },
    Animated: {
      View: createMockComponent('Animated.View'),
      Text: createMockComponent('Animated.Text'),
      Image: createMockComponent('Animated.Image'),
      ScrollView: createMockComponent('Animated.ScrollView'),
      FlatList: createMockComponent('Animated.FlatList'),
      timing: vi.fn(() => ({ start: vi.fn((cb?: () => void) => cb && cb()) })),
      spring: vi.fn(() => ({ start: vi.fn((cb?: () => void) => cb && cb()) })),
      Value: vi.fn(mockAnimatedValue),
      ValueXY: vi.fn(() => ({
        ...mockAnimatedValue(),
        x: mockAnimatedValue(),
        y: mockAnimatedValue(),
        getLayout: vi.fn(() => ({ left: 0, top: 0 })),
        getTranslateTransform: vi.fn(() => [{ translateX: 0 }, { translateY: 0 }]),
      })),
      createAnimatedComponent: vi.fn((component: unknown) => component),
    },
    PanResponder: {
      create: vi.fn(() => ({
        panHandlers: {},
      })),
    },
    StyleSheet: {
      create: vi.fn((styles: Record<string, unknown>) => styles),
      flatten: vi.fn((style: unknown) => style),
    },
    useWindowDimensions: vi.fn(() => ({ width: 375, height: 812 })),
    useColorScheme: vi.fn(() => 'light'),
  };
});

// Mock react-native-gesture-handler
vi.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
  PanGestureHandler: ({ children }: { children: React.ReactNode }) => children,
  TapGestureHandler: ({ children }: { children: React.ReactNode }) => children,
  State: {},
  Directions: {},
}));

// Mock react-native-safe-area-context
vi.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock @react-navigation
vi.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
  useNavigation: () => ({
    navigate: vi.fn(),
    goBack: vi.fn(),
    setOptions: vi.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useFocusEffect: vi.fn(),
}));

// Mock lucide-react-native icons
vi.mock('lucide-react-native', () => ({
  Search: () => null,
  X: () => null,
  Heart: () => null,
  Bookmark: () => null,
  ChevronRight: () => null,
  ChevronLeft: () => null,
  Play: () => null,
  Volume2: () => null,
  Check: () => null,
  Plus: () => null,
  Settings: () => null,
  Home: () => null,
  Book: () => null,
  Brain: () => null,
  Info: () => null,
}));

// Suppress console warnings in tests
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    (message.includes('React does not recognize') ||
      message.includes('Unknown event handler property'))
  ) {
    return;
  }
  originalWarn.apply(console, args);
};
