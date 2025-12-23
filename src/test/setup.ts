import { vi } from 'vitest';

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

// Mock react-native modules
vi.mock('react-native', async () => {
  const actual = await vi.importActual('react-native-web');
  return {
    ...actual,
    Platform: {
      OS: 'web',
      select: vi.fn((obj) => obj.web || obj.default),
    },
    Dimensions: {
      get: vi.fn(() => ({ width: 375, height: 812 })),
      addEventListener: vi.fn(() => ({ remove: vi.fn() })),
    },
    Animated: {
      View: 'View',
      Text: 'Text',
      Image: 'Image',
      ScrollView: 'ScrollView',
      FlatList: 'FlatList',
      timing: vi.fn(() => ({ start: vi.fn() })),
      spring: vi.fn(() => ({ start: vi.fn() })),
      Value: vi.fn(() => ({
        setValue: vi.fn(),
        interpolate: vi.fn(() => 0),
      })),
      createAnimatedComponent: vi.fn((component) => component),
    },
    StyleSheet: {
      create: vi.fn((styles) => styles),
      flatten: vi.fn((style) => style),
    },
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
