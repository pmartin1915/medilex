import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Home, BookOpen, Library, TrendingUp, Bug } from 'lucide-react-native';
import ErrorBoundary from './src/components/ErrorBoundary';
import { StartupLoader } from './src/components/StartupLoader';
import { HomeScreen } from './src/screens/HomeScreen';
import { LearnScreen } from './src/screens/LearnScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { DebugScreen } from './src/screens/DebugScreen';
import { useWordStore } from './src/store/wordStore';
import { useStreakStore } from './src/store/streakStore';
import { theme } from './src/theme/theme';

const Tab = createBottomTabNavigator();

function AppContent() {
  const loadTerms = useWordStore(state => state.loadTerms);
  const loadStreak = useStreakStore(state => state.loadStreak);

  useEffect(() => {
    const initializeStores = async () => {
      try {
        // Dynamically import errorLogger only when needed
        const { errorLogger } = await import('./src/utils/errorLogger');
        errorLogger.logInfo('Loading app stores...', 'App');
        await loadTerms();
        await loadStreak();
        errorLogger.logInfo('App stores loaded successfully', 'App');
      } catch (error: any) {
        console.error('Failed to load stores:', error);
      }
    };

    initializeStores();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.cardBackground,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            height: 84,
            paddingBottom: 20,
            paddingTop: 8,
          },
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: theme.colors.textTertiary,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Learn"
          component={LearnScreen}
          options={{
            tabBarLabel: 'Learn',
            tabBarIcon: ({ color, size }) => (
              <BookOpen size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Library"
          component={LibraryScreen}
          options={{
            tabBarLabel: 'Library',
            tabBarIcon: ({ color, size }) => (
              <Library size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            tabBarLabel: 'Progress',
            tabBarIcon: ({ color, size }) => (
              <TrendingUp size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Debug"
          component={DebugScreen}
          options={{
            tabBarLabel: 'Debug',
            tabBarIcon: ({ color, size }) => (
              <Bug size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [startupComplete, setStartupComplete] = useState(false);

  const handleStartupComplete = async (success: boolean) => {
    try {
      // Dynamically import errorLogger only after startup
      const { errorLogger } = await import('./src/utils/errorLogger');
      if (success) {
        errorLogger.logInfo('Startup completed successfully', 'App');
      } else {
        errorLogger.logError('error', 'Startup failed - app may not work correctly', undefined, undefined, 'App');
      }
    } catch (error) {
      console.log('Startup complete:', success);
    }
    setStartupComplete(true);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <StartupLoader onComplete={handleStartupComplete}>
          {startupComplete && <AppContent />}
        </StartupLoader>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
