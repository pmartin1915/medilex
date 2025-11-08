import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Home, BookOpen, Library, TrendingUp } from 'lucide-react-native';
import ErrorBoundary from './src/components/ErrorBoundary';
import { HomeScreen } from './src/screens/HomeScreen';
import { LearnScreen } from './src/screens/LearnScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { useWordStore } from './src/store/wordStore';
import { useStreakStore } from './src/store/streakStore';
import { theme } from './src/theme/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  const loadTerms = useWordStore(state => state.loadTerms);
  const loadStreak = useStreakStore(state => state.loadStreak);

  useEffect(() => {
    loadTerms();
    loadStreak();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
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
          </Tab.Navigator>
        </NavigationContainer>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
