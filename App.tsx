import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NavigationContainerRef } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Home, BookOpen, Library, TrendingUp, Bug } from 'lucide-react-native';

import ErrorBoundary from './src/components/ErrorBoundary';
import { ErrorToast } from './src/components/ErrorToast';
import { HomeScreen } from './src/screens/HomeScreen';
import { LearnScreen } from './src/screens/LearnScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { DebugScreen } from './src/screens/DebugScreen';
import { useWordStore } from './src/store/wordStore';
import { useStreakStore } from './src/store/streakStore';
import { theme } from './src/theme/theme';
import { getErrorLogger } from './src/utils/errorLogger';

const Tab = createBottomTabNavigator();

function AppContent() {
  const loadTerms = useWordStore(state => state.loadTerms);
  const loadStreak = useStreakStore(state => state.loadStreak);
  const [errorCount, setErrorCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize error logger first
        const errorLogger = getErrorLogger();
        await errorLogger.initialize();
        
        // Load stores
        await loadTerms();
        await loadStreak();
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Init error:', error);
        setIsInitialized(true); // Continue anyway
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    
    // Poll for error count updates
    const interval = setInterval(() => {
      try {
        const errorLogger = getErrorLogger();
        const logs = errorLogger.getLogs();
        const errors = logs.filter(log => log.type === 'error').length;
        setErrorCount(errors);
      } catch (error) {
        // Ignore errors during polling
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isInitialized]);

  const DebugIcon = ({ color, size }: { color: string; size: number }) => (
    <View style={styles.debugIconContainer}>
      <Bug size={size} color={color} />
      {errorCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{errorCount > 99 ? '99+' : errorCount}</Text>
        </View>
      )}
    </View>
  );

  const handleToastPress = () => {
    // Navigate to Debug tab when toast is pressed
    navigationRef.current?.navigate('Debug');
  };

  return (
    <>
      <NavigationContainer ref={navigationRef}>
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
            tabBarIcon: DebugIcon,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
      <ErrorToast onPress={handleToastPress} />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  debugIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
